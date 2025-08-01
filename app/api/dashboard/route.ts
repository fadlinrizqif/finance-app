import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
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

  const totatNominal = await prisma.transactions.aggregate({
    where: {
      userId: user.id
    },
    _sum: {
      nominal: true
    }
  })

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


  const dashboardData = {
    total: totatNominal._sum.nominal ?? 0,
    monthlyTotal
  }


  return NextResponse.json(dashboardData, {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })

}
