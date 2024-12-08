import { defineQuery } from "next-sanity";

export const POST_PREVIEW_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(_createdAt desc) {
    _id,
    title,
    _createdAt,
    author -> { name, _id },
    mainImage,
  }
`);

export const AUTHOR_FETCH_QUERY = defineQuery(`
  *[_type == "author" && _id == $id][0] {
  _id, name, image, bio, slug, _createdAt
  }
  `);

export const POST_FETCH_QUERY = defineQuery(`
  *[_type == "post" && _id == $id][0] {
  _id, title, mainImage, author -> {name, _id}, body
  }
  `);

export const CATEGORY_FETCH_QUERY = defineQuery(`
  *[_type == "category"] {
  title, _id
}
`);
