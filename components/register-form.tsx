'use client';

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

import { Spinner } from "./ui/spinner";

import { useState } from "react";
import { useRouter } from "next/navigation";



export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const router = useRouter();
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()


    setIsLoading(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        email: regEmail,
        password: regPassword,
        name: regName,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (res.ok) {
      router.push("/signin");
      setIsLoading(false);
    } else {
      alert("Register failed");
      setIsLoading(false)
    }


  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Register your accout</CardTitle>
          <CardDescription>
            Enter your data below to register your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => handleRegister(e)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="ex: Jaka"
                  value={regName}
                  onChange={(e) => { setRegName(e.target.value) }}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={regEmail}
                  onChange={(e) => { setRegEmail(e.target.value) }}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>

                <Input
                  id="password"
                  type="password"
                  placeholder="***********"
                  value={regPassword}
                  onChange={(e) => { setRegPassword(e.target.value) }}
                  required />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  {isLoading && <Spinner className="text-white" size="small" />}
                  {isLoading ? "Loading" : "Register"}
                </Button>

              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have the account{" "}
              <Link href="/signin" className="underline underline-offset-4">
                Sign in
              </Link>

            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
