import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "@/lib/aws";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const resource = await prisma.resource.findUnique({
      where: { id },
      select: {
        fileUrl: true,
        fileType: true,
      },
    });

    if (!resource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 },
      );
    }

    const url = resource.fileUrl.startsWith("https:")
      ? resource.fileUrl
      : `https://eduoral.s3.eu-north-1.amazonaws.com/${resource.fileUrl}`;

    // const url = `https://eduoral.s3.eu-north-1.amazonaws.com/past_paper/test-tit-YVyr4dOo-rD6-smcbsV4U.pdf`;

    await prisma.resource.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      url,
      type: resource.fileType,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to generate download url" },
      { status: 500 },
    );
  }
}
