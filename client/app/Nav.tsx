"use-client"
import React from "react"
import Link from "next/link"

export default async function Nav() {
  
  return (
<nav className="flex justify-between items-center py-8 bg-blue-500 text-white">
    <h1 className="text-2xl font-semibold">Name</h1>
    <div className="space-x-4">
        <button className="px-4 py-2 rounded bg-white text-blue-500 hover:bg-blue-100 hover:text-blue-600 transition duration-300">Sign In</button>
        <button className="px-4 py-2 rounded bg-blue-700 text-white hover:bg-blue-800 transition duration-300">Sign Up</button>
    </div>
</nav>

  )
}
