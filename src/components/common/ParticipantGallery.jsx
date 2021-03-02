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

const ITEM_NUMBER = 12

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
      itemsToShow: ITEM_NUMBER,
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
    const { showModal, editingParticipant, itemsToShow } = this.state;
    const { profiles } = this.props;
    const profileIds = Object.keys(profiles)
    const profilesArr = profileIds.map(id => profiles[id])
    const orderedProfiles = profilesArr.sort((a,b) => a.name.localeCompare(b.name))
    const profilesToShow = orderedProfiles.slice(0, itemsToShow)
    const totalItems = Object.keys(profiles).length

    return (
      <div className={`collection width-100 mt-2 ${this.props.classes}`}>
        <button onClick={() => this.setState({ showModal: true })} className="add-item-btn">
          <div className="icon-btn">
            <AddIcon />
          </div>
          <span className="pretty-link">Add your profile</span>
        </button>
        <Grid container className="position-relative mt-6">
          {profilesToShow.map((profile,index) => {
            return (
              <Grid item xs={6} sm={4} md={3} lg={2} key={profile.id} style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', }}>
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
                  <ParticipantGalleryItem content={profile} id={profile.id} />
                }
              </Grid>
            )
          })}
        </Grid>
        {
          itemsToShow < totalItems &&
          <Grid container justify="center" className="mt-6">
            <Grid item>
              <Button
                variant="outlined"
                color="primary"
                className="btn"
                onClick={() => this.setState({ itemsToShow: this.state.itemsToShow + ITEM_NUMBER })}>
                Load more
              </Button>
            </Grid>
          </Grid>
        }

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

