"use client";

import React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminHome() {
  const router = useRouter();

  useEffect(() => {
    router.push("/admin/signals");
  }, [router]);

  return null;
}
