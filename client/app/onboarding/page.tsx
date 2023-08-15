"use client"
import React, { useState } from "react";
import axios from "axios"
import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function Page() {

  //clerk userid
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const { user } = useUser();

  const [name, setName] = useState('');
  const [userName, setUserName] = useState('Growthdeck.me/');

  function submitDetails(e: React.FormEvent) {
    e.preventDefault()
    const data = {name, userName, userId, getToken}
    axios.post("/api/onboarding", {data}),
    {
      onError: (error) => {
        console.log("error", Error)
      },
      onSuccess: (data) => {
        console.log("success", data)
      }
    }
  }

  function HandleInputChange(e: React.ChangeEvent<HTMLInputElement>) { 
    const inputValue = e.target.value;
    
    if (inputValue.startsWith('Growthdeck.me/')) {
      setUserName(inputValue);
    }
  }
  
  return (

    <div className="flex h-screen">

      
      {/* Left Section */}




      <div className="flex-1 bg-white p-10 flex flex-col justify-center items-center rounded-l-lg">
        
        <h1 className="text-3xl font-bold mb-6">GrowthDeck</h1>
        <h1 className="text-2xl font-semibold mb-6">Select A User Name</h1>
        {/* <form className="space-y-4 w-64" onSubmit={submitDetails}>
          <div className="relative">
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              id="name"
              name="name"
              className="w-full outline-none border rounded-full px-3 py-4 focus:ring-0 focus:border-pink-300"
              placeholder="John Doe"
            />
            <label
              htmlFor="name"
              className="absolute top-0 rounded-full left-3 -mt-2 bg-white px-1 text-gray-600"
            >
              Name
            </label>
          </div>

          <div className="relative">
            <input
              onChange={(e) => setUserName(e.target.value)}
              value={userName}
              type="text"
              id="userName"
              name="userName"
              className="w-full outline-none border rounded-full px-3 py-4 focus:ring-0 focus:border-pink-300"
              placeholder="John12"
            />
            <label
              htmlFor="userName"
              className="absolute top-0 rounded-full left-3 -mt-2 bg-white px-1 text-gray-600"
            >
              User Name
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-2 px-4 rounded-full hover:bg-pink-700"
          >
            Next
          </button>
        </form> */}
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input 
          name="userName"
          onChange={HandleInputChange}
          value={userName}
          type="text" 
          placeholder="Growth.me/" />
          <Button type="submit">Next</Button>
        </div>
      </div>


      {/* Right Section */}
      <div className="flex w-1/3 bg-black">
        {/* <img
          src="" // Replace with your image URL
          alt="Sample Image"
          className="h-full object-cover"
        /> */}
      </div>
    </div>
  );
}

export default Page;
