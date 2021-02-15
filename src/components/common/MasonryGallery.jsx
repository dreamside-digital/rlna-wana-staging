import React from "react";
import Slider from "react-slick"
import Masonry from 'react-masonry-component'

import Button from "@material-ui/core/Button"


class EditableGallery extends React.Component {

  onSaveItem = itemId => item => {
    const newCollection = {
      ...this.props.collection,
      [itemId]: item
    }

    this.props.onSave(newCollection)
  }

  onDeleteItem = itemId => () => {
    this.props.onDeleteItem(itemId)
  }

  onAddItem = () => {
    this.props.onAddItem(this.props.defaultContent)
  }


  render() {
    const { collection, GalleryComponent, isEditingPage, options } = this.props;
    const collectionLength = Object.keys(collection).length;
    const collectionKeys = Object.keys(collection);

    if (!isEditingPage && (collectionLength < 1)) {
      return <p>Coming soon!</p>
    }

    if (isEditingPage) {
      return(
        <div>
          <div className="row">
            {collectionKeys.map(key => {
              const content = collection[key];
              return(
                <div className="col-lg-4 mb-4">
                  <GalleryComponent
                    key={`slide-${key}`}
                    content={content}
                    onSave={this.onSaveItem(key)}
                    onDelete={this.onDeleteItem(key)}
                  />
                </div>
              )
            })}
          </div>
          <div className="row mt-4">
            <div className="col-12">
              <Button onClick={this.onAddItem} color="default" variant="contained">Add item</Button>
            </div>
          </div>
        </div>
      )
    }

    return (
      <Masonry className="masonry-gallery row">
        {collectionKeys.map(key => {
          const content = collection[key];
          return(
            <div className="col-lg-4 mb-4" key={`slide-${key}`}>
              <GalleryComponent
                content={content}
                onSave={this.onSaveItem(key)}
                onDelete={this.onDeleteItem(key)}
              />
            </div>
          )
        })}
      </Masonry>
    );
  }
}


EditableGallery.defaultProps = {
  collection: {},
  isEditingPage: false,
  options: {}
}

export default EditableGallery;


