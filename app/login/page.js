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
    <div>
        <Link href="/"><Button>Back</Button></Link>
        <form onSubmit={handleLogin}>
            <Label>Enter username</Label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Type your username here!" required></Input>
            <Label>Enter password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Type your password here!" required></Input>
            <Button>Login</Button>
        </form>
    </div>
  )
}

export default Page