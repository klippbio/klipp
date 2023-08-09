import React, { use } from 'react'
import Nav from './Nav';
import { UserButton } from "@clerk/nextjs";

function page() {

  return (  
    <div>
        <Nav />
        <UserButton afterSignOutUrl="/"/>
    </div>
  )
}

export default page
