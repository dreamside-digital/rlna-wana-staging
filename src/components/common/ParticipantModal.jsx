import React from "react";
import Button from "@material-ui/core/Button"
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import ImageUpload from '../editing/ImageUpload';
import {uploadImage} from "../../firebase/operations";
import { saveProfile, removeProfile } from "../../redux/actions"
import { connect } from "react-redux";

const mapDispatchToProps = dispatch => {
  return {
    saveProfile: (id, profile) => {
      dispatch(saveProfile(id, profile));
    },
    removeProfile: (id) => {
      dispatch(removeProfile(id));
    },
  };
};

const emptyParticipant = {
  name: '',
  affiliateOrganization: '',
  image: {},
  twitter: '',
  linkedin: '',
  instagram: '',
  website: '',
  question1: '',
  question2: '',
  question3: '',
  termsAccepted: false,
}

class ParticipantModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newParticipant: props.participant || emptyParticipant,
      errors: {}
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.participant !== this.props.participant && !Boolean(this.props.participant)) {
      this.setState({ newParticipant: emptyParticipant })
    }

    if (prevProps.participant !== this.props.participant && this.props.participant?.id) {
      this.setState({ newParticipant: this.props.participant })
    }
  }

  handleChange = key => event => {
    this.setState({ errors: {} })
    const value = event.currentTarget.value
    this.setState({ newParticipant: {...this.state.newParticipant, [key]: value} })
  }

  handleCheckboxChange = key => event => {
    this.setState({ errors: {} })
    const value = event.currentTarget.checked
    this.setState({ newParticipant: {...this.state.newParticipant, [key]: value} })
  }

  handleImageChange = key => image => {
    this.setState({ newParticipant: {...this.state.newParticipant, [key]: image} })
  }

  handleDescChange = key => desc => {
    this.setState({ newParticipant: {...this.state.newParticipant, [key]: desc.text} })
  }

  handleSaveProfile = () => {
    const { newParticipant } = this.state;

    if (!newParticipant.termsAccepted) {
      return this.setState({ errors: {
        ...this.state.errors,
        termsAccepted: 'You must accept the Privacy Policy to continue.'
      }})
    }

    const id = newParticipant.id ? newParticipant.id : `profile-${Date.now()}`

    const data = {
      ...newParticipant,
      id
    }

    this.props.saveProfile(id, data)
    this.props.closeModal()
    this.setState({ newParticipant: emptyParticipant })
  }

  handleCancel = () => {
    this.props.closeModal()
    this.setState({ newParticipant: emptyParticipant })
  }

  handleDeleteParticipant = () => {
    this.props.removeProfile(this.state.newParticipant.id)
    this.props.closeModal()
    this.setState({ newParticipant: emptyParticipant })
  }

  render() {
    const { handleDeleteParticipant, handleSaveProfile, handleChange, handleCheckboxChange, handleImageChange, handleCancel } = this;
    const { showModal, closeModal } = this.props;
    const {
      name,
      affiliateOrganization,
      image,
      id,
      twitter,
      linkedin,
      country,
      website,
      question1,
      question2,
      question3,
      termsAccepted
    } = this.state.newParticipant;

    const { errors } = this.state;

    return (
      <Dialog open={showModal} onClose={closeModal} aria-labelledby="form-dialog-title" scroll="body">
        <DialogTitle id="form-dialog-title">{id ? 'Edit Participant' : 'Create a Profile' }</DialogTitle>
        <DialogContent>
          <ImageUpload
            content={image}
            onContentChange={handleImageChange('image')}
            uploadImage={uploadImage}
            label="Add a profile photo"
            round
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
            label="Country and City (optional)"
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
            placeholder="https://twitter.com/bmwfoundation"
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
            placeholder="https://www.linkedin.com/company/bmw-foundation"
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
            placeholder="https://bmw-foundation.org"
          />
          <TextField
            value={question1 || ''}
            margin="dense"
            id="question1"
            label="What projects/activities do you lead or are you involved in that express your Responsible Leadership?"
            type="text"
            fullWidth
            onChange={handleChange('question1')}
            variant="outlined"
            multiline
            rows={4}
          />
          <TextField
            value={question2 || ''}
            margin="dense"
            id="question2"
            label="What SDG(s) do these projects or initiatives address?"
            type="text"
            fullWidth
            onChange={handleChange('question2')}
            variant="outlined"
            multiline
            rows={4}
          />
          <TextField
            value={question3 || ''}
            margin="dense"
            id="question3"
            label="What are you passionate about? And/or: What are your hobbies?"
            type="text"
            fullWidth
            onChange={handleChange('question3')}
            variant="outlined"
            multiline
            rows={4}
          />
          <FormControlLabel
            control={
              <Checkbox checked={termsAccepted} onChange={handleCheckboxChange('termsAccepted')} value="termsAccepted" required />
            }
            label={<p>I have read and accept the <a href="https://bmw-foundation.org/en/privacy-policy/">Privacy Policy</a></p>}
          />
          <FormHelperText error>{errors.termsAccepted}</FormHelperText>
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
                  onClick={handleCancel}
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
                  disabled={!name || !affiliateOrganization || !termsAccepted}
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

ParticipantModal.defaultProps = {
  onSaveItem: () => console.log("uh oh you're missing onSaveItem"),
  participant: emptyParticipant,
  showModal: false
}

export default connect(null, mapDispatchToProps)(ParticipantModal)

