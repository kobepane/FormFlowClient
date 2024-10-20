"use client";

import { useState } from "react";
import { uploadPDFs } from "../actions/actions";

export default function UploadForm() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!files) return;
    setIsLoading(true);
    setMessage("");

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const result = await uploadPDFs(formData);
      console.log(result);
      setIsLoading(false);
      // Handle the result (e.g., show a success message or download the CSV)
      if (result.csvContent) {
        // Create a Blob from the CSV content
        const blob = new Blob([result.csvContent], {
          type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);

        // Create a link and trigger the download
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", result.filename || "output.csv");
        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setMessage("CSV file downloaded successfully!");
      } else {
        setMessage(result.message || "Operation completed successfully.");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  return (
    <div className="flex w-full max-w-[900px] bg-[#FFFFFF] p-8 flex-col justify-center items-center min-h-[50vh] max-h-[1100px] rounded-sm space-y-2">
      <h1 className="w-full flex justify-center text-2xl mb-4">
        UO PALESTINE COALITION SUPPORT PETITION
      </h1>
      <p className="mb-8">
        I am signing in support of the UO for Palestine Coalition&apos;s demans
        that the University of Oregon Foundation disclose its investments and
        divest from companies that fund the US-Israeli war machine. I also
        demand that University of Oregon administration promptly uphold and
        carry out the May 22nd decamping agreement in earnest.
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          multiple
          accept=".pdf"
          onChange={(e) => setFiles(e.target.files)}
        />
        {files ? (
          <button
            className="border border-black rounded-sm px-4 py-2 hover:bg-slate-300"
            type="submit"
          >
            {isLoading ? "Processing..." : "Upload PDFs"}
          </button>
        ) : null}
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
