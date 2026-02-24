import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'

const page = () => {

  return (
    <div>
        <form>
            <Label>Enter username</Label>
            <Input></Input>
            <Label>Enter password</Label>
            <Input></Input>
            <Button>Register</Button>
        </form>
    </div>
  )
}

export default page