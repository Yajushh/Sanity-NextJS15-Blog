"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "./utils";
import slugify from "slugify";
import { uploadImage } from "@/sanity/lib/uploadImage";
import { writeClient } from "@/sanity/lib/write-client";
import { client } from "@/sanity/lib/client";
import { CATEGORY_FETCH_QUERY } from "@/sanity/lib/queries";

export const createPost = async (formData: FormData) => {
  const session = await auth();
  if (!session) {
    return parseServerActionResponse({
      error: "User not signed-in.",
      status: "ERROR",
    });
  }

  const { title, categories, bodyText } = Object.fromEntries(formData);
  const slug = slugify(title as string, { lower: true, strict: true });

  try {
    // IMAGE
    let mainImage = null;
    const imageFile = formData.get("mainImage") as File | null;
    if (imageFile && imageFile.size > 0) {
      const imageAsset = await uploadImage(imageFile);
      if (imageAsset) {
        mainImage = {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imageAsset._id,
          },
        };
      }
    }

    // CATEGORIES
    const categoryRefs = [];
    const categoryIds = Array.isArray(categories) ? categories : [categories];
    categoryIds.forEach((catId) => {
      categoryRefs.push({
        _type: "reference",
        _ref: catId,
      });
    });

    // FETCH OR CREATE AUTHOR
    const author = await writeClient.fetch(
      `
      *[_type == "author" && email == $email][0]
      `,
      { email: session.user?.email }
    );
    let authorId;
    if (author) {
      authorId = author._id;
    } else {
      const newAuthor = await writeClient.create({
        _type: "author",
      });
    }
    // BODY (Markdown content stored as a string in bodyText)
    const bodyContent = [
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: bodyText as string,
          },
        ],
      },
    ];

    const post = {
      _type: "post",
      title,
      slug: {
        _type: "slug",
        current: slug,
      },
      author: {
        _type: "reference",
        _ref: authorId,
      },
      mainImage,
      categories: categoryRefs,
      // Automatically set the current date/time here
      publishedAt: new Date().toISOString(),
      body: bodyContent,
    };

    const result = await writeClient.create(post);
    return parseServerActionResponse({
      ...result,
      error: "No errors",
      status: "SUCCESS",
    });
  } catch (error) {
    console.log("Error creating post: ", error);
    return parseServerActionResponse({
      error: "Error occurred while creating the post",
      status: "ERROR",
    });
  }
};

export const fetchCategories = async () => {
  const categories = await client.fetch(CATEGORY_FETCH_QUERY);
  return categories;
};
