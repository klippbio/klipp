"use client";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  const redirectUrl = process.env.NEXT_PUBLIC_BACKEND_URL + "/user/check";
  return (
    <div className="flex justify-center h-screen items-center">
      <SignUp
        redirectUrl={redirectUrl}
        appearance={{
          elements: {
            formButtonPrimary: "bg-black hover:bg-gray-800 text-sm normal-case",
          },
        }}
      />
    </div>
  );
}
