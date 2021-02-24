import React from "react";
import Button from "@material-ui/core/Button"
import AddIcon from "@material-ui/icons/Add"
import { connect } from "react-redux";
import { DateTime } from "luxon";
import { Link } from "gatsby";
import { fetchEvents } from "../../redux/actions"
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";
import {EditablesContext, EditorWrapper, theme} from "react-easy-editables";

import ProgramElementItem from "./ProgramElementItem"
import ProgramElementModal from "./ProgramElementModal"

const muiTheme = createMuiTheme({
  palette: {
    primary: {
      main: theme.primaryColor,
    }
  },
  typography: {
    fontFamily: theme.fontFamily,
    fontSize: theme.fontSize
  }
})


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
    this.state = {
      showModal: false,
      editingEvent: null,
    }
    this.props.fetchEvents()
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

  render() {
    // show lastest item first
    const { showModal, editingEvent } = this.state;
    let itemsKeys = Object.keys(this.props.events).reverse()
    const eventsArr = itemsKeys.map(key => {
      const event = this.props.events[key]
      return {
        ...event,
        startDate: DateTime.fromISO(event.startDate),
        endDate: DateTime.fromISO(event.endDate)
      }
    })
    const orderedEvents = eventsArr.sort((a,b) => a.startDate - b.startDate).filter(e => e.endDate > DateTime.local())

    return (
      <div className={`collection width-100 mt-2 ${this.props.classes}`}>
        <Link to="/session-proposal" className="add-item-btn">
          <div className="icon-btn">
            <AddIcon />
          </div>
          <span className="pretty-link">Host a session</span>
        </Link>
        {
          this.props.isEditingPage &&
          <div className="row mt-6 mb-4">
            <div className="col-12">
              <Button onClick={() => this.setState({ showModal: true })} color="default" variant="contained">Add event</Button>
            </div>
          </div>
        }
        {orderedEvents.map((content,index) => {
          if (this.props.isEditingPage) {
            return (
              <ThemeProvider theme={muiTheme} key={content.id}>
                <EditorWrapper
                  theme={this.context.theme}
                  startEditing={() => this.setState({ showModal: true, editingEvent: content })}
                >
                  <ProgramElementItem content={content} id={content.id} />
                </EditorWrapper>
              </ThemeProvider>
            )
          }
          return(
            <ProgramElementItem
              key={content.id}
              index={index}
              content={content}
            />
          )
        })}
        {
          this.props.isEditingPage &&
          <ProgramElementModal
            event={editingEvent}
            showModal={showModal}
            closeModal={() => this.setState({ showModal: false, editingEvent: null })}
          />
        }
      </div>
    );
  }
}

ProgramElements.contextType = EditablesContext;

ProgramElements.defaultProps = {
  content: {},
  classes: "",
  onSave: () => { console.log('Implement a function to save changes') }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProgramElements)

