"use client";

import { Suspense } from "react";
import AuditContent from "./audit-content";

export default function AuditPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuditContent />
    </Suspense>
  );
}
