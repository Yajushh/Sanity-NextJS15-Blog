"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema, PostSchemaType } from "@/lib/validation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
});

export default function CreateForm() {
  const [categoriesList, setCategoriesList] = useState<
    { title: string; _id: string }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function getCategories() {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        const data = await res.json();
        setCategoriesList(data);
      } catch (err) {
        console.error("Failed to load categories:", err);
        setError("Failed to load categories");
      }
    }
    getCategories();
  }, []);

  const form = useForm<PostSchemaType>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      categories: "",
      bodyText: "",
      mainImage: null,
    },
  });

  async function onSubmit(values: PostSchemaType) {
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("categories", values.categories);
    formData.append("bodyText", values.bodyText);
    if (values.mainImage && values.mainImage.length > 0) {
      formData.append("mainImage", values.mainImage[0]);
    }

    try {
      const response = await fetch("/api/createPost", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.status === "SUCCESS") {
        window.location.href = "/";
      } else {
        setError(result.error || "Failed to create post");
      }
    } catch (err) {
      console.error("Error creating post:", err);
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        {error && <p className="text-red-500">{error}</p>}

        {/* Title Field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Categories Field */}
        <FormField
          control={form.control}
          name="categories"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categories</FormLabel>
              <p className="text-muted-foreground">
                Select from a variety of categories.
              </p>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesList.length === 0 ? (
                      <SelectItem value="Null" disabled>
                        No categories available
                      </SelectItem>
                    ) : (
                      categoriesList.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.title}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Body Text Field with Markdown Editor */}
        <FormField
          control={form.control}
          name="bodyText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Body</FormLabel>
              <p className="text-muted-foreground">
                Write your content in Markdown.
              </p>
              <FormControl>
                <MDEditor
                  value={field.value}
                  onChange={(value) => field.onChange(value ?? "")}
                  height={300}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Main Image Field */}
        <FormField
          control={form.control}
          name="mainImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Main Image</FormLabel>
              <p className="text-muted-foreground">
                Upload an image for the post.
              </p>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files) {
                      field.onChange(e.target.files);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating Post..." : "Create Post"}
        </Button>
      </form>
    </Form>
  );
}
