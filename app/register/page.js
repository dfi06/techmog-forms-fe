"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeClosed } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((showPassword) => !showPassword);
  };
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Registration failed");
        return;
      }

      toast.success("Registered successfully");
      router.push("/login");
    } catch (err) {
      toast.error("Network error");
    }
  };

  return (
    <div className="w-100 mx-auto">
      <Button onClick={() => router.back()} className="w-24 mb-4  mt-30">
        ← Back
      </Button>
      <form
        onSubmit={handleRegister}
        className="px-8 py-12 w-80 gap-2 flex flex-col border-primary border-2 shadow-xl rounded-xl "
      >
        <Label>Enter username</Label>
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
          className="mb-4"
        ></Input>
        <Label>Enter password</Label>
        <div className="flex gap-4">
          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          ></Input>
          <Button onClick={togglePasswordVisibility}>
            {showPassword ? <Eye /> : <EyeClosed />}
          </Button>
        </div>
        <Button className="w-36 mt-8 self-center" type="submit">
          Register
        </Button>
      </form>
    </div>
  );
};

export default Page;
