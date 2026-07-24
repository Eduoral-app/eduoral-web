import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;
    const userId = id;

    const body = await req.json();

    if (!body.email) {
      return NextResponse.json(
        {
          message: "Email is required",
        },
        {
          status: 400,
        },
      );
    }

    const updatedUser = await prisma.user.upsert({
      where: {
        id: userId,
      },

      create: {
        id: userId,
        email: body.email,

        displayName: body.displayName ?? null,
        photoURL: body.photoURL ?? null,
        phoneNumber: body.phoneNumber ?? null,

        institution: body.institution ?? null,
        country: body.country ?? null,
        department: body.department ?? null,
        bio: body.bio ?? null,
      },

      update: {
        email: body.email,

        ...(body.displayName !== undefined && {
          displayName: body.displayName,
        }),

        ...(body.photoURL !== undefined && {
          photoURL: body.photoURL,
        }),

        ...(body.phoneNumber !== undefined && {
          phoneNumber: body.phoneNumber,
        }),

        ...(body.institution !== undefined && {
          institution: body.institution,
        }),

        ...(body.country !== undefined && {
          country: body.country,
        }),

        ...(body.department !== undefined && {
          department: body.department,
        }),

        ...(body.bio !== undefined && {
          bio: body.bio,
        }),
      },

      select: {
        id: true,
        email: true,
        displayName: true,
        photoURL: true,
        phoneNumber: true,
        institution: true,
        country: true,
        department: true,
        bio: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update profile",
      },
      {
        status: 500,
      },
    );
  }
}
