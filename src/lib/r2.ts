import {PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';
import {appEnv, hasR2Config} from '@/lib/env';

export function createR2Client() {
  if (!hasR2Config()) {
    return null;
  }

  return new S3Client({
    region: 'auto',
    endpoint: `https://${appEnv.r2AccountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: appEnv.r2AccessKeyId!,
      secretAccessKey: appEnv.r2SecretAccessKey!,
    },
  });
}

export async function createListingImageUploadUrl(input: {
  userId: string;
  fileName: string;
  contentType: string;
}) {
  const client = createR2Client();
  if (!client || !appEnv.r2Bucket || !appEnv.r2PublicBaseUrl) {
    return null;
  }

  const extension = input.fileName.split('.').pop()?.toLowerCase() || 'jpg';
  const key = `listings/${input.userId}/${crypto.randomUUID()}.${extension}`;
  const command = new PutObjectCommand({
    Bucket: appEnv.r2Bucket,
    Key: key,
    ContentType: input.contentType,
  });

  return {
    key,
    uploadUrl: await getSignedUrl(client, command, {expiresIn: 60 * 5}),
    publicUrl: `${appEnv.r2PublicBaseUrl.replace(/\/$/, '')}/${key}`,
  };
}
