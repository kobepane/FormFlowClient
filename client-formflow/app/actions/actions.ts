// app/actions.ts
'use server'

import { revalidatePath } from 'next/cache'

export async function uploadPDFs(formData: FormData) {
  const files = formData.getAll('files') as File[]
  
  // Process the files here (e.g., save them to the server, send to another API)
  for (const file of files) {
    console.log(`Processing file: ${file.name}`)
    // Add your file processing logic here
    
  }

  // Revalidate the path if necessary
  revalidatePath('/')

  return { message: `Successfully uploaded ${files.length} files` }
}