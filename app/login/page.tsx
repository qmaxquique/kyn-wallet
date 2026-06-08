'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import BrandPanel from '@/components/BrandPanel';
import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');

  return (
    <main className="min-h-screen flex">
      {/* Brand Side (Left on Desktop) */}
      <BrandPanel />

      {/* Form Side (Right on Desktop, Full on Mobile) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-white">
        {registered === 'true' && (
          <div className="mb-4 p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm w-full max-w-md">
            Cuenta creada exitosamente. Ahora puedes iniciar sesión.
          </div>
        )}
        <LoginForm />
      </div>
    </main>
  );
}
