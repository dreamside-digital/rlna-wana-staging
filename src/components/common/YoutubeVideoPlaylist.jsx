import React, { Component } from "react";
import axios from "axios";
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import PlayIcon from "@material-ui/icons/PlayCircleFilled";
import Slider from "react-slick"
import Authors from "./Authors"
import {
  PlainTextEditor,
  RichTextEditor,
  Editable
} from 'react-easy-editables';


import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const YOUTUBE_API_ENDPOINT = "https://www.googleapis.com/youtube/v3/playlistItems";


const VideoThumbnail = ({ video, onClickVideo, nowPlaying }) => {
  return (
    <div className="video-slide">
      <div className="pos-relative video-thumbmail">
        <div className="play-button">
          <IconButton onClick={onClickVideo} aria-label="play video"><PlayIcon /></IconButton>
        </div>
        {video.snippet.thumbnails && <img className="img-fluid" src={video.snippet.thumbnails.medium.url} alt={`Video thumbnail for "${video.snippet.title}"`} />}
      </div>
      <h5 className="">
        {nowPlaying && <span style={{ color: "#E57A68" }}>{`▶ `}</span>}
        {video.snippet.title}
      </h5>
    </div>
  )
}

const VideoDescription = ({ video, videoTitle, transcript={} }) => {
  return(
    <div className="video-description">
      <h4 className="video-title underline">{videoTitle}</h4>
      <div className="transcript" dangerouslySetInnerHTML={ {__html: transcript["text"]} } />
    </div>
  )
}


class YoutubeVideoPlaylistEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: this.props.content,
      videos: [],
      videoId: null,
      videoTitle: "",
    };
  }

  handleEditorChange = field => item => {
    this.setState({
      content: {
        ...this.state.content,
        [field]: {
          ...item
        }
      }
    });
  }

  componentDidMount() {
    this.populateVideos()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.content !== this.state.content) {
      this.populateVideos()
    }
  }

  populateVideos = () => {
    const content = this.state.content || {};
    const playlistUrl = content["playlist"] ? content["playlist"]["text"] : "https://www.youtube.com/playlist?list=";
    const playlistId = playlistUrl.split("https://www.youtube.com/playlist?list=")[1]
    const url = `${YOUTUBE_API_ENDPOINT}?key=${process.env.GATSBY_YOUTUBE_API_KEY}&part=snippet&playlistId=${playlistId}&maxResults=50`;
    const method = "GET";

    axios({
      url,
      method
    })
    .then(res => {
      this.setState({ videos: res.data.items })
    })
    .catch(err => {
      console.log(err);
    });
  }

  render() {
    const { content, videos, videoId, videoTitle } = this.state;
    const settings = {
      infinite: true,
      speed: 500,
      draggable: true,
      slidesToShow: videos.length < 5 ? videos.length : 5,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 960,
          settings: {
            slidesToShow: videos.length < 4 ? videos.length : 4,
            slidesToScroll: 1,
            swipe: true,
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: videos.length < 3 ? videos.length : 3,
            slidesToScroll: 1,
            swipe: true,
          }
        },
      ]
    };

    return(
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <div className={`playlist-editor ${this.props.classes}`}>
              <label htmlFor="playlist-field">YouTube playlist URL:</label>
              <PlainTextEditor
                EditorProps={{id: "playlist-field"}}
                content={content["playlist"]}
                handleEditorChange={this.handleEditorChange("playlist")}
              />
            </div>
          </Grid>
          <Grid item xs={12}>
            <Slider { ...settings }>
              {
                videos.map(video => {
                  return (
                    <VideoThumbnail
                      video={video}
                      key={video.id}
                      nowPlaying={video.snippet.resourceId.videoId === videoId}
                      onClickVideo={() => this.setState({ videoId: video.snippet.resourceId.videoId, videoTitle: video.snippet.title }) }
                    />
                  )
                })
              }
            </Slider>
          </Grid>
        </Grid>
        {
          this.state.videoId &&
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Authors
                content={content[`authors-${videoId}`]}
                onSave={this.handleEditorChange(`authors-${this.state.videoId}`)}
                isEditingPage={true}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <div className="video-description">
                <h4 className="video-title underline">{videoTitle}</h4>
                <div className={`playlist-editor ${this.props.classes}`}>
                  <label htmlFor="transcript-field">Video transcript:</label>
                  <RichTextEditor
                    EditorProps={{id: "transcript-field"}}
                    content={content[`transcript-${this.state.videoId}`]}
                    handleEditorChange={this.handleEditorChange(`transcript-${this.state.videoId}`)}
                  />
                </div>
              </div>
            </Grid>
          </Grid>
        }
      </div>
    )
  }
}

