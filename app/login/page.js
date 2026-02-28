'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from "sonner"

const Page = () => {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      )

      const data = await res.json()

      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
      }

      if (!res.ok) {
        toast.error(data.message || "Login failed")
        return
      }

      toast.success("Logged in successfully")
      router.push("/")

    } catch (err) {
      toast.error("Network error")
    }
  }


  useEffect(()=>{
    localStorage.removeItem('token');
  },[])

  return (
    <div className='w-100 mx-auto'>
        <Button onClick={() => router.back()} className='w-24 mb-4 mt-30'>← Back</Button>
        <form onSubmit={handleLogin} className='px-8 py-12 w-80 gap-2 flex flex-col border-primary border-2 shadow-xl rounded-xl '>
          
            <Label>Enter username</Label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required className='mb-4'></Input>
            <Label>Enter password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required></Input>
            <Button className='w-36 mt-8 self-center' type="submit">Login</Button>
        </form>
    </div>
  )
}

export default Page