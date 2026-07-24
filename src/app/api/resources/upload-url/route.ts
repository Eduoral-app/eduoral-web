import { NextRequest, NextResponse } from "next/server";
import { generateUploadUrl } from "@/lib/aws";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { title, type, extension } = body;

    if (!title || !type || !extension) {
      return NextResponse.json(
        {
          error: "title, type and extension are required",
        },
        {
          status: 400,
        },
      );
    }

    const allowedExtensions = ["pdf", "png", "jpg", "jpeg"];

    if (!allowedExtensions.includes(extension)) {
      return NextResponse.json(
        {
          error: "Invalid file extension",
        },
        {
          status: 400,
        },
      );
    }

    const result = await generateUploadUrl({
      title,
      type,
      extension,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Upload URL error:", error);

    return NextResponse.json(
      {
        error: "Failed to generate upload URL",
      },
      {
        status: 500,
      },
    );
  }
}
