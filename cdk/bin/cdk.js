#!/usr/bin/env node

// @ts-ignore: Cannot find declaration file
require('source-map-support/register');
const cdk = require('@aws-cdk/core');
const { CdkStack } = require('../lib/cdk-stack');

const app = new cdk.App();
new CdkStack(app, 'CdkStack', {
  env: {
    account: "037501505642",
    region: "us-east-1"
  }
});
