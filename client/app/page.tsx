"use client"

import axios from 'axios'
import React, { use } from 'react'
import { useEffect, useState } from 'react'
import { UserButton } from "@clerk/nextjs";
import { useMutation } from "react-query"
import { useAuth } from "@clerk/clerk-react";
import Nav from './Nav';



function page() {

  // const { getToken } = useAuth();


  // const [state, setState] = React.useState()

  // useEffect(() => {
  //   fetchData();
  // })

  // const fetchData = async () => {
  //   try {
  //     const response = await axios.get('/api');
  //     setState(response.data);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };

  // const mutate = async () => {
  //   try {

  //     const token = await getToken(); 
  //     const url = "http://localhost:4000/api/validate";
  //     const headers = {
  //       "Content-Type": "application/json",
  //       "Authorization": `Bearer ${token}`,
  //     };
  //     const response = await axios.post(url, { headers });      
  //     console.log(response.data);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };

  // const mutate = async () => {
  //   try {


      
  //     const token = await getToken(); 
  //     console.log("Heloo")
  //     console.log(token)
  //     const headers = {
  //             "Content-Type": "application/json",
  //             "Authorization": `Bearer ${token}`,
  //           };
  //     const response = await axios.post('/api/validate', {headers});
      
  //     console.log(response);

  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };
  




  // const validate = async () => { 
  //   mutate();

  // }


  

  return (  
    <div>
      {/* {state? (
        <p>{state.users}</p>
      ) : (
        <p>loading...</p>
      )}
      <UserButton afterSignOutUrl="/"/> */}

      
        {/* <button onClick={validate}>Is Loggedin?</button> */}
        
        <Nav />
    </div>

    
  )
}

export default page
