#!/usr/bin/env bash

# Do webpack build
rm -rf ./app
yarn react-scripts build
mkdir app

# Copy files into app directory
cp -r ./build ./app
cp ./package.json ./app
cp ./main.js ./app
cp ./icon.png ./app

# Install prod dependencies
cd ./app
yarn install --production
cd ..