import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button"
import { UserButton } from "@clerk/nextjs";
import { auth } from '@clerk/nextjs';

export default function Nav() {
    const { userId } = auth();
    return (
        <div>
            <nav className="flex justify-between items-center py-8 px-8">
                <h1 className="text-2xl font-bold">klipp</h1>
                <div className="space-x-4">
                {userId ? (
                        <>
                            <Button asChild>
                                    <Link href="/dashboard">Dashboard</Link>
                            </Button>
                         </>
                    ) : (
                        // Show "Sign In" when user is not signed in
                        <>
                            <Button variant="outline" asChild>
                                <Link href="/sign-in">Sign In</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/sign-up">Sign Up</Link>
                            </Button>
                        </>
                    )}
                </div>
            </nav>  
        </div>
    );
}

