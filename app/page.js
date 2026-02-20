import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="">
      <div className="h-[60vh] flex flex-col py-20 bg-blue-400 text-white w-full gap-16 justify-center">
        <div className="flex gap-32 justify-center">
          <div className="space-y-4">
            <h1 className="font-bold text-4xl">Welcome</h1>
            <p className="w-[40ch]">Make and submit forms. Techmog™ other chudmaxxing arch-cels. We provide the best in-house tools for creating forms. Usage of site may attract attention from foids, Techmog Forms is not liable for any unwanted conduct or damages.</p>
          </div>
          <div className="my-auto">
            <h1 className="-tracking-[0.085em] font-bold text-6xl">Techmog </h1>
            <h1 className="-tracking-[0.085em] font-bold text-6xl">Forms.</h1>
          </div>
          
        </div>
        <div className="space-x-8 self-center mx-auto ">
          <Button variant='darkblue'>Login</Button>
          <Button variant='white'>Register</Button>
        </div>
      </div>

      <div>
        Forms:

      </div>
      
      
    </div>
  );
}
