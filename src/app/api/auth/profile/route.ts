import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const uid = req.nextUrl.searchParams.get("uid");

    if (!uid) {
      return NextResponse.json({ message: "Missing uid" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: uid,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
