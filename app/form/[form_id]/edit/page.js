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
  const [questionsArr, setQuestionsArr] = useState(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  const addNewQ = () => {
    
    setQuestionsArr(prev => [...prev, {question_id: crypto.randomUUID(), type:"Multiple Choice", options:["Option 1", "Option 2"], required: true, answer: null, question_text: "Hi, answer pls:", correctAnswerIndex: 0}])
  }

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
      setForm(formData.form)

      setLoading(false)
    }

    fetchData()
  }, [])

  const questionTypes = ["Multiple Choice", "Short Answer", "Checkbox", "Dropdown"]

  const updateType = (question_id, newType) => {
    setQuestionsArr(prev =>
      prev.map(q =>
        q.question_id === question_id ? { ...q, type: newType } : q
      )
    );
  };

  const updateRequired = (question_id, bool_checked) => {
    setQuestionsArr((prev) =>
      prev.map((q) =>
        q.question_id === question_id
          ? { ...q, required: bool_checked }
          : q
      )
    );
  };

  const addOption = (question_id) => {
    setQuestionsArr(prev =>
      prev.map(q =>
        q.question_id === question_id
          ? { ...q, options: [...q.options, `Option ${q.options.length + 1}`] }
          : q
      )
    );
  }
  const updateOption = (question_id, index_to_update, new_value) => {
    setQuestionsArr(prev => 
      prev.map(q =>
        q.question_id === question_id ? {...q, options: q.options.map((o,i) => i === index_to_update ? new_value : o)}
        : q
      )
    )
  } 
  const deleteOption = (question_id, index_to_remove) => {
    setQuestionsArr(prev => 
      prev.map(q => 
      q.question_id === question_id ?  
      {...q, options: q.options.filter((_,i) => i !== index_to_remove)}
      : q
    )
    )
    
  }
  
  const updateQuestionText = (question_id, new_value) => {
    setQuestionsArr(prev => 
      prev.map(q =>
        q.question_id === question_id ?
          {...q, question_text: new_value} 
          : q
      )
    )
  }

  const updateCorrectAnswer = (question_id, index_to_update) => {
  setQuestionsArr(prev =>
    prev.map(q =>
      q.question_id === question_id
        ? { ...q, correctAnswerIndex: index_to_update }
        : q
    )
  );
};

  const updateFormTitle = () => {
    
  }

  if (loading) return <div>Loading...</div>
  
  if  (user?._id !== form?.owner_id) {
    router.push('/login')
    return null;
  }
  return (
    <div>
        <Link href={`/form/${form_id}/peek`}><Button>Back</Button></Link>
        <Input onChange={updateFormTitle}></Input>
        {}
        {questionsArr.length !== 0 ? questionsArr.map((q, i) => (
          <div key={q.question_id} className='min-h-60 border-5 border-blue-500 text-white'>
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
                <Combobox items={questionTypes}>
                  <ComboboxInput placeholder="Select a question type" />
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
              </div>
              
            )}
          </div>
        ))
        
        : "No questions yet"}
        <Button onClick={addNewQ}>+</Button>
    </div>
  )
}

export default Page