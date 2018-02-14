#!/usr/bin/env bash
rm -r platforms/ node_modules/ plugins/
npm install
sh install-plugins.sh
ionic cordova platform add android
