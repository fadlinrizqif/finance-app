import SignOut from "@/components/signout";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row h-screen">
      <div className="w-[25%] flex flex-col p-2">
        <div className="h-full flex flex-col justify-between border border-black rounded">
          <div className="flex flex-col gap-2">
            <Link
              href={'/dashboard'}
              className="h-[48px] w-full bg-gray-50"
            >
              Home
            </Link>
            <Link
              href={'/dashboard/category'}
              className="h-[48px] w-full bg-gray-50"
            >
              Category
            </Link>
            <Link
              href={'/dashboard/transactions'}
              className="h-[48px] w-full bg-gray-50"
            >
              Transactions
            </Link>
          </div>
          <SignOut />
        </div>
      </div>
      <div className="py-2 pr-2 w-full">{children}</div>
    </div>
  );
}
