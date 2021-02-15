import React from "react";
import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"

import Podcast from "./Podcast"


class Podcasts extends React.Component {
  onSaveItem = itemId => itemContent => {
    const newContent = {
      ...this.props.content,
      [itemId]: itemContent
    }

    this.props.onSave(newContent)
  }

  onDeleteItem = itemId => () => {
    let newContent = { ...this.props.content }
    delete newContent[itemId];

    this.props.onSave(newContent)
  }

  onAddItem = () => {
    let newContent = { ...this.props.content }
    const newItemKey = `podcast-${Date.now()}`
    newContent[newItemKey] = {
      "podcast-item-author": { "text": "Author" },
      "podcast-item-title": { "text": "Title" },
      "podcast-item-description": { "text": "<p>Episode summary</p>" },
      "podcast-item-published-date": { "text": "yyyy-mm-dd" },
      "podcast-item-length": { "text": "15 minutes" },
      "podcast-item-link": { "link": "/" },
      "podcast-item-image": { "imageSrc": "", "caption": "" },
    }

    this.props.onSave(newContent)
  }

  render() {
    const itemsKeys = Object.keys(this.props.content);

    return (
      <div className={`collection ${this.props.classes}`}>
        <Grid container spacing={2}>
        {itemsKeys.map((key,index) => {
          const content = this.props.content[key];
          return(
            <Grid item xs={12} key={`podcasts-item-${key}`}>
              <Podcast
                index={index}
                content={content}
                onSave={this.onSaveItem(key)}
                onDelete={this.onDeleteItem(key)}
              />
            </Grid>
          )
        })}
        {
          this.props.isEditingPage &&
          <div className="row mt-4">
            <div className="col-12">
              <Button onClick={this.onAddItem}>Add item</Button>
            </div>
          </div>
        }
        </Grid>
      </div>
    );
  }
}

Podcasts.defaultProps = {
  content: {},
  classes: "",
  onSave: () => { console.log('Implement a function to save changes') }
}

export default Podcasts

