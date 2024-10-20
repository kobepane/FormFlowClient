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

    // Check if the response is a CSV file
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("text/csv")) {
      // It's a CSV file, so let's get it as text
      const csvText = await response.text();

      // Process the CSV text
      const rows = csvText.split("\n").map((row) => row.split(","));

      // The first row is typically the header
      const header = rows[0];
      const data = rows.slice(1);

      // Create CSV content
      const csvContent = [header, ...data]
        .map((row) => row.join(","))
        .join("\n");

      revalidatePath("/");
      return {
        message: `Successfully processed CSV with ${data.length} rows`,
        csvContent,
        filename: "output.csv",
      };
    } else {
      // If it's not a CSV, handle it as before (assuming JSON)
      const result = await response.json();
      console.log(result);

      revalidatePath("/");

      return {
        message: `Successfully uploaded ${result.files.length} files`,
        result,
      };
    }
  } catch (error) {
    console.error("Upload failed:", error);
    return { message: "File upload failed" };
  }
}
