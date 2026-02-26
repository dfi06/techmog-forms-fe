'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import React, { useState } from 'react'

const Page = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e) => {
    e.preventDefault()

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/register`, {
      body: JSON.stringify({username,password}),
      headers: {
        'Content-Type': "application/json" 
      },
      credentials: "include",
      method: "POST"
    })
    
  }

  return (
    <div>
        <Link href="/"><Button>Back</Button></Link>
        <form onSubmit={handleLogin}>
            <Label>Enter username</Label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Type your username here!"></Input>
            <Label>Enter password</Label>
            <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Type your password here!"></Input>
            <Button>Register</Button>
        </form>
    </div>
  )
}

export default Page