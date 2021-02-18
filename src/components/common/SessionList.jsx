import React from "react";
import Button from "@material-ui/core/Button"
import AddIcon from "@material-ui/icons/Add"
import { connect } from "react-redux";

import SessionItem from "./SessionItem"
// import SessionModal from "./SessionModal";
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";
import {EditablesContext, EditorWrapper, theme} from "react-easy-editables";
import Grid from "@material-ui/core/Grid";
import { fetchSessions } from "../../redux/actions"

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

const mapDispatchToProps = dispatch => {
  return {
    fetchSessions: () => {
      dispatch(fetchSessions());
    },
  };
};

const mapStateToProps = state => {
  return {
    isEditingPage: state.adminTools.isEditingPage,
    sessions: state.sessions.sessions
  };
};

class ParticipantGallery extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      editingParticipant: null,
    }
    this.props.fetchSessions()
  }

  onSaveItem = itemId => itemContent => {
    const newContent = {
      ...this.props.profile,
      [itemId]: itemContent
    }

    this.props.onSave(newContent)
  }

  onDeleteItem = itemId => () => {
    let newContent = { ...this.props.profile }
    newContent[itemId] = null

    this.props.onSave(newContent)
  }

  render() {
    const { showModal, editingParticipant } = this.state;
    const { sessions } = this.props;

    return (
      <div className={`collection width-100 mt-2 ${this.props.classes}`}>
        <Grid container className="position-relative">
          <Grid item xs={12}>
            <a href="mailto:" className="add-item-btn">
              <div className="icon-btn">
                <AddIcon />
              </div>
              <span className="pretty-link">Host a session</span>
            </a>
          </Grid>

        {Object.keys(sessions).map((key,index) => {
          const profile = sessions[key]
          if (!profile.approved) {
            return null
          }

          return (
              <Grid item xs={6} sm={4} md={3} lg={2} key={profile.id} style={{ display: 'flex', justifyContent: 'center' }}>
                {
                  this.props.isEditingPage &&
                  <ThemeProvider theme={muiTheme}>
                    <EditorWrapper
                      theme={this.context.theme}
                      startEditing={() => this.setState({ showModal: true, editingParticipant: profile })}
                    >
                      <SessionItem content={profile} id={profile.id} />
                    </EditorWrapper>
                  </ThemeProvider>
                }
                {
                  !this.props.isEditingPage &&
                  <SessionItem content={profile} />
                }
              </Grid>
            )
          })}
        </Grid>


      </div>
    );
  }
}

ParticipantGallery.contextType = EditablesContext;


ParticipantGallery.defaultProps = {
  content: {},
  classes: "",
  onSave: () => { console.log('Implement a function to save changes') }
}

export default connect(mapStateToProps, mapDispatchToProps)(ParticipantGallery)

