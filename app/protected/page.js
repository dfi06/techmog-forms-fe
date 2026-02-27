'use client'

import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Page = () => {
    const router = useRouter()
    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(true)


    useEffect(()=>{
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/me`, {
            credentials: "include"
        }).then(res => {
            if (!res.ok){
                router.push('/login')
                return null
            }
            return res.json()
        }).then(data => {
            if(data) setUser(data.user)
                
            setLoading(false)
        })
    }, [])

    if (loading) return (
        <div>wait you silly billy</div>
    )
  return (
    <div><h1>Welcome {user.username}</h1></div>
  )
}

export default Page