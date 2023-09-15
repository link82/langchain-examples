import { VectorDBQAChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
// import { OpenAIEmbeddings } from "langchain/embeddings/openai";
// import { createClient } from '@supabase/supabase-js'
// import { SupabaseVectorStore } from 'langchain/vectorstores/supabase'
import { attachToStore } from "utils/supabase";

// Example: https://js.langchain.com/docs/modules/indexes/document_loaders/examples/file_loaders/pdf
export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      throw new Error("Method not allowed");
    }

    console.log("Query PDF");

    // Grab the user prompt
    const { input } = req.body;

    if (!input) {
      throw new Error("No input");
    }

    console.log("input received:", input);

    /* Use as part of a chain (currently no metadata filters) */

    /* Better search approach using Supabase hybrid search */
    // https://js.langchain.com/docs/modules/data_connection/retrievers/integrations/supabase-hybrid/

    // Initialize Supabase
    // const privateKey = process.env.SUPABASE_PRIVATE_KEY;
    // if (!privateKey) throw new Error(`Expected env var SUPABASE_PRIVATE_KEY`);

    // const url = process.env.SUPABASE_URL;
    // if (!url) throw new Error(`Expected env var SUPABASE_URL`);

    // const client = createClient(url, privateKey);

    // init VectorStore
    const vectorStore = await attachToStore("documents");

    // init chain to OpenAI
    const model = new OpenAI();
    const chain = VectorDBQAChain.fromLLM(model, vectorStore, {
      k: 1,
      returnSourceDocuments: true,
    });

    // Search!
    const response = await chain.call({ query: input });
    console.log("response:", response);

    return res.status(200).json({ result: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}
