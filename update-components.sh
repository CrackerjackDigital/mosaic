#!/bin/bash
echo "1/3: setting up environment"
dir=$(cd -P -- "$(dirname -- "$0")" && pwd -P)
cd $dir
echo "In directory `pwd`"
if [ !-d "vendor" ]; then
	mkdir vendor
fi
echo "2/3: deleting existing components"
rm -vfr vendor/* components/*
echo "please don't build me SilverStripe" > vendor/_manifest_exclude
export COMPOSER=components.json;
echo "3/3: updating components using $COMPOSER"
composer update --prefer-dist --no-dev
cd -
echo "done"
