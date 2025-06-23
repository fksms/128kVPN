#!/bin/bash

# Enable IP forwarding
iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE

# Create and activate the Wireguard interface
ip link add dev ${WG_INTERFACE_NAME} type wireguard
ip address add dev ${WG_INTERFACE_NAME} ${WG_INTERFACE_IP}
ip link set up dev ${WG_INTERFACE_NAME} mtu ${WG_INTERFACE_MTU}

# IFB interface name
IFB_INTERFACE_NAME='ifb0'

# Bandwidth limit
RATE='128kbit'

# Create and activate the IFB interface
ip link add dev ${IFB_INTERFACE_NAME} type ifb
ip link set up dev ${IFB_INTERFACE_NAME}

# Initialize qdisks for traffic control
tc qdisc del dev ${WG_INTERFACE_NAME} root 2>/dev/null
tc qdisc del dev ${IFB_INTERFACE_NAME} root 2>/dev/null
tc qdisc del dev ${WG_INTERFACE_NAME} ingress 2>/dev/null

# Add HTB root qdisc
tc qdisc add dev ${WG_INTERFACE_NAME} root handle 1: htb default 999 # Egress traffic (Server -> Client)
tc qdisc add dev ${IFB_INTERFACE_NAME} root handle 1: htb default 999 # Ingress traffic (Client -> Server)

# Default class
tc class add dev ${WG_INTERFACE_NAME} parent 1: classid 1:1 htb rate 100mbit ceil 100mbit # Egress traffic (Server -> Client)
tc class add dev ${IFB_INTERFACE_NAME} parent 1: classid 1:1 htb rate 100mbit ceil 100mbit # Ingress traffic (Client -> Server)

tc class add dev ${WG_INTERFACE_NAME} parent 1: classid 1:999 htb rate 100mbit ceil 100mbit # Egress traffic (Server -> Client)
tc class add dev ${IFB_INTERFACE_NAME} parent 1: classid 1:999 htb rate 100mbit ceil 100mbit # Ingress traffic (Client -> Server)

# 254 Addresses
for i in $(seq 2 254); do
    ip="10.0.0.$i"

    # Per-client egress limit classes and filters
    tc class add dev ${WG_INTERFACE_NAME} parent 1:1 classid 1:$i htb rate ${RATE} ceil ${RATE}
    tc filter add dev ${WG_INTERFACE_NAME} protocol ip parent 1:0 prio 1 u32 match ip dst $ip flowid 1:$i

    # Per-client ingress limit classes and filters
    tc class add dev ${IFB_INTERFACE_NAME} parent 1:1 classid 1:$i htb rate ${RATE} ceil ${RATE}
    tc filter add dev ${IFB_INTERFACE_NAME} protocol ip parent 1:0 prio 1 u32 match ip src $ip flowid 1:$i
done

# Add ingress qdisc to WireGuard interface
tc qdisc add dev ${WG_INTERFACE_NAME} ingress handle ffff:

# Redirect ingress packets to ifb device
tc filter add dev ${WG_INTERFACE_NAME} parent ffff: protocol ip u32 match u32 0 0 action mirred egress redirect dev ${IFB_INTERFACE_NAME}

# Start the application
exec dumb-init node server.js