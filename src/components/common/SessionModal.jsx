import React from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button"
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import ImageUpload from '../editing/ImageUpload';
import {uploadImage} from "../../firebase/operations";
import { saveSession, removeSession } from "../../redux/actions"

const mapDispatchToProps = dispatch => {
  return {
    saveSession: (id, data) => {
      dispatch(saveSession(id, data));
    },
    removeSession: (id) => {
      dispatch(removeSession(id));
    },
  };
};

const emptySession = {
    image: "",
    title: { "text": "Title" },
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    link: { "link": "/", "anchor": "Zoom Link" },
    description: { "text": `<p>Description text</p>` },

  }

class SessionModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { newSession: props.session || emptySession }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.session !== this.props.session && !Boolean(this.props.session)) {
      this.setState({ newSession: emptySession })
    }

    if (prevProps.session !== this.props.session && this.props.session?.id) {
      this.setState({ newSession: this.props.session })
    }
  }

  handleChange = key => event => {
    const value = event.currentTarget.value
    this.setState({ newSession: {...this.state.newSession, [key]: value} })
  }

  handleImageChange = key => image => {
    this.setState({ newSession: {...this.state.newSession, [key]: image} })
  }

  handleDescChange = key => desc => {
    this.setState({ newSession: {...this.state.newSession, [key]: desc.text} })
  }

  handleSaveSession = () => {
    const { newSession } = this.state;

    const id = newSession.id ? newSession.id : `session-${Date.now()}`

    const data = {
      ...newSession,
      id
    }

    this.props.saveProfile(id, data)
    this.props.closeModal()
    this.setState({ newSession: emptySession })
  }

  handleDeleteParticipant = () => {
    this.props.removeProfile(this.state.newSession.id)
    this.props.closeModal()
    this.setState({ newSession: emptySession })
  }

  render() {
    const { handleDeleteParticipant, handleSaveProfile, handleChange, handleImageChange, handleDescChange } = this;
    const { showModal, closeModal } = this.props;
    const {
      image,
      title,
      startDate,
      endDate,
      timezone,
      description,
      link,
      host
    } = this.state.newSession;

    return (
      <Dialog open={showModal} onClose={closeModal} aria-labelledby="form-dialog-title" scroll="body">
        <DialogTitle id="form-dialog-title">{id ? 'Edit Participant' : 'Create a Profile' }</DialogTitle>
        <DialogContent>
          <ImageUpload
            content={image}
            onContentChange={handleImageChange('image')}
            uploadImage={uploadImage}
          />
          <TextField
            value={name || ''}
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            onChange={handleChange('name')}
            variant="outlined"
            required
          />
          <TextField
            value={affiliateOrganization || ''}
            margin="dense"
            id="affiliateOrganization"
            label="Organization and Role"
            type="text"
            fullWidth
            onChange={handleChange('affiliateOrganization')}
            variant="outlined"
            required
          />
          <TextField
            value={country || ''}
            margin="dense"
            id="country"
            label="Country (optional)"
            type="text"
            fullWidth
            onChange={handleChange('country')}
            variant="outlined"
          />
          <TextField
            value={twitter || ''}
            margin="dense"
            id="twitter"
            label="Twitter URL (optional)"
            type="text"
            fullWidth
            onChange={handleChange('twitter')}
            variant="outlined"
          />
          <TextField
            value={linkedin || ''}
            margin="dense"
            id="linkedin"
            label="Linkedin URL (optional)"
            type="text"
            fullWidth
            onChange={handleChange('linkedin')}
            variant="outlined"
          />
          <TextField
            value={website || ''}
            margin="dense"
            id="website"
            label="Website (optional)"
            type="text"
            fullWidth
            onChange={handleChange('website')}
            variant="outlined"
          />
          <TextField
            value={question1 || ''}
            margin="dense"
            id="question1"
            label="Question 1"
            type="text"
            fullWidth
            onChange={handleChange('question1')}
            variant="outlined"
            multiline
          />
          <TextField
            value={question2 || ''}
            margin="dense"
            id="question2"
            label="Question 2"
            type="text"
            fullWidth
            onChange={handleChange('question2')}
            variant="outlined"
            multiline
          />
          <TextField
            value={question3 || ''}
            margin="dense"
            id="question3"
            label="Question 3"
            type="text"
            fullWidth
            onChange={handleChange('question3')}
            variant="outlined"
            multiline
          />
        </DialogContent>
        <DialogActions>
          <div className="pr-3 pl-3 pb-2 width-100">
            <Grid container justify="space-between">
              <Grid item>
                {
                  id &&
                  <Button onClick={handleDeleteParticipant} color="secondary">
                    Delete
                  </Button>
                }
              </Grid>
              <Grid item>
                <Button
                  onClick={closeModal}
                  color="default"
                  variant="text"
                  style={{borderRadius:0, marginRight: '8px'}}
                  disableElevation>
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveProfile}
                  color="primary"
                  variant="contained"
                  style={{borderRadius:0}}
                  disableElevation>
                  Save
                </Button>
              </Grid>
            </Grid>
          </div>
        </DialogActions>
      </Dialog>
    );
  }

}

SessionModal.defaultProps = {
  onSaveItem: () => console.log("uh oh you're missing onSaveItem"),
  session: emptyEvent,
  showModal: false
}

export default connect(null, mapDispatchToProps)(SessionModal)

