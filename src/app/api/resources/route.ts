import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { FileType, ResourceType } from "@/generated/prisma/enums";

const resourceTypeMap: Record<string, ResourceType> = {
  "Past Paper": ResourceType.PAST_PAPER,
  PAST_PAPER: ResourceType.PAST_PAPER,

  Notes: ResourceType.NOTES,
  NOTES: ResourceType.NOTES,

  Book: ResourceType.BOOK,
  BOOK: ResourceType.BOOK,

  Assignment: ResourceType.ASSIGNMENT,
  ASSIGNMENT: ResourceType.ASSIGNMENT,

  Slides: ResourceType.SLIDES,
  SLIDES: ResourceType.SLIDES,

  MCQs: ResourceType.MCQS,
  MCQ: ResourceType.MCQS,
  MCQS: ResourceType.MCQS,

  "Guess Paper": ResourceType.GUESS_PAPER,
  GUESS_PAPER: ResourceType.GUESS_PAPER,

  "Lab Manual": ResourceType.LAB_MANUAL,
  LAB_MANUAL: ResourceType.LAB_MANUAL,

  // optional future type
  JOB_TEST: ResourceType.JOB_TEST,
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      title,
      description,
      type,
      institution,
      examType,
      year,
      semester,
      fileKey,
      fileType,
      tags,
      fileSize,
      uploaderId,
      subject,
      board,
    } = body;

    console.log(body);

    if (!title || !fileKey || !type || !uploaderId) {
      return NextResponse.json(
        {
          error: "Missing required fields: title, fileKey, type, uploaderId",
        },
        { status: 400 },
      );
    }

    const resourceType = resourceTypeMap[type];

    if (!resourceType) {
      return NextResponse.json(
        {
          error: `Invalid resource type: ${type}`,
        },
        { status: 400 },
      );
    }

    const resource = await prisma.$transaction(async (tx) => {
      let subject_: { id: string } | null = null;

      if (subject) {
        subject_ = await tx.subject.findFirst({
          where: {
            name: subject,
          },
        });

        if (!subject_) {
          subject_ = await tx.subject.create({
            data: {
              name: subject,
            },
          });
        }
      }

      let board_: { id: string } | null = null;

      if (board) {
        board_ = await tx.board.findFirst({
          where: {
            name: board,
          },
        });

        if (!board_) {
          board_ = await tx.board.create({
            data: {
              name: board,
            },
          });
        }
      }
      const tagNames = tags
        ? tags
            .split(",")
            .map((tag: string) => tag.trim().toLowerCase())
            .filter(Boolean)
        : [];

      return await tx.resource.create({
        data: {
          title,

          subjectId: subject_?.id,
          boardId: board_?.id,

          description: description || null,

          type: resourceType,

          institution: institution || null,

          examType: examType || null,

          year: year ? Number(year) : null,

          semester: semester || null,

          fileType: fileType === "IMAGE" ? FileType.IMAGE : FileType.PDF,

          fileUrl: fileKey,

          fileSize: fileSize ? Number(fileSize) : null,

          uploaderId,

          isApproved: false,
          isFree: true,
          isPublished: true,

          // ADD THIS
          tags: {
            connectOrCreate: tagNames.map((name: string) => ({
              where: {
                name,
              },
              create: {
                name,
              },
            })),
          },
        },

        include: {
          tags: true,
          subject: true,
          board: true,
        },
      });
    });

    return NextResponse.json(resource, {
      status: 201,
    });
  } catch (error) {
    console.error("RESOURCE_CREATE_ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to create resource.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search");
    const type = searchParams.get("type");
    const board = searchParams.get("board");
    const subject = searchParams.get("subject");
    const year = searchParams.get("year");

    const sort = searchParams.get("sort") || "downloads";

    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 12);

    const where: any = {
      // isPublished: true,
      // isApproved: true,
    };

    // Resource Type
    if (type) {
      where.type = type as ResourceType;
    }

    // Board
    if (board) {
      where.board = {
        name: {
          equals: board,
          mode: "insensitive",
        },
      };
    }

    // Subject
    if (subject) {
      where.subject = {
        name: {
          equals: subject,
          mode: "insensitive",
        },
      };
    }

    // Year
    if (year) {
      where.year = Number(year);
    }

    // Search
    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          subject: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          board: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          tags: {
            some: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        },
      ];
    }

    let orderBy: any = {
      downloadCount: "desc",
    };

    if (sort === "views") {
      orderBy = {
        viewCount: "desc",
      };
    }

    if (sort === "latest") {
      orderBy = {
        createdAt: "desc",
      };
    }

    const [resources, total] = await Promise.all([
      prisma.resource.findMany({
        where,

        orderBy,

        skip: (page - 1) * limit,

        take: limit,

        include: {
          board: {
            select: {
              id: true,
              name: true,
            },
          },

          subject: {
            select: {
              id: true,
              name: true,
            },
          },

          tags: {
            select: {
              id: true,
              name: true,
            },
          },

          uploader: {
            select: {
              id: true,
              displayName: true,
              photoURL: true,
            },
          },
        },
      }),

      prisma.resource.count({
        where,
      }),
    ]);

    return NextResponse.json({
      resources,

      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET RESOURCES ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch resources",
      },
      {
        status: 500,
      },
    );
  }
}
