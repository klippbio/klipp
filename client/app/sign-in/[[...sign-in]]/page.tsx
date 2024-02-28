"use client";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex justify-center h-screen items-center">
      <SignIn
        redirectUrl="http://localhost:4000/user/check"
        appearance={{
          elements: {
            formButtonPrimary: "bg-black hover:bg-gray-800 text-sm normal-case",
          },
        }}
      />
    </div>
  );
}
