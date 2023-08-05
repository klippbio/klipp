"use client"

import axios from 'axios'
import React, { use } from 'react'
import { useEffect, useState } from 'react'

function page() {

  const [state, setState] = React.useState()

  useEffect(() => {
    fetchData();
  })

  const fetchData = async () => {
    try {
      const response = await axios.get('/api');
      setState(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (  
    <div>
      {state? (
        <p>{state.users}</p>
      ) : (
        <p>loading...</p>
      )}

    </div>
  )
}

export default page