import React from "react";
import Button from "@material-ui/core/Button"
import AddIcon from "@material-ui/icons/Add"
import { connect } from "react-redux";
import { DateTime } from "luxon";

import ProgramElementItem from "./ProgramElementItem"

const mapStateToProps = state => {
  return {
    isEditingPage: state.adminTools.isEditingPage,
  };
};


class ProgramElements extends React.Component {

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
    const newItemKey = `program-elements-${Date.now()}`
    newContent[newItemKey] = {
      "program-elements-title": { "text": "Title" },
      "program-elements-start-date": new Date().toISOString(),
      "program-elements-end-date": new Date().toISOString(),
      "program-elements-timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
      "program-elements-link": { "link": "/", "anchor": "Zoom Link" },
      "program-elements-text": { "text": `<p>Description text</p>` },
      "program-elements-image": { "imageSrc": "", "title": "" },
      "program-elements-video": { "text": "" }
    }

    this.props.onSave(newContent)
  }

  render() {
    // show lastest item first
    let itemsKeys = Object.keys(this.props.content).reverse()
    const subject = encodeURIComponent('Session proposal')
    const body = encodeURIComponent('Please provide following information to propose a session. \n\nSession title: \nSession description: \nProposed date and time: \nAny other comments?\n')

    return (
      <div className={`collection width-100 mt-2 ${this.props.classes}`}>
        <a href={`mailto:wana@bmw-foundation.org?subject=${subject}&body=${body}`} className="add-item-btn">
          <div className="icon-btn">
            <AddIcon />
          </div>
          <span className="pretty-link">Host a session</span>
        </a>
        {
          this.props.isEditingPage &&
          <div className="row mt-6 mb-4">
            <div className="col-12">
              <Button onClick={this.onAddItem} color="default" variant="contained">Add event</Button>
            </div>
          </div>
        }
        {itemsKeys.filter(k => this.props.content[k]).map((key,index) => {
          const content = {
            ...this.props.content[key],
            'program-elements-start-date': DateTime.fromISO(this.props.content[key]['program-elements-start-date']),
            'program-elements-end-date': DateTime.fromISO(this.props.content[key]['program-elements-end-date'])
          };
          return(
            <ProgramElementItem
              index={index}
              content={content}
              onSave={this.onSaveItem(key)}
              onDelete={this.onDeleteItem(key)}
              key={key}
            />
          )
        })}
      </div>
    );
  }
}

ProgramElements.defaultProps = {
  content: {},
  classes: "",
  onSave: () => { console.log('Implement a function to save changes') }
}

export default connect(mapStateToProps)(ProgramElements)

