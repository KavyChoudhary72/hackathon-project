"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DonationsIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/donor/donations/1025");
  }, [router]);

  return (
    <div className="flex items-center justify-center p-12 text-[#5B6661]">
      <span className="text-sm font-semibold">Redirecting to active donation tracker...</span>
    </div>
  );
}
