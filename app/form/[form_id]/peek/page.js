'use client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React, { useEffect } from 'react'

const Page = () => {

    const fetchFormData = () => {

    }

    useEffect(()=>{
        fetchFormData()
    },[])
  return (
    <div>
        <Link href="/"><Button>Back</Button></Link>
        <div>information about forms here</div>
        <div>form itself but disabled</div>
        <Button>View responses</Button>
    </div>
  )
}

export default Page