import React from "react"

const parseUrl = url => {
  if (url.indexOf('youtube') >= 0) {
    const [match, id] = /youtube\.com\/watch\?v=(.*)/gm.exec(url)
    return { id, platform: 'youtube' }
  } else if (url.indexOf('vimeo') >= 0) {
    const [match, id] = /vimeo\.com\/(.*)/gm.exec(url)
    return { id, platform: 'vimeo' }
  } else {
    return {}
  }
}

const VideoEmbed = ({ url }) => {
  if (!url) return null

  const { id, platform } = parseUrl(url)

  if (!id) return null

  const styles = {
    iframeContainer: {
      position: "relative",
      paddingBottom: platform === 'vimeo' ? '43%' : '56%',
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

  const embedUrl = platform === 'vimeo' ? `https://player.vimeo.com/video/${id}` : `https://www.youtube.com/embed/${id}`

  return (
    <div style={styles.iframeContainer}>
      <iframe style={styles.iframe} title="Embedded video" src={embedUrl} width="640" height="268" frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen></iframe>
    </div>
  );
};

export default VideoEmbed