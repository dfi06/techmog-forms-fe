'use client'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
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


const Page = () => {
  const [qArr, setQArr] = useState([])
  const [required, setRequired] = useState(false)
  const addNewQ = () => {
    
    setQArr(prev => [...prev, {id: Math.random(), type:"Multiple Choice", options:["Option 1", "Option 2"]}])
  }

  

  const questionTypes = ["Multiple Choice", "Short Answer", "Checkbox", "Dropdown"]

  const updateType = (id, newType) => {
    setQArr(prev =>
      prev.map(q =>
        q.id === id ? { ...q, type: newType } : q
      )
    );
  };
  return (
    <div>
        <div className='inline-flex w-full gap-2'>
          <Label>Is this question required?</Label>  <Checkbox checked={required} onCheckedChange={setRequired} />
        </div>
        
        
        <Button onClick={addNewQ}>+</Button>
        {qArr.map((q, i) => (
          <div key={i} className='h-60 border-5 border-blue-500 text-white'>

            <Combobox items={questionTypes} onValueChange={(val) => updateType(q.id, val)}>
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
            
            {q.type === "Multiple Choice" && (
              <div>
                Hi
                <Button>+</Button>
              </div>
              
            )}
            {q.type === "Short Answer" && (
              <div>
                <Label>Enter text</Label>
                <Input placeholder="Write your question text here"></Input>
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
        
        ?? "No questions yet"}
    </div>
  )
}

export default Page