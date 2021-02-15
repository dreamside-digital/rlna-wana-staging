import React from "react";
import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"

import Resource from "./Resource"


class Resources extends React.Component {
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
    const newItemKey = `resource-${Date.now()}`
    newContent[newItemKey] = {
      "resource-item-author": { "text": "Author" },
      "resource-item-title": { "text": "Title" },
      "resource-item-description": { "text": "<p>Summary</p>" },
      "resource-item-link": { "link": "/" },
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
            <Grid item xs={12} sm={6} md={4} key={`resources-item-${key}`}>
              <Resource
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

Resources.defaultProps = {
  content: {},
  classes: "",
  onSave: () => { console.log('Implement a function to save changes') }
}

export default Resources

