#!/bin/bash

# WireGuard Setup
ip link add dev ${WG_INTERFACE_NAME} type wireguard
ip address add dev ${WG_INTERFACE_NAME} ${WG_INTERFACE_IP}

# Start the application
npm run dev