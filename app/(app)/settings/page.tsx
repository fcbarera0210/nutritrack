'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BottomNav } from '@/components/dashboard/BottomNav';
import Link from 'next/link';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <div className="container mx-auto px-4 py-6 max-w-md pb-24">
        <div className="mb-6 flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">Ajustes</h1>
        </div>

        <div className="space-y-4">
          <p className="text-gray-400 text-sm">
            Página de ajustes en construcción. Esta será implementada según el diseño de Figma.
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

