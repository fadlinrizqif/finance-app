'use client';

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";


export default function SignOut() {

  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') return <p>Loading...</p>;

  if (!session) {
    router.push('/signin');
    return null;
  }


  return (
    <Button onClick={() => signOut({ callbackUrl: '/signin' })}
    >
      Sign Out
    </ Button>
  );
}
