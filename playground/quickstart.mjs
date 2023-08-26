import { OpenAI } from "langchain/llms/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { SerpAPI } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { PlanAndExecuteAgentExecutor } from "langchain/experimental/plan_and_execute";
import { exec } from "child_process";

// export OPENAI_API_KEY=<>
// export SERPAPI_API_KEY=<>
// Replace with your API keys!

// to run, go to terminal and enter: cd playground
// then enter: node quickstart.mjs
console.log("Welcome to the LangChain Quickstart Module!");

// load .env file
import dotenv from "dotenv";
dotenv.config();

// multi line string
const template = `
  You are a director of social media with 30 years of experience. 
  Please give me some ideas for content I can write about regarding {topic}. 
  The content is for {social_platform}. Translate to {language}.
`;

// const prompt = new PromptTemplate({
//   template,
//   inputVariables: ["topic", "social_platform", "language"],
// });

// // example of how to use the prompt template
// const formatted = await prompt.format({
//   topic: "how to define your writing style and the proper tone of voice for your brand", 
//   social_platform: "Youtube",
//   language: "italian",
// })

// const model = new OpenAI({ temperature: 0.7 }); //, maxTokens: 100, topP: 1, frequencyPenalty: 0, presencePenalty: 0, stop: ["\n"] 
// const chain = new LLMChain({ llm: model, prompt: prompt });

// const result = await chain.call({
//   topic: "how to define your writing style and the proper tone of voice for your brand", 
//   social_platform: "Youtube",
//   language: "italian",
// })

// console.log(result);
const tools = [
  new SerpAPI(process.env.SERPAPI_API_KEY, {
    location: "Austin, Texas",
    searchEngine: "google",
    hl: "en",
    gl: "us",
  }),
  new Calculator(),
]

// Zero shot Agent example
// const agentModel = new OpenAI({
//   temperature: 0,
//   modelName: 'text-davinci-003'
// });

// const executor = await initializeAgentExecutorWithOptions(tools, agentModel, {
//   agentType: "zero-shot-react-description",
//   verbose: true,
//   maxIterations: 10,
// })

// const input = 'What is LangChain?'

// const result = await executor.call({input})
// console.log(result)

// Plan and action agent example
// const model = new ChatOpenAI({ 
//   temperature: 0,
//   modelName: 'gpt-3.5-turbo',
//   verbose: true,
// });

// // you don't tell the agent what to do, you tell it what you want
// const executor = PlanAndExecuteAgentExecutor.fromLLMAndTools({
//   llm: model,
//   tools
// })

// const result = await executor.call({
//   input: 'What is the country that recently succeeded a moon landing? In what part of the moon did they land?'
// })


// Memory with a conversation chain example
const llm = new OpenAI({});
const memory = new BufferMemory({ });
const conversationChain = new ConversationChain({ llm, memory });

// sentence 1
const sentence1 = 'My favourite food is pizza';
const result = await conversationChain.call({ input: sentence1 });
console.log(sentence1);
console.log(result);

// sentence 2
const sentence2 = 'What is my favourite food?'
const result2 = await conversationChain.call({ input: sentence2 });
console.log(sentence2);
console.log(result2);
