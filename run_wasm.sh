#!/bin/bash
file=$1
filebase=$(basename $1)
filename="${filebase%.*}"
echo -e -n "\033[1;94m"
echo $filebase
echo -e -n '\033[0m'
rm bin/$filename.wasm
wat2wasm $file -o bin/$filename.wasm
if [ -f "bin/$filename.wasm" ]; then
    wasm-interp bin/$filename.wasm --trace
fi