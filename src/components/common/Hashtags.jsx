import React from "react";
import Button from "@material-ui/core/Button"
import { connect } from "react-redux";
import { EditableText } from "react-easy-editables"


const mapStateToProps = state => {
  return {
    isEditingPage: state.adminTools.isEditingPage,
  };
};


class Hashtags extends React.Component {
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
    const newItemKey = `hashtag-${Date.now()}`
    newContent[newItemKey] = { "text": "#" }

    this.props.onSave(newContent)
  }

  render() {
    let itemsKeys = Object.keys(this.props.content)

    return (
      <div className={`hashtags font-size-h4 ${this.props.classes}`}>
        {
          this.props.isEditingPage &&
          <div className="row mb-4">
            <div className="col-12">
              <Button onClick={this.onAddItem} color="default" variant="contained">Add item</Button>
            </div>
          </div>
        }
        <div className="display-inline-flex flex-column">
          {itemsKeys.filter(k => this.props.content[k]).map((key,index) => {
            const content = this.props.content[key];
            return(
              <div key={key}>
                <EditableText
                  content={content}
                  onSave={this.onSaveItem(key)}
                  onDelete={this.onDeleteItem(key)}
                />
              </div>
            )
          })}
        </div>
      </div>
    );
  }
}

Hashtags.defaultProps = {
  content: {},
  classes: "",
  onSave: () => { console.log('Implement a function to save changes') }
}

export default connect(mapStateToProps)(Hashtags)

