"use client"
import { useMutation } from "react-query";
import { useState } from "react";
import axios from "axios"

function Page() {
  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  //const queryClient = useQueryClient();


  // const { mutate } = useMutation(
  //   async ({ name, userName }) => // Include city, country, and phone in the mutation
  //     await axios.post("/api/posts/addData", {
  //       name,
  //       userName,
  //     }),
  //   {
  //     onError: (error) => {
  //       console.log("error")
  //     },
  //     onSuccess: (data) => {
  //       console.log("success")
  //     },
  //   }
  // );

  const submitDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(name, userName)
    //mutate({ name, userName }); 
  };


  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="flex-1 bg-gray-100 p-10 flex flex-col justify-center items-center rounded-l-lg">
        <h1 className="text-2xl font-semibold mb-6">Let's Get You Started</h1>
        <form className="space-y-4 w-64" onSubmit={submitDetails}>
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
            Create post
          </button>
        </form>
      </div>

      {/* Right Section */}
      <div className="flex bg-red-600">
        <img
          src="/onboarding.jpg" // Replace with your image URL
          alt="Sample Image"
          className="h-full object-cover"
        />
      </div>
    </div>
  );
}

export default Page;
