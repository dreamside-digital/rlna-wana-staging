import React from "react";
import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"
import { connect } from "react-redux";

import GalleryItem from "./GalleryItem"
import BreakpointMasonry from "./BreakpointMasonry"

const ITEM_NUMBER = 6

const mapStateToProps = state => {
  return {
    isEditingPage: state.adminTools.isEditingPage,
  };
};


class Gallery extends React.Component {
  state = {
    totalItems: Object.keys(this.props.content).length,
    itemsToShow: ITEM_NUMBER
  }

  onSaveItem = itemId => itemContent => {
    const newContent = {
      ...this.props.content,
      [itemId]: itemContent
    }

    this.props.onSave(newContent)
  }

  onDeleteItem = itemId => () => {
    let newContent = { ...this.props.content }
    newContent[itemId] = null

    this.props.onSave(newContent)
  }

  onAddItem = () => {
    let newContent = { ...this.props.content }
    const newItemKey = `gallery-${Date.now()}`
    newContent[newItemKey] = {
      "gallery-item-details": { "text": "Open Space Week" },
      "gallery-item-title": { "text": "Title" },
      "gallery-item-author": { "text": "Author" },
    }

    this.props.onSave(newContent)
  }

  render() {
    let itemsKeys = Object.keys(this.props.content).reverse().slice(0, this.state.itemsToShow)

    return (
      <div className={`collection width-100 mt-6 ${this.props.classes}`}>
        {
          this.props.isEditingPage &&
          <div className="row mb-4">
            <div className="col-12">
              <Button onClick={this.onAddItem} color="default" variant="contained">Add item</Button>
            </div>
          </div>
        }
        <BreakpointMasonry>
          {itemsKeys.filter(k => this.props.content[k]).map((key,index) => {
            const content = this.props.content[key];
            return(
              <GalleryItem
                index={index}
                content={content}
                onSave={this.onSaveItem(key)}
                onDelete={this.onDeleteItem(key)}
                key={key}
              />
            )
          })}
        </BreakpointMasonry>
        {
          this.state.itemsToShow < this.state.totalItems &&
          <Grid container justify="center" className="mt-6">
            <Grid item>
              <Button
                className="btn"
                variant="outlined"
                color="primary"
                onClick={() => this.setState({ itemsToShow: this.state.itemsToShow + ITEM_NUMBER })}>
                Load more
              </Button>
            </Grid>
          </Grid>
        }
      </div>
    );
  }
}

Gallery.defaultProps = {
  content: {},
  classes: "",
  onSave: () => { console.log('Implement a function to save changes') }
}

export default connect(mapStateToProps)(Gallery)

