import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { PineconeClient } from "@pinecone-database/pinecone";
import { Document } from "langchain/document";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { createClient } from '@supabase/supabase-js'
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase'

// Example: https://js.langchain.com/docs/modules/indexes/document_loaders/examples/file_loaders/pdf
export default async function handler(req, res) {
  if (req.method === "GET") {
    console.log("Inside the PDF handler");
    // Enter your code here
    /** STEP ONE: LOAD DOCUMENT */
    const bookPath = "./data/pdfs/ProgettoSito_Taietti.pdf";

    // Load the document
    const loader = new PDFLoader(bookPath);
    // using docs because it can be a single document or an array of documents
    const docs = await loader.load(); 
    console.log(docs);

    if (docs === null || docs.length === 0) {
      console.log("No documents found");
      //throw new Error("No documents found");
      return res.status(400).json({ result: "No documents found" });
    }

    // remove metadata before chunking
    docs.forEach((doc) => {
      doc.metadata = {}
    });

    // Chunk it
    const splitter = new CharacterTextSplitter({
      separator: " ", // automatically split on newlines
      chunkLength: 200,
      chunkOverlap: 10,
    });

    const chunks = await splitter.splitDocuments(docs);
  
    // Reduce the size of the metadata
    console.log(chunks[0]);

    /** STEP TWO: UPLOAD TO DATABASE */
    // Initialize the client
    // const client = new PineconeClient()
    // await client.init({
    //   apiKey: process.env.PINECONE_API_KEY,
    //   environment: process.env.PINECONE_ENVIRONMENT,
    // });

    // // Fetch the index
    // const index = client.Index(process.env.PINECONE_INDEX)

    // // upload documents to Pinecone
    // await PineconeStore.fromDocuments(chunks, new OpenAIEmbeddings(), {
    //   index
    // })

    // Alternative: use Supabase instead of Pinecone if you're on waitlist (see this video for explanation: https://www.udemy.com/course/langchain-develop-ai-web-apps-with-javascript-and-langchain/learn/lecture/38362160)
    const privateKey = process.env.SUPABASE_PRIVATE_KEY;
    if (!privateKey) throw new Error(`Expected env var SUPABASE_PRIVATE_KEY`);

    const url = process.env.SUPABASE_URL;
    if (!url) throw new Error(`Expected env var SUPABASE_URL`);

    const client = createClient(url, privateKey);

    await SupabaseVectorStore.fromDocuments(
      chunks,
      new OpenAIEmbeddings(),
      {
        client,
        tableName: "documents",
        queryName: "match_documents",
      }
    );

    console.log("Upload complete")

    return res.status(200).json({ result: "Upload complete" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
