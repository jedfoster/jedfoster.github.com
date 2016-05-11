var gulp = require('gulp'),
    awspublish = require('gulp-awspublish'),
    config = require('../config').production,
    cloudfront = require('gulp-cloudfront-invalidate-aws-publish'),
    gzip = require('gulp-gzip'),
    awspublishRouter = require("gulp-awspublish-router");

gulp.task('deploy', function(callback) {
  var aws, cloudFrontOpts, publisher;

  if(! (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.AWS_S3_BUCKET && process.env.AWS_CLOUDFRONT_DISTRIBUTION_ID) ) {
    console.log('Missing AWS configs');
    return callback();
  }

  aws = {
    region: 'us-west-2',
    key: process.env.AWS_ACCESS_KEY_ID,
    secret: process.env.AWS_SECRET_ACCESS_KEY,
    bucket: process.env.AWS_S3_BUCKET,
    distribution: process.env.AWS_CLOUDFRONT_DISTRIBUTION_ID
  };

  publisher = awspublish.create({
    region: aws.region,
    accessKeyId: aws.key,
    secretAccessKey: aws.secret,
    params: {
      Bucket: aws.bucket
    }
  });

  cloudFrontOpts = {
    distribution: aws.distribution,
    accessKeyId: aws.key,
    secretAccessKey: aws.secret
  };
  console.log(config.dest + '/**');

  return gulp.src(config.dest + '/**')
    .pipe(awspublish.gzip())

    .pipe(awspublishRouter(config.cdn.router))

    // publisher will add Content-Length, Content-Type and headers specified above
    // If not specified it will set x-amz-acl to public-read by default
    .pipe(publisher.publish(config.cdn.headers))

    // print upload updates to console
    .pipe(awspublish.reporter({
      states: ['create', 'update']
    }))

    .pipe(cloudfront(cloudFrontOpts));
});

