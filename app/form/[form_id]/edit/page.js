'use client'
import { Button } from '@/components/ui/button'
import { toast } from "sonner"
import React, { use, useEffect, useState } from 'react'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import Link from 'next/link'
import { useRouter } from 'next/navigation'


const Page = ({params}) => {
  const router = useRouter()
  const { form_id } = use(params)
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  const addNewQ = () => {
    
    const newQ = {question_id: crypto.randomUUID(), type:"Multiple Choice", options:["Option 1", "Option 2"], required: true, question_text: "What is the question?"}
    setForm(prev => ({ ...prev, questions: [...(prev.questions || []), newQ] }))
  }

  // normalize form: map question._id (be & db) -> question.question_id (fe)
  const normalizeSavedForm = (saved) => ({
    ...saved,
    questions: (saved?.questions || []).map(q => ({ ...q, question_id: q._id || q.question_id }))
  })

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

  const questionTypes = ["Multiple Choice", "Short Answer", "Checkbox", "Dropdown"]

  const updateType = (question_id, newType) => {
    setForm(prev => ({ ...prev, questions: (prev.questions || []).map(q => q.question_id === question_id ? { ...q, type: newType } : q) }))
  };

  const updateRequired = (question_id, bool_checked) => {
    setForm(prev => ({ ...prev, questions: (prev.questions || []).map(q => q.question_id === question_id ? { ...q, required: bool_checked } : q) }))
  };

  const addOption = (question_id) => {
    setForm(prev => ({ ...prev, questions: (prev.questions || []).map(q => q.question_id === question_id ? { ...q, options: [...(q.options||[]), `Option ${ (q.options||[]).length + 1}`] } : q) }))
  }
  const updateOption = (question_id, index_to_update, new_value) => {
    setForm(prev => ({ ...prev, questions: (prev.questions || []).map(q => q.question_id === question_id ? {...q, options: (q.options||[]).map((o,i) => i === index_to_update ? new_value : o)} : q) }))
  } 
  const deleteOption = (question_id, index_to_remove) => {
    setForm(prev => ({ ...prev, questions: (prev.questions || []).map(q => q.question_id === question_id ? {...q, options: (q.options||[]).filter((_,i) => i !== index_to_remove)} : q) }))
    
  }
  
  const updateQuestionText = (question_id, new_value) => {
    setForm(prev => ({ ...prev, questions: (prev.questions || []).map(q => q.question_id === question_id ? {...q, question_text: new_value} : q) }))
  }

  const updateCorrectAnswer = (question_id, index_to_update) => {
  setForm(prev => ({ ...prev, questions: (prev.questions || []).map(q => q.question_id === question_id ? { ...q, correctAnswerIndex: index_to_update } : q) }))
};

  const updateFormTitle = (e) => {
    const newTitle = e.target.value
    setForm(prev => ({ ...prev, title: newTitle }))
  }

const saveForm = async (e) => {
  e.preventDefault()
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/form/save/${form_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ form })
    })
    const data = await res.json()
    if (!res.ok) {
      toast(data.message || "Save failed")
      return null
    }
    // normalize returned form so UI uses question_id keys
    setForm(normalizeSavedForm(data.form))
    toast.success('Saved')
  } catch (err) {
    toast.error(err.message || 'Save error')
  }
}

  if (loading) return <div>Loading...</div>
  
  if  (user?._id !== form?.owner_id) {
    router.push('/login')
    return null;
  }

  if (!form) {
    router.push('/')
    return null;
  }

  return (
    <div >
        <Button onClick={() => router.back()}>← Back</Button>
        <form onSubmit={saveForm}>
          <div className='text-xl font-semibold'>
            {`Don't forget to save changes!`}
            <Button type="submit">Save changes</Button>
          </div>
          
          <Input value={form.title} onChange={updateFormTitle} required></Input>
          {form.questions.length !== 0 ? form.questions.map((q, i) => (
            <div key={q.question_id} className='min-h-60 border-5 border-primary'>
              <div className='inline-flex w-full gap-2'>
                <Label htmlFor={`${q.question_id}`}>Is this question required?</Label>  <Checkbox id={`${q.question_id}`} checked={q.required} onCheckedChange={(checked)=>updateRequired(q.question_id, checked)} />
              </div>
              <Label>Write your question here</Label>
              <Input placeholder="Write your question text here" required value={q.question_text} onChange={(e) => updateQuestionText(q.question_id, e.target.value)}></Input>
              <Label>Select an answer type</Label>
              <Combobox items={questionTypes} onValueChange={(val) => updateType(q.question_id, val)} value={q.type}>  
                <ComboboxInput placeholder="Select an answer type" />
                <ComboboxContent>
                  <ComboboxEmpty>Question</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
              
              {q.type === "Multiple Choice" && (
                <div>
                  <RadioGroup value={String(q.correctAnswerIndex)} onValueChange={(val) => updateCorrectAnswer(q.question_id, Number(val))}>
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
                    
                  </RadioGroup>
                  <Button onClick={() => addOption(q.question_id)}>+</Button>
                </div>
                
              )}
              {q.type === "Short Answer" && (
                <div>
                  <Label>Write your answer</Label>
                  <Input placeholder="This is where users will write" readOnly></Input>
                </div>
              )}
              {q.type === "Checkbox" && (
                <div>
                  u selected checkbox
                  <Button>+</Button>
                </div>
              )}
              {q.type === "Dropdown" && (
                <div>
                </div>
                
              )}
            </div>
          ))
          
          : "No questions yet"}
          <Button onClick={addNewQ}>+</Button>
        </form>
        
    </div>
  )
}

export default Page