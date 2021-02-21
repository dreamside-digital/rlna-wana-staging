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


const SessionMaterialsItemEditor = ({ content, onContentChange, classes }) => {

  const handleEditorChange = field => item => {
    onContentChange({
      ...content,
      [field]: item.text ? item.text : item
    });
  }

  return(
    <Card className={`gallery-item mb-4 ${classes}`} variant="outlined" square={true} raised={false} elevation={0}>
      <CardContent className="card-body">
        <div className="image">
          <ImageUploadEditor
            content={content["image"]}
            onContentChange={handleEditorChange("image")}
            uploadImage={uploadImage}
          />
        </div>

        <Grid container>
          <Grid item xs={12}>
            <div className="card-title m-2">
              <h4 className="text-dark mb-0 mt-0">
                <PlainTextEditor
                  content={{ text: content["title"]}}
                  onContentChange={handleEditorChange("title")}
                  placeholder="Title"
                />
              </h4>
            </div>

            <div className="author m-2">
              <PlainTextEditor
                content={{ text: content["author"]}}
                onContentChange={handleEditorChange("author")}
                placeholder="Author"
              />
            </div>

             <div className="details m-2">
              <PlainTextEditor
                content={{text: content["details"]}}
                onContentChange={handleEditorChange("details")}
                placeholder="Details"
              />
            </div>

            <div className="tag m-2">
              <PlainTextEditor
                content={content["tag"]}
                onContentChange={handleEditorChange("tag")}
                placeholder="Item tag, i.e. Blog post"
              />
            </div>

            <div className="link m-2">
              <LinkEditor
                content={content["link"]}
                onContentChange={handleEditorChange("link")}
                editAnchorText={false}
              />
            </div>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

const SessionMaterialsItem = props => {
  const [ isOpen, setIsOpen ] = useState(false)

  const content = props.content || {};

  const handleSave = newContent => {
    props.onSave(newContent)
  }

  const handleClick = (e) => {
    if (!content["link"]) {
      e.preventDefault()
      if (content["image"]) {
        setIsOpen(true)
      }
    }
  }

  return (
    <Editable
      Editor={SessionMaterialsItemEditor}
      handleSave={handleSave}
      content={content}
      {...props}
    >
      <Card
        className={`gallery-item mb-4 display-block ${props.classes}`}
        square={true}
        raised={false}
        elevation={0}
        variant="outlined"
        component="a"
        target="_blank"
        rel="noopener noreferrer"
        href={content["link"] ? content["link"]["link"] : "#"}
        onClick={handleClick}
      >
        <div className="position-relative img-container bg-gradient">
          {
            Boolean(content["image"]) ?
            <CardMedia
              className={"image"}
              image={content["image"]["imageSrc"]}
              title={content["image"]["title"]}
              style={{ height: '250px' }}
            /> :
            <div className="pt-20" />
          }
          <div className={`overlay-gradient ${content["image"] ? '' : 'full-opacity'}`} />
          {
            Boolean(content["tag"]) && (content["tag"].length > 0) &&
            <div className="tag bg-dark text-white position-absolute p-2">
              {content["tag"]}
            </div>
          }
        </div>
        <CardContent className="card-body">
          <Grid container>
            <Grid item xs={12}>
              <div className="card-title">
                <h4 className="text-dark mb-2 mt-2">
                  { content["title"] }
                </h4>
              </div>
            </Grid>

            <Grid item xs={12}>
              <div className="author text-primary mb-2">
                {content["author"]}
              </div>
            </Grid>

            <Grid item xs={12}>
              <div className="details mb-2">
                {content["details"]}
              </div>
            </Grid>

          </Grid>
        </CardContent>
      </Card>
      {isOpen && content["image"] && (
        <Lightbox
          mainSrc={content["image"]["imageSrc"]}
          onCloseRequest={() => setIsOpen(false)}
          imageCaption={content["image"]["caption"]}
          imageTitle={content["image"]["title"]}
        />
      )}
    </Editable>
  );
};

SessionMaterialsItem.defaultProps = {
  content: {
    "details": "",
    "title": "",
    "author": "",
  },
  classes: "",
  onSave: () => { console.log('implement a function to save changes') }
}

export default SessionMaterialsItem;
