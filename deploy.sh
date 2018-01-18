#!/bin/bash

source ./env.sh

npm run build

cd ./dist/
cp index.html 200.html
surge . --domain https://recipes.bhdouglass.com
