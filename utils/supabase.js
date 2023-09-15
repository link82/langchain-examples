import { createClient } from '@supabase/supabase-js'
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase'
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

export const supabaseClient = () => {
  const privateKey = process.env.SUPABASE_PRIVATE_KEY;
  if (!privateKey) throw new Error(`Expected env var SUPABASE_PRIVATE_KEY`);

  const url = process.env.SUPABASE_URL;
  if (!url) throw new Error(`Expected env var SUPABASE_URL`);

  return createClient(url, privateKey);
}

export const attachToStore = async (tableName) => {
  const client = supabaseClient();
  const vectorStore = await SupabaseVectorStore.fromExistingIndex(
    new OpenAIEmbeddings(),
    { client, tableName: tableName, queryName: "match_documents" }
  );
  return vectorStore
}

// TODO: evaluate if we should create a function to create table, index and matching function

export const createVectorStoreWithDocuments = async (tableName, documents) => {
  const client = supabaseClient();
  const res = await SupabaseVectorStore.fromDocuments(
    documents,
    new OpenAIEmbeddings(),
    {
      client,
      tableName: tableName,
      queryName: "match_documents",
    }
  );
  return res;
}

export const addDocumentsToVectorStore = async (tableName, documents, replaceIds=[]) => {
  const client = supabaseClient();
  
  const vectorStore = await attachToStore(tableName);

  const res = await vectorStore.addDocuments(documents, replaceIds);
  console.log(res);
  return res;
}