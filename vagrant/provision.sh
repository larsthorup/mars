#!/usr/bin/env bash

echo "Installing NodeJS..."
apt-get update >/dev/null 2>&1
apt-get install -y python-software-properties python g++ make >/dev/null 2>&1
add-apt-repository -y ppa:chris-lea/node.js >/dev/null 2>&1
apt-get update >/dev/null 2>&1
apt-get install -y nodejs >/dev/null 2>&1

