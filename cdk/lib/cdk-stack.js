const cdk = require('@aws-cdk/core');
const s3  = require('@aws-cdk/aws-s3');
const lambda = require("@aws-cdk/aws-lambda");

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
  createBucket() {
    this.bucket = new s3.Bucket(this, 'cacheBucket', {
      versioned: false,
      removalPolicy: cdk.RemovalPolicy.RETAIN
    });
  }

  createLambda() {
    this.importLambda = new lambda.Function(this, 'importLambda', {
      runtime: lambda.Runtime.PYTHON_3_6,
      code: lambda.Code.asset('lambda/importLambda'),
      handler: 'importLambda.importLambda',
      timeout: cdk.Duration.seconds(900),
      //layers: [ this.depLayer],
    });

    this.bucket.grantReadWrite(this.importLambda)


  }


  constructor(scope, id, props) {
    super(scope, id, props);
    this.createBucket();
    this.createLambda();
    this.addDepLayer();



    // The code that defines your stack goes here
  }
}

module.exports = { CdkStack }
