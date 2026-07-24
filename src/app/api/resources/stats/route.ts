import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [
      totalResources,
      totalDownloads,
      totalInstitutions,
      totalStudents,
      resourceTypes,
    ] = await Promise.all([
      prisma.resource.count({
        where: {
          isPublished: true,
        },
      }),

      prisma.download.count(),

      prisma.user.findMany({
        where: {
          institution: {
            not: null,
          },
        },
        distinct: ["institution"],
        select: {
          institution: true,
        },
      }),

      prisma.user.count(),

      prisma.resource.groupBy({
        by: ["type"],
        where: {
          isPublished: true,
        },
        _count: {
          id: true,
        },
      }),
    ]);

    const typeCounts = Object.fromEntries(
      resourceTypes.map((item) => [item.type, item._count.id]),
    );

    return NextResponse.json({
      stats: {
        resources: totalResources,
        downloads: totalDownloads,
        institutions: totalInstitutions.length,
        students: totalStudents,
      },

      resourceTypes: [
        {
          type: "PAST_PAPER",
          title: "Past Papers",
          icon: "📄",
          count: typeCounts.PAST_PAPER || 0,
        },
        {
          type: "NOTES",
          title: "Notes",
          icon: "📝",
          count: typeCounts.NOTES || 0,
        },
        {
          type: "BOOK",
          title: "Books",
          icon: "📚",
          count: typeCounts.BOOK || 0,
        },
        {
          type: "MCQS",
          title: "MCQs",
          icon: "✏️",
          count: typeCounts.MCQS || 0,
        },
        {
          type: "SLIDES",
          title: "Slides",
          icon: "🖼️",
          count: typeCounts.SLIDES || 0,
        },
        {
          type: "LAB_MANUAL",
          title: "Lab Manuals",
          icon: "🔬",
          count: typeCounts.LAB_MANUAL || 0,
        },
        {
          type: "GUESS_PAPER",
          title: "Guess Papers",
          icon: "🎯",
          count: typeCounts.GUESS_PAPER || 0,
        },
        {
          type: "JOB_TEST",
          title: "Job Tests",
          icon: "💼",
          count: typeCounts.JOB_TEST || 0,
        },
      ],
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to fetch resource statistics",
      },
      {
        status: 500,
      },
    );
  }
}
