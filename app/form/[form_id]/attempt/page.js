import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const page = () => {
  return (
    <div>
        <Link href="/"><Button>Back</Button></Link>

        <Button>Submit</Button>
    </div>
  )
}

export default page