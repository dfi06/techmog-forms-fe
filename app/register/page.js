'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from "sonner"

const Page = () => {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleRegister = async (e) => {
    e.preventDefault()

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ username, password }),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message || "Registration failed")
        return
      }

      toast.success("Registered successfully")
      router.push("/login")

    } catch (err) {
      toast.error("Network error")
    }
    
  }

  return (
    <div>
        <Link href="/"><Button>Back</Button></Link>
        <form onSubmit={handleRegister}>
            <Label>Enter username</Label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Type your username here!" required></Input>
            <Label>Enter password</Label>
            <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Type your password here!" required></Input>
            <Button>Register</Button>
        </form>
    </div>
  )
}

export default Page