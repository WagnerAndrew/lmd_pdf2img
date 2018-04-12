# Lambda Function to create thumbnail from PDF

## Preconditions

* Node.js 8.10
* handler: `index.handler`
* Need S3FullAccess
* Don't need to be placed in VPC
* Don't need any environment variables

## Specification

* Trigger: Uploading PDF on S3 bucket
* Result:  create thumbnail of PDF and upload on same bucket

## Development

* clone this repository

* install dependencies by following command

```
$ npm install gm aws-sdk util
```

Now, please write and commit your code.

## Deployment

* create zip file by following command

```
$ zip -r function.zip *
```

* Upload zip file from AWS Lambda console.

## Others

* Highly recommended to set Lambda function timeout (can be configured at Lambda console) over 30 sec.

## TODO

* Write tests
* Introduce package manager, static type checker, lint
* Introduce any deployment flamework
