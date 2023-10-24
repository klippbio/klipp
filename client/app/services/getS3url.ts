//TODO: Set bucket security policy
//TODO: Check CORS once deployed

import dotenv from "dotenv";
import aws from "aws-sdk";
import crypto from "crypto";
import { promisify } from "util";
const randomBytes = promisify(crypto.randomBytes);

dotenv.config();

const region = "ca-central-1";
const bucketName = "klipp";
const accessKeyId = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY;
const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: "v4",
});

export async function generateUploadURL() {
  const rawBytes = await randomBytes(16);
  const imageName = rawBytes.toString("hex");

  const params = {
    Bucket: bucketName,
    Key: imageName,
    Expires: 60, //60 seconds to upload a file to this url
  };

  const uploadURL = await s3.getSignedUrlPromise("putObject", params);
  return uploadURL;
}

export async function uploadFile(uploadUrl: string, file: File) {
  await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "multipart/form-data",
      "Access-Control-Allow-Origin": "*",
    },
    body: file,
  });
  const imageUrl = uploadUrl.split("?")[0];
  return imageUrl;
}

export async function deleteFile(fileName: string) {
  const parsedUrl = new URL(fileName);
  const key = parsedUrl.pathname.substring(1);
  console.log("deleting file", key);

  const params = {
    Bucket: bucketName,
    Key: key,
  };
  try {
    await s3.deleteObject(params).promise();
    return `File ${key} deleted successfully.`;
  } catch (error) {
    console.log("errpr", error);
    throw new Error(`Error deleting file ${fileName}: ${error}`);
  }
}
