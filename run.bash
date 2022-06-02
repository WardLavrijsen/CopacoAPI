#!/bin/bash

sudo apt-get update
sudo apt-get upgrade

sudo apt-get install python-software-properties

curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -

sudo apt-get install nodejs