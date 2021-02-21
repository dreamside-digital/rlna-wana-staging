import React from "react";
import Button from "@material-ui/core/Button"
import AddIcon from "@material-ui/icons/Add"
import { connect } from "react-redux";
import { DateTime } from "luxon";
import { fetchEvents } from "../../redux/actions"

import ProgramElementItem from "./ProgramElementItem"

const mapStateToProps = state => {
  return {
    isEditingPage: state.adminTools.isEditingPage,
    events: state.events.events
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchEvents: () => {
      dispatch(fetchEvents());
    },
  };
};

class ProgramElements extends React.Component {
  constructor(props) {
    super(props)
    this.props.fetchProfiles()
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
    const newItemKey = `event-${Date.now()}`
    newContent[newItemKey] = {
      "title": { "text": "Title" },
      "startDate": new Date().toISOString(),
      "endDate": new Date().toISOString(),
      "timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
      "link": { "link": "/", "anchor": "Zoom Link" },
      "description": { "text": `<p>Description text</p>` },
      "image": { "imageSrc": "https://firebasestorage.googleapis.com/v0/b/rlna-wana-staging.appspot.com/o/images%2Fcactus.jpg?alt=media&token=2f0c0c6e-3595-44b0-9de7-c29de88fab81", "title": "" },
      "video": { "text": "" },
      "host": { "text": "" },
    }

    this.props.onSave(newContent)
  }

  render() {
    // show lastest item first
    let itemsKeys = Object.keys(this.props.events).reverse()
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
            'start-date': DateTime.fromISO(this.props.content[key]['start-date']),
            'end-date': DateTime.fromISO(this.props.content[key]['end-date'])
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

