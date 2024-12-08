import { Author, Post } from "@/sanity.types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";

export type BlogCardType = Omit<Post, "author"> & { author?: Author };

export default function BlogCard({
  post,
  className,
}: {
  post: BlogCardType;
  className?: string;
}) {
  const { _createdAt, title, author, categories, mainImage, _id, body } = post;
  // const builder = imageUrlBuilder(client);
  // function urlFor(source) {
  //   return builder.image(source);
  // }
  const imageUrl = mainImage
    ? urlFor(mainImage).width(400).height(200).url()
    : null;
  const altText = mainImage?.alt || "Blog Post Image";

  return (
    <>
      <Card className={cn(className)}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            <Link href={`/user/${author?._id}`} className="hover:underline">
              @{author?.name}
            </Link>
            <span> | {_createdAt}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <img src={imageUrl} alt={altText} />
        </CardContent>
      </Card>
    </>
  );
}
