import { Injectable } from "@nestjs/common";
import { S3 } from "aws-sdk";
// import { crypto } from 'crypto'
import * as crypto from 'crypto'

@Injectable()
export class UploadImage{

  bucketName : string | undefined = process.env["AWS_BUCKET_NAME"];

  async uploadImage(dataBuffer: Buffer, filename: string) {
    try{
      
      if(!this.bucketName){
        // console.log('No bucket name');
        return {key: 'error', url: ''};
      }

      const s3 = new S3();

      const randomString = crypto.randomBytes(32).toString('hex');

      const uploadResult = await s3
      .upload({
        Bucket: this.bucketName,
        Body: dataBuffer,
        //Key: `${filename}.jpg`,
        Key: randomString
      })
      .promise();

      return {
        key: uploadResult.Key,
        url: uploadResult.Location,
      }
    }

    catch(err){
      console.log(err)
      return {key: 'error', url: ''};
    }
  }
}
