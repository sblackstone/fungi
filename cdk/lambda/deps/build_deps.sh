#!/bin/bash


mkdir -p work
export PYTHONUSERBASE="$(pwd)/work"
echo $PYTHONUSERBASE
rm -rf v-env

python3.6 -m venv v-env

source v-env/bin/activate

pip3.6 install -r requirements.txt --user

rm -rf python
mkdir -p python

rm -rf work/lib/python/site-packages/*-info
cp -a work/lib/python/site-packages/* ./python

rm -rf work
rm -rf v-env
