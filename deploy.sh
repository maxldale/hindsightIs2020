#!/bin/bash

# Clean dist
rm -rf dist
npx expo export

# Move contents out of _expo
mkdir -p dist/static/js
mkdir -p dist/static/css
cp dist/_expo/static/js/* dist/static/js/
cp dist/_expo/static/css/* dist/static/css/

# Fix paths in index.html
sed -i 's|/_expo/static/|/static/|g' dist/index.html

# Add CNAME
echo "hindsightis2020.maxldale.com" > dist/CNAME

# Deploy
npx gh-pages -d dist