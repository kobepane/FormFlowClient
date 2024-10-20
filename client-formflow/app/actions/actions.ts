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

      console.log("CSV Header:", header);
      console.log("CSV Data:", data);

      // const result = await response.json();

      // console.log(result);

      // const files = result.files;

      // // Now you can work with the files array
      // files.forEach((file: string[], index: number) => {
      //   console.log(`File ${index + 1}:`);
      //   console.log(file);
      //   // Process each file as needed
      //   // Find the index of 'earnest'

      //   //clean each file

      //   //create csv
      //   //return csv
      // });

      // Revalidate the path if necessary
      revalidatePath("/");
      return {
        message: `Successfully processed CSV with ${data.length} rows`,
        header,
        data,
      };
    } else {
      // If it's not a CSV, handle it as before (assuming JSON)
      const result = await response.json();
      console.log(result);

      const files = result.files;

      // Process files as before...

      // Revalidate the path if necessary
      revalidatePath("/");

      return { message: `Successfully uploaded ${files.length} files`, result };
    }
  } catch (error) {
    console.error("Upload failed:", error);
    return { message: "File upload failed" };
  }
}
