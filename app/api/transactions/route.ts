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

  const categories = await prisma.category.findMany({
    where: {
      userId: user?.id
    }
  })

  if (!user && !categories) {
    return NextResponse.json(
      { error: "Data not found." },
      { status: 404 }
    );
  }

  const data = await prisma.transactions.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      category: true
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

  const categories = await prisma.category.findMany({
    where: {
      userId: user?.id
    }
  })

  if (!user) {
    return NextResponse.json(
      { error: "User not found." },
      { status: 404 }
    );
  }


  const body = await request.json();
  const { name, nominal, categoryId } = body;

  if (!name || !nominal || !categoryId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const parsedNominal: number = parseInt(nominal);
  if (isNaN(parsedNominal)) {
    return NextResponse.json({ error: "Nominal must be a number" }, { status: 400 });
  }


  const newTransaction = await prisma.transactions.create({
    data: {
      name,
      nominal: parsedNominal,
      userId: user!.id,
      categoryId: categoryId,
    },
  });

  return NextResponse.json(newTransaction, {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}




export async function PATCH(request: NextRequest) {

  const body = await request.json();
  const { name, nominal, id } = body;

  const pathTransaction = await prisma.transactions.update({
    where: {
      id
    },
    data: {
      name,
      nominal
    }
  })

  return NextResponse.json(pathTransaction, {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();
  const { id } = body;

  const deletedTransaction = await prisma.transactions.delete({
    where: { id }
  })

  return NextResponse.json(deletedTransaction, {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
