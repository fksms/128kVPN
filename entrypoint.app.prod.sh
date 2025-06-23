#!/bin/bash

# Create and activate the Wireguard interface
ip link add dev ${WG_INTERFACE_NAME} type wireguard
ip address add dev ${WG_INTERFACE_NAME} ${WG_INTERFACE_IP}
ip link set up dev ${WG_INTERFACE_NAME} mtu ${WG_INTERFACE_MTU}

# Enable IP forwarding
iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE

# Start the application
exec dumb-init node server.js