import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic
const s3 = new XAWS.S3({
       signatureVersion: 'v4'
})
const bucketName = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export const AttachmentUtils = (id:string) => {
    return s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: id,
        Expires: parseInt(urlExpiration)
    })
}
