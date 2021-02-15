import React from "react";
import Button from "@material-ui/core/Button"
import { connect } from "react-redux";

import ParticipantGalleryItem from "./ParticipantGalleryItem"
import ParticipantModal from "./ParticipantModal";
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";
import {EditablesContext, EditorWrapper, theme} from "react-easy-editables";
import Grid from "@material-ui/core/Grid";

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
  };
};


class ParticipantGallery extends React.Component {
  state = {
    showModal: false,
    editingParticipant: null,
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
    const { showModal, editingParticipant } = this.state;
    let itemsKeys = Object.keys(this.props.content)

    return (
      <div className={`collection width-100 mt-6 ${this.props.classes}`}>
        {
          this.props.isEditingPage &&
          <div className="row mb-4">
            <div className="col-12">
              <Button onClick={() => this.setState({ showModal: true })} color="default" variant="contained">Add participant</Button>
            </div>
          </div>
        }
        <Grid container className="position-relative">
        {itemsKeys.filter(k => this.props.content[k]).map((key,index) => {
            const content = this.props.content[key];

            return (
                <Grid item xs={6} sm={4} md={3} lg={2} key={key} style={{ display: 'flex', justifyContent: 'center' }}>
                  {
                    this.props.isEditingPage &&
                    <ThemeProvider theme={muiTheme}>
                      <EditorWrapper
                        theme={this.context.theme}
                        startEditing={() => this.setState({ showModal: true, editingParticipant: content })}
                      >
                        <ParticipantGalleryItem content={content} />
                      </EditorWrapper>
                    </ThemeProvider>
                  }
                  {
                    !this.props.isEditingPage &&
                    <ParticipantGalleryItem content={content} />
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

export default connect(mapStateToProps)(ParticipantGallery)

