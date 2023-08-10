import React from "react";
import Link from "next/link";

export default function Nav() {
    return (
        <div>
            <nav className="flex justify-between items-center py-8 px-8">
                <h1 className="text-2xl font-bold">Name</h1>
                <div className="space-x-4">
                    <Link legacyBehavior href="/sign-in">
                        <a className="px-4 py-2 rounded bg-white text-blue-500 hover:bg-blue-100 hover:text-blue-600 transition duration-300">Sign In</a>
                    </Link>
                    <Link legacyBehavior href="/sign-up">
                        <a className="px-4 py-2 rounded bg-blue-700 text-white hover:bg-blue-800 transition duration-300">Sign Up</a>
                    </Link>
                </div>
            </nav>
            <h1 className="text-center text-6xl mt-28">Home Page</h1>
        </div>
    );
}

