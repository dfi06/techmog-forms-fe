'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react"

export default function Home() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)


  useEffect(()=>{
      const token = localStorage.getItem('token');
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
          if (!res.ok){
              return null
          }
          return res.json()
      }).then(data => {
          if(data) setUser(data.user)
              
          setLoading(false)
      })
  }, [])

  const [formsArr, setFormsArr] = useState([])
  const [newFormTitle, setNewFormTitle] = useState("")

  const makeNewForm = () => {
    setFormsArr(prev => [...prev, {form_id: crypto.randomUUID(), title: newFormTitle}])
  }

  const deleteForm = (form_id) => {
    setFormsArr(prev => prev.filter(f => f.form_id != form_id))
  }

  const handleLogout = async () => {
    localStorage.removeItem('token');
    setUser(null)
  }
  return (
    <div>
      <div className=" h-[65vh] flex flex-col py-20 border-y-2 border-gray-500 bg-blue-400 text-white w-full gap-16 justify-center">
        <div className="flex gap-32 justify-center">
          <div className=" space-y-4">
            <h1 className="font-bold text-4xl ">Welcome, {user?.username}</h1>
            <p className="w-[40ch] ">Make and submit forms. Techmog™ other chudmaxxing arch-cels. We provide the best in-house tools for creating forms. Usage of site may attract attention from foids, Techmog Forms is not liable for any unwanted conduct or damages. Site performance may vary due to 3rd party service limits</p>
          </div>
          <motion.div 
            animate={{
                x: ["0%", "3%", "0%"],
              }}
              transition={{
                duration: 1.5, 
                ease: "easeInOut",
                repeat: Infinity, 
                repeatType: "loop", 
              }}
            className="my-auto flex items-center gap-4" 
          >
            <motion.div 
              animate={{
                y: ["5%", "-20%", "5%"],
              }}
              transition={{
                duration: 1.5, 
                ease: "easeInOut",
                repeat: Infinity, 
                repeatType: "loop", 
              }}
              className="text-7xl transform -scale-x-100"
            >
              🫴
            </motion.div>
            <div>
              <h1 className="-tracking-[0.085em] font-bold text-6xl">Techmog </h1>
              <h1 className="-tracking-[0.085em] font-bold text-6xl">Forms.</h1>
            </div>
            <motion.div 
              animate={{
                y: ["-20%", "5%", "-20%"],
              }}
              transition={{
                duration: 1.5, 
                ease: "easeInOut",
                repeat: Infinity, 
                repeatType: "loop", 
              }}
              className="text-7xl transform "
            >
              🫴
            </motion.div>
          </motion.div>
          
        </div>
        <div className="space-x-8 self-center mx-auto">
          {!user ? (
            <>
              <Link href="/login"><Button variant='darkblue'>Login</Button></Link>
              <Link href="/register"><Button variant='white'>Register</Button></Link>
            </>
          ) : (
            <Button variant='destructive' onClick={handleLogout} className="w-28">Logout</Button>
          )}
          
          
        </div>
      </div>
      <div className="w-full h-10 shadow-2xl rotate-180 relative z-50"/>
      <Input value={newFormTitle} onChange={(e) => setNewFormTitle(prev => e.target.value)} placeholder="Type your form name here!"></Input>
      <Button onClick={makeNewForm}>Make a form</Button>
      <div id="forms">Forms:</div>
        {formsArr.length !== 0 ? formsArr.map((form, i) => (
          <div key={i} className="min-h-60 border-5 border-blue-500">
            {form.title}
            <div>
              <div><Link href={`form/${form.form_id}/peek`}><Button>Peek</Button></Link><Link href={`form/${form.form_id}/edit`}><Button>Edit</Button></Link></div>
              <Link href={`form/${form.form_id}/attempt`}><Button>Start</Button></Link>
              <Button onClick={() => deleteForm(form.form_id)}>Delete</Button> 
            </div>
            
          </div>
        )): "No forms yet"}
    </div>
  );
}
