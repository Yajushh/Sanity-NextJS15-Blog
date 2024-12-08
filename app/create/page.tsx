import React from "react";
import CreateForm from "@/components/CreateForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Create() {
  const session = await auth();
  if (!session) redirect("/");
  return (
    <div className="max-w-5xl flex flex-col justify-center items-center w-full mx-auto my-10 px-5 py-3">
      <div className="border rounded-2xl px-2 py-3">
        <h1 className="text-center text-bold text-2xl">Create Your Post</h1>
        <CreateForm />
      </div>
    </div>
  );
}
