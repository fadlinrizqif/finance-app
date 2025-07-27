import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import z from "zod";
import { PrismaClient } from "@/lib/generated/prisma";


const prisma = new PrismaClient();

export async function POST(req: Request) {
  const data = await req.json();
  const schema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, name, password } = schema.parse(data);
  const exist = await prisma.users.findUnique({ where: { email } });

  if (exist) {
    return NextResponse.json({ error: "User already exist" }, { status: 400 })
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.users.create({
    data: {
      name,
      email,
      password: hashedPassword,
    }
  })

  return NextResponse.json({ user })
}
