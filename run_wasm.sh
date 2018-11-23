#!/bin/bash
file=$1
filepath="${file%.*}"
filebase=$(basename $1)
filename="${filebase%.*}"
echo -e -n "\033[1;94m"
echo $filebase
echo -e -n '\033[0m'
if [ -f "bin/$filename.wasm" ]; then
    rm bin/$filename.wasm
fi
wat2wasm $file -o bin/$filename.wasm