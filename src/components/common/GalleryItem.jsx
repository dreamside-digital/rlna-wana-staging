import React, { useState } from "react";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Lightbox from "react-image-lightbox"

import 'react-image-lightbox/style.css';

import {
  PlainTextEditor,
  ImageUploadEditor,
  LinkEditor,
  Editable
} from 'react-easy-editables';

import { uploadImage } from "../../firebase/operations"


const GalleryItemEditor = ({ content, onContentChange, classes }) => {

  const handleEditorChange = field => item => {
    onContentChange({
      ...content,
      [field]: {
        ...item
      }
    });
  }

  return(
    <Card className={`gallery-item mb-4 ${classes}`} variant="outlined" square={true} raised={false} elevation={0}>
      <CardContent className="card-body">
        <div className="image">
          <ImageUploadEditor
            content={content["gallery-item-image"]}
            onContentChange={handleEditorChange("gallery-item-image")}
            uploadImage={uploadImage}
          />
        </div>

        <Grid container justify="space-between">
          <Grid item xs={6}>
            <div className="author m-2">
              <PlainTextEditor
                content={content["gallery-item-author"]}
                onContentChange={handleEditorChange("gallery-item-author")}
              />
            </div>
          </Grid>

          <Grid item xs={6}>
            <div className="details m-2">
              <PlainTextEditor
                content={content["gallery-item-details"]}
                onContentChange={handleEditorChange("gallery-item-details")}
              />
            </div>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={12}>
            <div className="card-title m-2">
              <h4 className="text-dark mb-0 mt-0">
                <PlainTextEditor
                  content={content["gallery-item-title"]}
                  onContentChange={handleEditorChange("gallery-item-title")}
                />
              </h4>
            </div>

            <div className="tag m-2">
              <PlainTextEditor
                content={content["gallery-item-tag"]}
                onContentChange={handleEditorChange("gallery-item-tag")}
                placeholder="Item tag, i.e. Blog post"
              />
            </div>

            <div className="link m-2">
              <LinkEditor
                content={content["gallery-item-link"]}
                onContentChange={handleEditorChange("gallery-item-link")}
                editAnchorText={false}
              />
            </div>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

const GalleryItem = props => {
  const [ isOpen, setIsOpen ] = useState(false)

  const content = props.content || {};

  const handleSave = newContent => {
    props.onSave(newContent)
  }

  const handleClick = (e) => {
    if (!content["gallery-item-link"]) {
      e.preventDefault()
      if (content["gallery-item-image"]) {
        setIsOpen(true)
      }
    }
  }

  return (
    <Editable
      Editor={GalleryItemEditor}
      handleSave={handleSave}
      content={content}
      {...props}
    >
      <Card
        className={`gallery-item mb-4 display-block ${props.classes}`}
        square={true}
        raised={false}
        elevation={0}
        component="a"
        target="_blank"
        rel="noopener noreferrer"
        href={content["gallery-item-link"] ? content["gallery-item-link"]["link"] : "#"}
        onClick={handleClick}
      >
        <div className="position-relative img-container bg-gradient">
          {
            Boolean(content["gallery-item-image"]) ?
            <CardMedia
              className={"gallery-item-image"}
              image={content["gallery-item-image"]["imageSrc"]}
              title={content["gallery-item-image"]["title"]}
              style={{ height: '250px' }}
            /> :
            <div className="pt-20" />
          }
          <div className={`overlay-gradient ${content["gallery-item-image"] ? '' : 'full-opacity'}`} />
          {
            Boolean(content["gallery-item-tag"]) && (content["gallery-item-tag"]["text"].length > 0) &&
            <div className="tag bg-dark text-white position-absolute p-2">
              {content["gallery-item-tag"]["text"]}
            </div>
          }
        </div>
        <CardContent className="card-body">

          <Grid container justify="space-between">
            <Grid item xs={8}>
              <div className="author">
                {content["gallery-item-author"]["text"]}
              </div>
            </Grid>

            <Grid item xs={4}>
              <div className="details text-primary">
                {content["gallery-item-details"]["text"]}
              </div>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={12}>
              <div className="card-title">
                <h4 className="text-dark mt-2 mb-0">
                  { content["gallery-item-title"]["text"] }
                </h4>
              </div>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {isOpen && content["gallery-item-image"] && (
        <Lightbox
          mainSrc={content["gallery-item-image"]["imageSrc"]}
          onCloseRequest={() => setIsOpen(false)}
          imageCaption={content["gallery-item-image"]["caption"]}
          imageTitle={content["gallery-item-image"]["title"]}
        />
      )}
    </Editable>
  );
};

GalleryItem.defaultProps = {
  content: {
    "gallery-item-details": { "text": "Open Space Week, October 15, 2020" },
    "gallery-item-title": { "text": "Title" },
    "gallery-item-author": { "text": "Author" },
  },
  classes: "",
  onSave: () => { console.log('implement a function to save changes') }
}

export default GalleryItem;
