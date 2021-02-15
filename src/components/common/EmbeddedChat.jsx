import React, { useEffect } from "react";

const EmbeddedChat = props => {
  useEffect(() => {
    console.log("loading script!")
    const script = document.createElement('script');

    script.src = "https://tlk.io/embed.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  }, []);

  return (
    <div id="tlkio" data-channel="wanana-staging" style={{ width:'100%', height: '400px' }} />
  )
}

export default EmbeddedChat;
