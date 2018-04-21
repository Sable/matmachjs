#!/bin/bash
file=$1
filebase=$(basename $1)

filename="${filebase%.*}"
echo -e -n "\033[1;94m"
echo $filebase
echo -e -n '\033[0m'
if [ -f "./test/browser/file.wasm" ]; then
    rm ./test/browser/file.wasm
fi
wat2wasm ./src/$file -o ./test/browser/file.wasm
if [ -f "./test/browser/file.wasm" ]; then
    ~/Documents/chrome-versions/chromium63/chrome http://localhost:8000/index.html
fi