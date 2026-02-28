'use client'
import React, { use, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const Page = ({params}) => {
  const router = useRouter()
  const { form_id } = use(params)
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token")

      const userRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const userData = await userRes.json()
      setUser(userData.user)

      const formRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/form/by/${form_id}`)
      const formData = await formRes.json()
      setForm(normalizeSavedForm(formData.form))

      setLoading(false)
    }

    fetchData()
  }, [form_id])

  const handleSubmit = async () => {
    
    const payload = {
      form_id
    }
    if (user) payload.attempted_by_id = user.id;
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/attempt/create`, {
      body: JSON.stringify(payload),
      method: "POST",
      headers: {"Content-Type":"application/json"}
    })
    if(!res.ok) return null;
    router.back()
  }


  const updateCorrectAnswer = (question_id, index_to_update) => {
  setForm(prev => ({ ...prev, questions: (prev.questions || []).map(q => q.question_id === question_id ? { ...q, correctAnswerIndex: index_to_update } : q) }))
};

  const toggleCheckboxAnswer = (question_id, index) => {
    setForm(prev => ({
      ...prev,
      questions: (prev.questions || []).map(q => {
        if (q.question_id !== question_id) return q
        const prevArr = q.correctAnswerIndices || (q.correctAnswerIndex !== undefined ? [q.correctAnswerIndex] : [])
        const exists = prevArr.includes(index)
        const next = exists ? prevArr.filter(i => i !== index) : [...prevArr, index]
        return { ...q, correctAnswerIndices: next }
      })
    }))
  }


  if(loading) return (<div>Loading... please wait</div>)
  
  return (
    <div>
        <Button onClick={() => router.back()}>← Back</Button>
        {form.title}

        {/* <RadioGroup value={String(q.correctAnswerIndex)} onValueChange={(val) => updateCorrectAnswer(q.question_id, Number(val))}>
          {q.options.map((o,i)=>(
            <div key={`${q.question_id}-${i}`} className="flex items-center gap-3">
              <RadioGroupItem value={`${i}`} id={`${q.question_id}-${i}`} />
              <Label htmlFor={`${q.question_id}-${i}`}>
                {`Option ${i + 1}`}
              </Label>
              <Input value={o} required onChange={(e) => updateOption(q.question_id, i, e.target.value)} placeholder="Enter your option"></Input>
              <Button onClick={() => deleteOption(q.question_id, i)}>X</Button>
            </div>
          ))}
          
        </RadioGroup> */}

        {/* <Checkbox id={`${q.question_id}-${i}`} checked={(q.correctAnswerIndices||[]).includes(i)} onCheckedChange={() => toggleCheckboxAnswer(q.question_id, i)} /> */}
        <Button>Submit</Button>
    </div>
  )
}

export default Page