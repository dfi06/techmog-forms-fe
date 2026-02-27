
"use client"

import React, { use, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const Page = ({ params }) => {
  const router = useRouter()
  const { form_id } = use(params)

  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  

  useEffect(() => {
    const token = localStorage.getItem('token');
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
          if (!res.ok){
              return null
          }
          return res.json()
      }).then(data => {
          if(data) setUser(data.user);
      })

    const fetchForm = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/form/by/${form_id}`)
        const data = await res.json()
        setForm(data?.form)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchForm()
  }, [form_id])

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/form/delete/${form_id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if(!res.ok) {
        toast(data.message)
        return null
      };
      if (data) router.push('/');
    } catch (err) {
      console.error('Delete failed', err)
    }
  }

  if (loading) return <div>Loading…</div>
  if (!form) return (
    <div>
      <div>Failed to load</div>
      <Link href="/"><Button>Back</Button></Link>
    </div>
  )

  return (
    <div>
      <Link href="/"><Button>Back</Button></Link>
      {user?._id === form?.owner_id ? (
        <>
          <Link href={`/form/${form_id}/edit`}><Button>Edit</Button></Link>
          <Button onClick={handleDelete}>Delete</Button>
        </>
      ): ""}
      
      <div>{form.title}</div>
      <div>information about forms here</div>
      <div>form itself but disabled</div>
      <Button>View responses</Button>
    </div>
  )
}

export default Page