import { PortableText } from "next-sanity";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { POST_FETCH_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const [post] = await Promise.all([client.fetch(POST_FETCH_QUERY, { id })]);
  if (!post) return notFound();
  const imageUrl = urlFor(post.mainImage).width(1000).height(400).url();
  return (
    <>
      <section className="w-full min-h-[530px] shadow-sm flex justify-center items-center flex-col py-5 px-6">
        <h1 className="text-3xl">{post?.title}</h1>
        <p className="text-sm text-muted-foreground">
          By{" "}
          <Link href={`/user/${post.author?._id}`}>@{post.author?.name}</Link>{" "}
          <span> | {post._updatedAt}</span>
        </p>

        <img src={imageUrl} alt="Blog Post Placeholder" />
      </section>

      <section className="prose lg:prose-xl max-w-none px-6 py-5">
        <PortableText value={post.body} />
      </section>
    </>
  );
}
