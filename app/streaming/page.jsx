"use client";
import React, { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import PromptBox from "../components/PromptBox";
import ResultStreaming from "../components/ResultStreaming";
import Title from "../components/Title";
import TwoColumnLayout from "app/components/TwoColumnLayout";

const Streaming = () => {
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState(null);
  const [data, setData] = useState("");
  const [source, setSource] = useState(null);

  const processToken = (token) => {
    // sanitize token streamed from the server
    return token.replace(/\\n/g, "\n").replace(/\\t/g, "\t").replace(/\"/g, "");
  };

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = async () => {

    console.log("handleSubmit");
    try {
      await fetch("/api/streaming", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: prompt }),
      });

      // close the previous EventSource
      if (source) {
        source.close();
      }

      // create a new EventSource
      const newSource = new EventSource("/api/streaming");
      setSource(newSource);
      console.log('test')

      // handle the message event
      newSource.addEventListener('newToken', (e) => {
        const token = processToken(e.data);
        setData((prevData) => prevData + token);
      });

      newSource.addEventListener('end', (e) => {
        newSource.close();
      });
    } catch (err) {
      console.error(`Error: ${err.message}`);
      setError(error);
    }
  };

  // Clean up the EventSource on component unmount
  useEffect(() => {
    return () => source && source.close();
  }, []);

  
  return (
    <>
      <Title emoji="💭" headingText="Streaming" />
      <TwoColumnLayout
        leftChildren={
          <>
            <PageHeader
              heading="Spit a Rap."
              boldText="Nobody likes waiting for APIs to load. Use streaming to improve the user experience of chat bots."
              description="This tutorial uses streaming.  Head over to Module X to get started!"
            />
          </>
        }
        rightChildren={
          <>
            <ResultStreaming data={data} />
            <PromptBox
              prompt={prompt}
              handlePromptChange={handlePromptChange}
              handleSubmit={handleSubmit}
              placeHolderText={"Enter your name and city"}
              error={error}
              pngFile="pdf"
            />
          </>
        }
      />
    </>
  );
};

export default Streaming;
