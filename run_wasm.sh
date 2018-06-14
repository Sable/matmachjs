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
    rm bin/$filename-standalone.wasm
fi
sed -e 's/\(^[ ]*(func $assert\)/\    \;; (func $assert/g' -e 's/\(^[ ]*(func $printDouble\)/\    \;; (func $printDouble/g' -e 's/\(^[ ]*(func $printString\)/\    \;; (func $printString/g' -e 's/\(^[ ]*(func $printError\)/\    \;; (func $printError/g' -e 's/\(^[ ]*;; (import\)/\    \(import/g' -e 's/\(^[ ]*;; (import\)/\    \(import/g' -e 's/\(^[ ]*(mem\)/\    \;; (mem/g' $file > $filepath-temp.wat
wat2wasm $filepath-temp.wat -o bin/$filename.wasm
wat2wasm $file -o bin/$filename-standalone.wasm
rm $filepath-temp.wat

if [ -f "bin/$filename.wasm" ]; then
    wasm-interp bin/$filename-standalone.wasm --trace
fi