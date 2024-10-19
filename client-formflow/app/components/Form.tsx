"use client";

import { useState } from "react";
import { uploadPDFs } from "../actions/actions";

export default function UploadForm() {
  const [files, setFiles] = useState<FileList | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!files) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const result = await uploadPDFs(formData);
      console.log(result);
      // Handle the result (e.g., show a success message or download the CSV)
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  return (
    <div className="flex w-full max-w-[900px] bg-slate-200 p-8 flex-col justify-center items-start h-full max-h-[900px] rounded-md space-y-2">
      <h1 className="w-full flex justify-center">
        UO PALESTINE COALITION SUPPORT PETITION
      </h1>
      <p>
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
        <button
          className="border border-black rounded-sm px-4 py-2 hover:bg-slate-300"
          type="submit"
        >
          Upload PDFs
        </button>
      </form>
    </div>
  );
}
