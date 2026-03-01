"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeClosed } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((showPassword) => !showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        },
      );

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
      }

      if (!res.ok) {
        toast.error(data.message || "Login failed");
        return;
      }

      toast.success("Logged in successfully");
      router.push("/");
    } catch (err) {
      toast.error("Network error");
    }
  };

  useEffect(() => {
    localStorage.removeItem("token");
  }, []);

  return (
    <div className="w-100 mx-auto">
      <Button onClick={() => router.back()} className="w-24 mb-4 mt-20">
        ← Back
      </Button>
      <form
        onSubmit={handleLogin}
        className="p-8 w-80 gap-2 flex flex-col border-primary border-2 shadow-xl rounded-xl "
      >
        <div className="font-semibold text-center text-xl mb-8">Login</div>
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
          />
          <Button onClick={togglePasswordVisibility}>
            {showPassword ? <Eye /> : <EyeClosed />}
          </Button>
        </div>

        <Button className="w-36 mt-8 self-center" type="submit">
          Login
        </Button>
      </form>
    </div>
  );
};

export default Page;
