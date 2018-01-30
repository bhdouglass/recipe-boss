#!/bin/bash

source ./env.sh
export APP_MODE="1"

npm run build

sed -i 's#/static#static#g' ./dist/index.html

mkdir -p ./dist/static/css/static/fonts/
mv ./dist/static/fonts/* ./dist/static/css/static/fonts/
rmdir ./dist/static/fonts/

rm -rf ./ubuntu-touch-app/www/
mkdir -p ./ubuntu-touch-app/www/
cp -r ./dist/* ./ubuntu-touch-app/www/
