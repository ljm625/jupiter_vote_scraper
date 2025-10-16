#!/bin/bash
cd /data
npm install
Xvfb :99 -screen 0 1024x768x24 & DISPLAY=:99 node main.js