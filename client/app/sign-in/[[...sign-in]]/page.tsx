"use client";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  const redirectUrl = process.env.NEXT_PUBLIC_BACKEND_URL + "/user/check";
  return (
    <div className="flex justify-center h-screen items-center">
      <SignIn
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
