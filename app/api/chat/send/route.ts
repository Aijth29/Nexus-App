import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import Pusher from "pusher";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content, roomId } = await req.json();

    if (!content?.trim() || !roomId) {
      return NextResponse.json({ error: "Missing content or roomId" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        roomId,
        userId: user.id,
      },
      include: { user: { select: { id: true, name: true, image: true } } },
    });

    await pusher.trigger(`chat-${roomId}`, "new-message", {
      id: message.id,
      content: message.content,
      createdAt: message.createdAt,
      user: message.user,
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error("Chat send error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get("roomId") || "general";

    const messages = await prisma.message.findMany({
      where: { roomId },
      orderBy: { createdAt: "asc" },
      take: 50,
      include: { user: { select: { id: true, name: true, image: true } } },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Chat fetch error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
