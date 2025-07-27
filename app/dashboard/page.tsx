'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') return <p>Loading...</p>;

  if (!session) {
    router.push('/signin');
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-10">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Selamat Datang, {session.user?.name || 'Pengguna'}!
        </h1>
        <p className="text-gray-600">
          Ini adalah dashboard keuangan pribadi Anda. Di sini nanti akan muncul ringkasan pemasukan, pengeluaran, dan laporan lainnya.
        </p>
        <button
          onClick={() => signOut({ callbackUrl: '/signin' })}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Sign Out
        </button>
      </div>
    </main>
  );
}


