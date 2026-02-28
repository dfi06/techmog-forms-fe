"use client";
import React, { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";

const Page = ({ params }) => {
  const router = useRouter();
  const { form_id } = use(params);

  const searchParams = useSearchParams();
  const isPeeking = searchParams.get("peek") === "true";

  const [form, setForm] = useState(null);
  const [attempt, setattempt] = useState({});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
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

      setLoading(false);
    };

    fetchData();
  }, [form_id]);

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
      if (data) router.push("/");
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  if (loading) return <div>Loading... please wait</div>;

  return (
    <div>
      <div className="flex gap-4 px-10 pt-10">
        <Button onClick={() => router.back()}>← Back</Button>

        {isPeeking && user?._id === form?.owner_id ? (
          <>
            <Link href={`/form/${form_id}/edit`}>
              <Button>Edit</Button>
            </Link>
            <Button>View responses</Button>

            <Button onClick={handleDelete} className="ml-auto">
              Delete
            </Button>
          </>
        ) : (
          ""
        )}
      </div>
      <div className="text-center font-semibold text-2xl border-b py-10">
        {form.title}
      </div>

      {form.questions.map((question, i) => {
        return (
          <div
            key={question._id}
            className="border-b-gray-300 border-b py-10 mx-100"
          >
            <div>{question.question_text}</div>
            {question.type === "Multiple Choice" && (
              <div className="flex flex-col">
                {question.options.map((opt, i) => (
                  <label key={`${question._id}-${i}`}>
                    <input
                      type={
                        question.type === "Multiple Choice" ? "radio" : "radio"
                      }
                      name={question._id}
                      checked={answers[question._id] === i}
                      onChange={() => setSingleChoice(question._id, i)}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            )}

            {question.type === "Short Answer" && (
              <Input
                value={answers[question._id] || ""}
                onChange={(e) => setShortAnswer(question._id, e.target.value)}
              />
            )}

            {question.type === "Checkbox" && (
              <div className="flex flex-col">
                {question.options &&
                  question.options.map((opt, i) => (
                    <label key={`${question._id}-${i}`}>
                      <input
                        type="checkbox"
                        checked={(answers[question._id] || []).includes(i)}
                        onChange={() => toggleCheckbox(question._id, i)}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
              </div>
            )}
          </div>
        );
      })}

      {isPeeking ? (
        ""
      ) : (
        <Button onClick={handleSubmit} className="block w-40 mx-auto">
          Submit
        </Button>
      )}
    </div>
  );
};

export default Page;

// small normalizer to ensure each question has `question_id` for client code
function normalizeSavedForm(form) {
  if (!form) return form;
  return {
    ...form,
    questions: (form.questions || []).map((question) => ({
      ...question,
      question_id: String(question._id || question.question_id || question.id),
    })),
  };
}
