import { OpenAI } from "langchain/llms/openai";
import SSE from "express-sse";

const sse = new SSE();

export default function handler(req, res) {
  if (req.method === "POST") {
    const { input } = req.body;

    if (!input) {
      throw new Error("No input");
    }
    // Initialize model
    const chat = new OpenAI({ 
      streaming: true,
      callbacks: [
        {
          handleLLMNewToken(token) {
            sse.send(token, 'newToken');
          }
        }
      ]
     });

    console.log("Streaming started");

    // create the prompt
    const prompt = `Create me a short rap song about my name and city. Make it funny an punny. Name: ${input}`
    console.log(prompt);
    // call will stream all responses tokens, when done, close the stream
    chat.call(prompt).then((response) => {
      sse.send(null, "end");
    })


    return res.status(200).json({ result: "Streming complete" });
  } else if (req.method === "GET") {
    sse.init(req, res);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
