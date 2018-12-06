#!/bin/bash

if [ -f "bin/*.wasm" ]; then
    mocha ./test/node/*.test.js
fi