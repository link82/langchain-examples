import { OpenAI } from "langchain/llms/openai";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";

let chain
let openai
let memory


export default async function handler(req, res) {
  if (req.method === "POST") {
    const { input, firstMsg } = req.body;

    if (!input) {
      throw new Error("Missing input");
    }

    if (firstMsg) {
      console.log('Initializing chain')
      memory = new BufferMemory();
      openai = new OpenAI({ modelName: 'gpt-3.5-turbo'});
      chain = new ConversationChain({ llm: openai, memory: memory });
    }

    const response = await chain.call({ input });

    console.log("Response", response);
    return res.status(200).json({ output: response.response });
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}