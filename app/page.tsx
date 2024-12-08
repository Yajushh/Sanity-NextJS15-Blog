import BlogCard from "@/components/BlogCard";

import { sanityFetch } from "@/sanity/lib/live";
import { POST_PREVIEW_QUERY } from "@/sanity/lib/queries";
import Link from "next/link";

export default async function Home() {
  const { data: posts } = await sanityFetch({ query: POST_PREVIEW_QUERY });
  return (
    <>
      <section className=" flex px-10 py-10 space-y-4 mx-auto  ">
        <li className="flex gap-10">
          {posts.map((post) => (
            <>
              <Link href={`/post/${post._id}`}>
                <BlogCard
                  className=" cursor-pointer transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
                  key={post._id}
                  post={post}
                />
              </Link>
            </>
          ))}
        </li>
      </section>
    </>
  );
}
