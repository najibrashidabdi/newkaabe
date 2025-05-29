// app/subscribe/page.tsx (or .js)
import { Suspense } from "react";
import ProUpgradePageClient from "./ProUpgradePageClient";

export default function ProUpgradePageWrapper() {
  return (
    <Suspense fallback={<div>Loading Pro Upgrade Page...</div>}>
      <ProUpgradePageClient />
    </Suspense>
  );
}
