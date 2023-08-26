// start here
// Here you can find all react snippets shortcuts: https://github.com/ults-io/vscode-react-javascript-snippets/blob/HEAD/docs/Snippets.md

// this is a client component
'use client'

import React, { useState, useEffect } from "react";
import PageHeader from 'app/components/PageHeader'
import PromptBox from 'app/components/PromptBox'
import Title from 'app/components/Title'
import TwoColumnLayout from 'app/components/TwoColumnLayout'
import ResultWithSources from 'app/components/ResultWithSources'
import '../globals.css'

const Memory = () => {

  const [prompt, setPrompt] = useState('')
  const [error, setError] = useState(null)
  const [messages, setMessages] = useState([{
    text: "I remember everything, what do you want to know?",
    type: 'bot'
  }])

  const [firstMsg, setFirstMsg] = useState(true)

  const handlePromptChange = (e) => {
    setPrompt(e.target.value)
  }

  const handleSubmit = async () => {
    try {

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: prompt, type: 'user' }
      ])
      // dup string value
      const promptString = prompt
      setPrompt('')

      const response = await fetch('/api/memory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ input: promptString, firstMsg })
      })

      if (!response.ok) {
        throw new Error(response.statusText)
      }
      
      setFirstMsg(false)

      
      const data = await response.json()
      // console.log(data)
      setMessages((prevMessages) =>[
        ...prevMessages,
        { text: data.output, type: 'bot' }
      ])
      setError(null)
      
    } catch (error) {
      console.log(error)
      setError(error.message)
    }
  }

  return (
    <>
      <Title headingText="Memory" emoji="🧠" />
      <TwoColumnLayout
        leftChildren={
          <>
            <PageHeader 
              heading="I remember everything" 
              boldText="Let's learn about memory."
              description="This tool uses buffer memory to store information. It is a temporary memory that is used to store information while it is being processed. It is used to store intermediate results of processing."
              />
          </>
        }
        rightChildren={
          <>
            <ResultWithSources
              messages={messages}
              pngFile="brain"
            />
            <PromptBox
              prompt={prompt}
              handleSubmit={handleSubmit}
              handlePromptChange={handlePromptChange}
              error={error}
            />
          </>
        }
      />

    </>
  )
}

export default Memory

