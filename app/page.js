'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react"
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formsArr, setFormsArr] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  

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
          if(data) setUser(data.user);
          setLoading(false)
      })

      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/form/all`, {
      }).then(res => res.json())
      .then(data => {
          if(data) {
            setFormsArr(data.forms)
          }
      })

  }, [])

  const handleSearch = async() => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/form/search?q=${searchQuery}`
    )
    const data = await res.json()

    if (data.forms) {
      setFormsArr(data.forms)
    }
  }

  const makeNewForm = async () => {
    const token = localStorage.getItem('token');
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/form/create`, {
      body: JSON.stringify({ owner_id: user?._id}),
      method: "POST",
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }  
    }).then(res => res.json())
    .then(data => {
      if(data) router.push(`/form/${data?.form_id}/edit`)
    })
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
            <div >
              <h1 className="-tracking-[0.085em] font-bold text-6xl ">Techmog </h1>
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
          {loading ? (
            <div>be patient pls</div>
          ) :
          !user ? (
            <>
              <Link href="/login"><Button variant='darkblue'>Login</Button></Link>
              <Link href="/register"><Button variant='white'>Register</Button></Link>
            </>
          ) : (
            <Button variant='destructive' onClick={handleLogout} className="w-28">Logout</Button>
          )
          }
          
          
          
        </div>
      </div>
      <div className="w-full h-10 shadow-2xl rotate-180 relative z-50"/>
      {user ? (
            <Button onClick={makeNewForm}>Make a form</Button>
          ) : (
            <div>Please log in to make a form</div>
          )
          }
      <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}></Input><Button onClick={handleSearch}>Search</Button>
      <div id="forms">Forms:</div>
        {formsArr.length !== 0 ? formsArr.map((form, i) => (
          <div key={i} className="min-h-60 border-5 border-blue-500">
            {form.title}
            <>
              <div><Link href={`form/${form._id}/peek`}><Button>Peek</Button></Link></div>
              <Link href={`form/${form.form_id}/attempt`}><Button>Start</Button></Link>
            </>
            
          </div>
        )): "No forms yet"}
    </div>
  );
}
