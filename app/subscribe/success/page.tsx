"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SubscribeSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to onboarding profile page after successful subscription
    const timer = setTimeout(() => {
      router.push("/onboarding/profile");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-examprep-kaabe-beige">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-green-500 opacity-25 rounded-full animate-ping"></div>
          <div className="w-16 h-16 border-4 border-t-green-500 border-l-green-400 border-r-green-400 border-b-green-400 rounded-full animate-spin"></div>
        </div>
        <p className="text-lg font-semibold text-examprep-kaabe-maroon mb-2">
          Subscription Successful!
        </p>
        <p className="text-sm text-examprep-kaabe-brown">
          Redirecting to complete your profile...
        </p>
      </div>
    </div>
  );
}
