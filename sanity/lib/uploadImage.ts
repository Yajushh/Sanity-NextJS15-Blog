import { SanityAssetDocument } from "next-sanity";

import { writeClient } from "./write-client";

export const uploadImage = async (
  imageFile: File
): Promise<SanityAssetDocument | null> => {
  try {
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const asset = await writeClient.assets.upload("image", buffer, {
      filename: imageFile.name,
    });
    return asset;
  } catch (error) {
    console.log("Error uploading the image: ", error);
    return null;
  }
};
