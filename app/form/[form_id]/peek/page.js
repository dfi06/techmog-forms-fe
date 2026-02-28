"use client";

import { use } from "react";
import { redirect } from "next/navigation";

const Page = ({ params }) => {
  const { form_id } = use(params);
  redirect(`/form/${form_id}/attempt?peek=true`);
};

export default Page;
