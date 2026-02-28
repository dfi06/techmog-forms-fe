'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const page = () => {
  const router = useRouter()
  return (
    <div>
        <Button onClick={() => router.back()}>← Back</Button>

        <Button>Submit</Button>
    </div>
  )
}

export default page