class YoutubeVideoPlaylist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videos: [],
      videoId: ""
    };
  }

  componentDidMount() {
    this.populateVideos()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.content !== this.props.content) {
      this.populateVideos()
    }
  }

  populateVideos = () => {
    const content = this.props.content || {};
    const playlistUrl = content["playlist"] ? content["playlist"]["text"] : "https://www.youtube.com/playlist?list=";
    const playlistId = playlistUrl.split("https://www.youtube.com/playlist?list=")[1]
    const url = `${YOUTUBE_API_ENDPOINT}?key=${process.env.GATSBY_YOUTUBE_API_KEY}&part=snippet&playlistId=${playlistId}&maxResults=50`;
    const method = "GET";

    axios({
      url,
      method
    })
    .then(res => {
      this.setState({ videos: res.data.items })
    })
    .catch(err => {
      console.log(err);
    });
  }

  handleSave = newContent => {
    this.props.onSave(newContent)
  }

  render() {
    const { videos, videoId, videoTitle } = this.state;
    const content = this.props.content || {};
    const playlistUrl = content["playlist"] ? content["playlist"]["text"] : "https://www.youtube.com/playlist?list=";
    const playlistId = playlistUrl.split("https://www.youtube.com/playlist?list=")[1]
    const embedSrc = videoId ? `https://www.youtube.com/embed/${videoId}` : `https://www.youtube.com/embed/videoseries?list=${playlistId}`
    const videoAuthors = content[`authors-${videoId}`]
    const videoAuthorsKeys = videoAuthors ? Object.keys(content[`authors-${videoId}`]) : []
    const settings = {
      infinite: true,
      speed: 500,
      draggable: true,
      slidesToShow: videos.length < 5 ? videos.length : 5,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 960,
          settings: {
            slidesToShow: videos.length < 4 ? videos.length : 4,
            slidesToScroll: 1,
            swipe: true,
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: videos.length < 3 ? videos.length : 3,
            slidesToScroll: 1,
            swipe: true,
          }
        },
      ]
    };

    return (
      <Editable
        Editor={YoutubeVideoPlaylistEditor}
        handleSave={this.handleSave}
        content={content}
        {...this.props}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <div className="embed-container">
              <iframe title={videoTitle} src={embedSrc} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
          </Grid>
          <Grid item xs={12}>
            <Slider { ...settings }>
              {
                videos.map(video => {
                  return (
                    <VideoThumbnail
                      video={video}
                      key={video.id}
                      nowPlaying={video.snippet.resourceId.videoId === videoId}
                      onClickVideo={() => this.setState({ videoId: video.snippet.resourceId.videoId, videoTitle: video.snippet.title }) }
                    />
                  )
                })
              }
            </Slider>
          </Grid>
        </Grid>
        { videoId &&
          <Grid container spacing={2}>
            {
              videoAuthors &&
                <Grid item xs={12} md={4}>
                {videoAuthorsKeys.map((key,index) => {
                  if (videoAuthorsKeys.length > 1) {
                    const authorContent = videoAuthors[key];
                    return(
                      <div className="video-author mini" key={key}>
                        <div className="image-rounded">
                          <img src={authorContent[`author-item-image`]["imageSrc"]} alt={authorContent[`author-item-name`]["text"]} />
                        </div>
                        <h4>
                          {authorContent[`author-item-name`]["text"]}
                        </h4>
                      </div>
                    )
                  }

                  const authorContent = videoAuthors[key];
                  return(
                    <div className="video-author" key={key}>
                      <div className="image-rounded">
                        <img src={authorContent[`author-item-image`]["imageSrc"]} alt={authorContent[`author-item-name`]["text"]} />
                      </div>
                      <h4>
                        {authorContent[`author-item-name`]["text"]}
                      </h4>
                      <p>{authorContent[`author-item-bio`]["text"]}</p>
                    </div>
                  )
                })}
              </Grid>
            }
            <Grid item xs={12} md={8}>
              <VideoDescription videoTitle={videoTitle} videoId={videoId} transcript={content[`transcript-${videoId}`]} />
            </Grid>
          </Grid>
        }
      </Editable>
    );
  }
}

export default YoutubeVideoPlaylist
