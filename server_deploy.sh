#!/bin/bash
echo "Deploying application ..."

pm2 stop all
git pull
yarn build
pm2 start all

echo "🚀 Application deployed!"