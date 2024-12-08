import { createPost } from "@/lib/actions";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const result = await createPost(formData);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in /api/createPost route: ", error);
    return NextResponse.json(
      {
        error: "An unexpected error occurred.",
      },
      {
        status: 500,
      }
    );
  }
}
