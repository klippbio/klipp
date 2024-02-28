"use client";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex justify-center h-screen items-center">
      <SignUp
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
