"use client";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const Page = ({ params }) => {
  const router = useRouter();
  const { form_id } = use(params);
  const [response, setResponse] = useState(null);
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

      const responseRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/response/get/${form_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const responseData = await responseRes.json();
      setResponse(responseData);
      console.log(responseData);

      setLoading(false);
    };

    fetchData();
  }, [form_id]);

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A28BFE",
    "#FF6699",
    "#33CC99",
  ];

  if (loading) return <Spinner className="size-12 mx-auto mt-[30vh]" />;

  return (
    <div>
      <div className="text-center font-semibold text-2xl border-b pt-20 pb-10 px-10 grid grid-cols-3 items-center ">
        <Button onClick={() => router.back()} className="w-24">
          ← Back
        </Button>
        {response.title}
      </div>
      <div className="mx-95 mt-4 space-y-4">
        <div className="grid grid-cols-2 font-semibold text-xl items-center gap-4">
          <div className="border p-8 pr-30">
            Total Responses
            <div className="font-normal text-gray-500 mt-4">
              {response.total_responses}
            </div>
          </div>
          <div className="border p-8 pr-30">
            Total Unique Users
            <div className="font-normal text-gray-500 mt-4">
              {response.total_unique_users}
            </div>
          </div>
        </div>
        {response.questions.map((question) => {
          const data = Object.entries(question.answers).map(
            ([name, value], index) => ({
              name,
              value,
              fill: COLORS[index % COLORS.length],
            }),
          );

          return (
            <div key={question.question_id} className="border p-4">
              <div>{question.question_text}</div>

              <div style={{ width: 600, height: 400 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={data}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      label
                    ></Pie>

                    <Tooltip />
                    <Legend
                      layout="vertical"
                      verticalAlign="middle"
                      align="right"
                      className="ml-40"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
        <div></div>
      </div>
    </div>
  );
};

export default Page;
