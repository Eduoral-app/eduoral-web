import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    await prisma.user.create({
      data: {
        id: data.id,
        email: data.email,
        emailVerified: data.emailVerified,
        displayName: data.displayName,
        institution: data.institution,
        department: data.department,
        country: data.country,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 },
    );
  }
}
