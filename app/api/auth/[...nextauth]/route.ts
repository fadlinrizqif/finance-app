import NextAuth from "next-auth";
import z from "zod";
import bcrypt from "bcryptjs"
import { NextAuthOptions } from "next-auth";
import { PrismaClient } from "@/lib/generated/prisma";
import CredentialsProvider from "next-auth/providers/credentials";


const prisma = new PrismaClient();

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const schema = z.object({
          email: z.string().email(),
          password: z.string().min(6),
        })

        const { email, password } = schema.parse(credentials);

        const user = await prisma.users.findUnique({ where: { email } });

        if (!user) throw new Error("No user found");
        if (!user.password) throw new Error("No password set for user")
        const valid = await bcrypt.compare(password, user.password)
        if (!valid) throw new Error("Invalid password");

        return {
          id: user.id,
          email: user.email,
          name: user.name
        };
      }
    })
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/signIn" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
