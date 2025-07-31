import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const user = await prisma.users.findUnique({
    where: {
      email: session?.user?.email
    }
  });

  if (!user) {
    return NextResponse.json(
      { error: "User not found." },
      { status: 404 }
    );
  }


  const data = await prisma.category.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  return NextResponse.json(data, {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}


export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const user = await prisma.users.findUnique({
    where: {
      email: session?.user?.email
    }
  });

  if (!user) {
    return NextResponse.json(
      { error: "User not found." },
      { status: 404 }
    );
  }

  const body = await request.json();
  const { category } = body;


  const newCategory = await prisma.category.create({
    data: {
      category,
      userId: user.id,
    },
  });

  return NextResponse.json(newCategory, {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}




export async function PATCH(request: NextRequest) {

  const body = await request.json();
  const { category, id } = body;

  const pathCategory = await prisma.category.update({
    where: {
      id
    },
    data: { category }
  })

  return NextResponse.json(pathCategory, {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();
  const { id } = body;

  const deletedCategory = await prisma.category.delete({
    where: { id }
  })

  return NextResponse.json(deletedCategory, {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
