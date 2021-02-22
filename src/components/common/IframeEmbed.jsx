import React from "react"

const width = 962
const height = 565

const IframeEmbed = ({ src }) => {
  if (!src) return null

  const ratio = (height / width) * 100

  const styles = {
    iframeContainer: {
      position: "relative",
      paddingBottom: `${ratio}%`,
      height: 0,
      overflow: "hidden",
      width: "100%",
      maxWidth: "100%",
      marginTop: "20px",
      marginBottom: "30px",
      background: "linear-gradient(100deg, rgba(195, 69, 128, 0.5) 0%, rgba(236, 102, 104, 0.5) 100%)",
    },
    iframe: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
    }
  }

  return (
    <div style={styles.iframeContainer}>
      <iframe src={src} title="Embedded iframe" width={`${width}`} height={`${height}`} frameborder="0" />
    </div>
  );
};

export default IframeEmbed