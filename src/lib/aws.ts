import { nanoid } from "nanoid";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ResourceType } from "@/generated/prisma/enums";

export const s3 = new S3Client({
  region: process.env?.AWS_REGION!,
  credentials: {
    accessKeyId: process.env?.AWS_ACCESSKEYID!,
    secretAccessKey: process.env.AWS_SECRETACCESSKEY!,
  },
});

const mimeTypes = {
  pdf: "application/pdf",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
} as const;

export const generateUploadUrl = async ({
  title,
  type,
  extension,
}: {
  title: string;
  type: ResourceType;
  extension: "pdf" | "png" | "jpg" | "jpeg";
}) => {
  const slug = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");

  const ext = extension.toLowerCase();

  const s3Key = `${type.toLowerCase()}/${slug}-${nanoid()}.${ext}`;

  const mimeTypes: Record<string, string> = {
    pdf: "application/pdf",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
  };

  const contentType = mimeTypes[ext] ?? "application/octet-stream";

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: s3Key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3, command, {
    expiresIn: 60 * 5, // 5 minutes
  });

  return {
    uploadUrl,
    key: s3Key,
  };
};
