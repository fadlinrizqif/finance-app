import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@/lib/generated/prisma";

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


  const transactions = await prisma.transactions.findMany({
    where: { userId: user.id },
    select: {
      nominal: true,
      updatedAt: true,
    },
  });

  // Group by month and sum
  const monthlyTotals: Record<string, number> = {};

  transactions.forEach((tx) => {
    const date = new Date(tx.updatedAt);
    const month = date.toLocaleString("id-ID", {
      month: "long",
      year: "numeric",
    });

    if (!monthlyTotals[month]) {
      monthlyTotals[month] = 0;
    }

    monthlyTotals[month] += Number(tx.nominal);
  });

  const result = Object.entries(monthlyTotals).map(([month, total]) => ({
    month,
    total,
  }));

  return NextResponse.json(result, {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });

  /*
  
    const montlyData = await prisma.transactions.groupBy({
      by: ["updatedAt"],
      where: { userId: user.id, },
      _sum: { nominal: true },
      orderBy: { updatedAt: "asc" }
    })
  
    const monthlyTotal = montlyData.map((element) => {
      const date = new Date(element.updatedAt);
      const month = date.toLocaleString("id-ID", {
        month: "long",
        year: "numeric",
      })
  
      return {
        month,
        total: element._sum.nominal ?? 0.
      }
    })
  
  
  
  
    return NextResponse.json(monthlyTotal, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  */
}
