const cdk = require('@aws-cdk/core');
const s3  = require('@aws-cdk/aws-s3');
const s3deploy = require('@aws-cdk/aws-s3-deployment');
const lambda = require("@aws-cdk/aws-lambda");
const cloudfront = require("@aws-cdk/aws-cloudfront");

class CdkStack extends cdk.Stack {
  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */

  addDepLayer() {
   // Python dependencies for the lambda functions..
   this.depLayer = new lambda.LayerVersion(this, 'depLayer', {
     code: lambda.Code.asset('lambda/deps'),
     compatibleRuntimes: [lambda.Runtime.PYTHON_3_6],
   });

  }
  
  createCdn() {
    this.distribution = new cloudfront.CloudFrontWebDistribution(this, 'websiteDist', {
        originConfigs: [
            {
                s3OriginSource: {
                    s3BucketSource: this.websiteBucket
                },
                behaviors : [ {isDefaultBehavior: true}]
            }
        ]
     });
  }

  createWebsite() {
    this.websiteBucket = new s3.Bucket(this, 'Website', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true
    });

    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [s3deploy.Source.asset('../build')],
      destinationBucket: this.websiteBucket,
      //destinationKeyPrefix: 'web/static' // optional prefix in destination bucket
    });  }

  createBucket() {
    this.bucket = new s3.Bucket(this, 'fungiBucket', {
      versioned: false,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      cors: [{
        allowedMethods: ["GET"],
        allowedOrigins: ["*"]
      }],
    });
  }

  createLambda() {
    this.importLambda = new lambda.Function(this, 'importLambda', {
      runtime: lambda.Runtime.PYTHON_3_6,
      code: lambda.Code.asset('lambda/importLambda'),
      handler: 'importLambda.importLambda',
      timeout: cdk.Duration.seconds(900),
      layers: [ this.depLayer],
      environment: {
        S3_BUCKET: this.bucket.bucketName
      }
    });

    this.bucket.grantReadWrite(this.importLambda)


  }


  constructor(scope, id, props) {
    super(scope, id, props);
    this.addDepLayer();
    this.createBucket();
    this.createLambda();
    this.createWebsite();
    this.createCdn();



    // The code that defines your stack goes here
  }
}

module.exports = { CdkStack }
