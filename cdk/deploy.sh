#!/bin/bash

export CDK_DEFAULT_ACCOUNT=037501505642
export CDK_DEFAULT_REGION=us-east-1
export AWS_REGION=us-east-1 

CDK_DEFAULT_ACCOUNT=037501505642 CDK_DEFAULT_REGION=us-east-1 AWS_REGION=us-east-1 ./node_modules/.bin/cdk deploy --profile sblackstone
