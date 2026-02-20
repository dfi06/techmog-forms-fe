import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'

const page = () => {

  return (
    <div>
        <form>
            <Label></Label>
            <Input></Input>
            <Label></Label>
            <Input></Input>
            <Button>Login</Button>
        </form>
    </div>
  )
}

export default page