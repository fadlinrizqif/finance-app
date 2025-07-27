
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button'; // jika pakai shadcn, jika tidak, bisa pakai <button>

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-50 px-6 py-12 text-gray-800">
      <div className="max-w-xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Kelola Keuangan Anda Dengan Lebih Baik</h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          Aplikasi pencatatan dan perencanaan keuangan pribadi untuk membantu Anda mencapai kebebasan finansial.
        </p>

        <Button
          onClick={() => router.push('/signin')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Login Sekarang
        </Button>
      </div>
    </main>
  );
}

