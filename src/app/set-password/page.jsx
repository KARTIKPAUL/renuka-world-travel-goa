// src/app/set-password/page.jsx

import { Suspense } from "react";
import SetPasswordForm from "@/component/auth/SetPasswordForm";



// A simple loading component to show while the form is loading
function Loading() {
  return <div>Loading form...</div>;
}

export default function SetPasswordPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SetPasswordForm />
    </Suspense>
  );
}