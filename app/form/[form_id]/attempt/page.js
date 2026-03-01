"use client";
import React, { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Page = ({ params }) => {
  const router = useRouter();
  const { form_id } = use(params);

  const searchParams = useSearchParams();
  const isPeeking = searchParams.get("peek") === "true";

  const [form, setForm] = useState(null);
  const [attempt, setAttempt] = useState({});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      const userRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const userData = await userRes.json();
      setUser(userData.user);

      const formRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/form/by/${form_id}`,
      );
      const formData = await formRes.json();
      setForm(formData.form);

      setAttempt(
        (formData.form.question ?? []).map((question) => ({
          question_id: question._id,
          answer: [],
        })),
      );

      setLoading(false);
    };

    fetchData();
  }, [form_id]);

  useEffect(() => {
    console.log(attempt);
    console.log(form);
  }, [attempt, form]);

  const handleSubmit = async () => {
    const payload = {
      form_id,
      answers: [],
    };
    if (user) payload.attempted_by_id = user.id;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/attempt/create`,
      {
        body: JSON.stringify(payload),
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
    );
    if (!res.ok) return null;
    router.back();
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/form/delete/${form_id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      if (!res.ok) {
        toast(data.message);
        return null;
      }
      if (data) {
        toast.success("Form deleted successfully");
        router.push("/");
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  if (loading) return <Spinner className="size-12 mx-auto mt-[30vh]" />;

  return (
    <div>
      <div className="text-center font-semibold text-2xl border-b pt-20 pb-10 px-10 grid grid-cols-3 items-center ">
        <Button onClick={() => router.back()} className="w-24">
          ← Back
        </Button>
        {form.title}
        {isPeeking && user?._id === form?.owner_id ? (
          <div className="flex gap-4 justify-end ">
            <Link href={`/form/${form_id}/edit`}>
              <Button>Edit</Button>
            </Link>
            <Link href={`/form/${form_id}/response`}>
              <Button>View responses</Button>
            </Link>
          </div>
        ) : (
          ""
        )}
      </div>

      {(form.questions ?? []).map((question, i) => {
        return (
          <div
            key={question._id}
            className="border-b-gray-300 border-b py-10 mx-100"
          >
            <div>{question.question_text}</div>

            {question.type === "Multiple Choice" && (
              <div className="flex flex-col mt-2">
                <RadioGroup
                  onValueChange={(val) =>
                    typeof setSingleChoice === "function" &&
                    setSingleChoice(question._id, Number(val))
                  }
                >
                  {question.options.map((opt, i) => (
                    <div
                      key={`${question._id}-${i}`}
                      className="flex items-center gap-3"
                    >
                      <RadioGroupItem
                        id={`${question._id}-${i}`}
                        value={question.options[i]}
                      />
                      <Label className="mb-0" htmlFor={`${question._id}-${i}`}>
                        {opt}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {question.type === "Short Answer" && (
              <Input
                onChange={(e) => setShortAnswer(question._id, e.target.value)}
                className="mt-2"
              />
            )}

            {question.type === "Checkbox" && (
              <div className="flex flex-col mt-2 gap-3">
                {question.options.map((opt, i) => (
                  <div
                    key={`${question._id}-${i}`}
                    className="flex items-center gap-3"
                  >
                    <Checkbox id={`${question._id}-${i}`} />
                    <Label className="mb-0" htmlFor={`${question._id}-${i}`}>
                      {opt}
                    </Label>
                  </div>
                ))}
              </div>
            )}

            {question.type === "Dropdown" && (
              <div className="mt-2">
                <Combobox items={question.options || []}>
                  <ComboboxInput placeholder="Pick" />
                  <ComboboxContent>
                    <ComboboxEmpty>No options</ComboboxEmpty>
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
        );
      })}

      {isPeeking ? (
        ""
      ) : (
        <Button onClick={handleSubmit} className="block w-40 mx-auto my-8 h-12">
          Submit
        </Button>
      )}
    </div>
  );
};

export default Page;
