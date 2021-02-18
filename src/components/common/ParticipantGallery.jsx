import React from "react";
import Button from "@material-ui/core/Button"
import AddIcon from "@material-ui/icons/Add"
import { connect } from "react-redux";

import ParticipantGalleryItem from "./ParticipantGalleryItem"
import ParticipantModal from "./ParticipantModal";
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";
import {EditablesContext, EditorWrapper, theme} from "react-easy-editables";
import Grid from "@material-ui/core/Grid";
import { fetchProfiles } from "../../redux/actions"

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
    fetchProfiles: () => {
      dispatch(fetchProfiles());
    },
  };
};

const mapStateToProps = state => {
  return {
    isEditingPage: state.adminTools.isEditingPage,
    profiles: state.profiles.profiles
  };
};

class ParticipantGallery extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      editingParticipant: null,
    }
    this.props.fetchProfiles()
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
    const { profiles } = this.props;

    return (
      <div className={`collection width-100 mt-2 ${this.props.classes}`}>
        <button onClick={() => this.setState({ showModal: true })} className="add-item-btn">
          <div className="icon-btn">
            <AddIcon />
          </div>
          <span className="pretty-link">Add your profile</span>
        </button>
        <Grid container className="position-relative mt-6">
        {Object.keys(profiles).map((key,index) => {
          const profile = profiles[key]

          return (
              <Grid item xs={6} sm={4} md={3} lg={2} key={profile.id} style={{ display: 'flex', justifyContent: 'center' }}>
                {
                  this.props.isEditingPage &&
                  <ThemeProvider theme={muiTheme}>
                    <EditorWrapper
                      theme={this.context.theme}
                      startEditing={() => this.setState({ showModal: true, editingParticipant: profile })}
                    >
                      <ParticipantGalleryItem content={profile} id={profile.id} />
                    </EditorWrapper>
                  </ThemeProvider>
                }
                {
                  !this.props.isEditingPage &&
                  <ParticipantGalleryItem content={profile} />
                }
              </Grid>
            )
          })}
        </Grid>

        <ParticipantModal
          participant={editingParticipant}
          onSaveItem={this.onSaveItem}
          showModal={showModal}
          closeModal={() => this.setState({ showModal: false, editingParticipant: null })}
          onDeleteItem={this.onDeleteItem}
        />
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

