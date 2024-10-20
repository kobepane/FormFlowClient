"use server";

import { revalidatePath } from "next/cache";

export async function uploadPDFs(formData: FormData) {
  const files = formData.getAll("files") as File[];

  // Create a new FormData object to send to the API
  const apiFormData = new FormData();

  // Append each file to the new FormData object
  files.forEach((file, index) => {
    apiFormData.append(`file${index}`, file);
  });

  try {
    // Send the POST request to your /upload endpoint
    const response = await fetch("http://127.0.0.1:5000/upload", {
      method: "POST",
      body: apiFormData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    console.log(result);

    // Revalidate the path if necessary
    revalidatePath("/");

    return { message: `Successfully uploaded ${files.length} files`, result };
  } catch (error) {
    console.error("Upload failed:", error);
    return { message: "File upload failed" };
  }
}
