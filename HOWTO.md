# HOWTO

## Resources
* Course manual on Notion: `https://weeknightsandweekends.notion.site/weeknightsandweekends/Langchain-JS-Course-Dashboard-1ebe2de6cb0c4749ad63ff1ccfe588a0`

* Langchain-hub: a curated repository of Langchain resources: https://github.com/hwchase17/langchain-hub

## How to load a serialized chain from a file
```js
from langchain.chains import load_chain

chain = load_chain('lc://chains/path/to/file.json')
```

## How to load a serialized prompt from a string
```js
from langchain.prompts import load_prompt

prompt = load_prompt('lc://prompts/path/to/file.json')

```

## How to load a serialized agent from a file
```js
from langchain.agents import initialize_agent

llm = ...
tools = ...

agent = initialize_agent(tools, llm, agent="lc://agents/self-ask-with-search/agent.json")
```