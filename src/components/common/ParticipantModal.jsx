import React from "react";
import Button from "@material-ui/core/Button"
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {ImageUploadEditor, RichTextEditor} from "react-easy-editables";
import {uploadImage} from "../../firebase/operations";

const emptyParticipant = {
  name: '',
  affiliateOrganization: '',
  description: 'Participant bio',
  image: {},
  twitter: '',
  linkedin: '',
  instagram: '',
  website: '',
}

class ParticipantModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { newParticipant: props.participant || emptyParticipant }
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
    const value = event.currentTarget.value
    this.setState({ newParticipant: {...this.state.newParticipant, [key]: value} })
  }

  handleImageChange = key => image => {
    this.setState({ newParticipant: {...this.state.newParticipant, [key]: image} })
  }

  handleDescChange = key => desc => {
    this.setState({ newParticipant: {...this.state.newParticipant, [key]: desc.text} })
  }

  handleSaveParticipant = () => {
    const { newParticipant } = this.state;

    const id = newParticipant.id ? newParticipant.id : `participant-${Date.now()}`

    const data = {
      ...newParticipant,
      id
    }

    this.props.onSaveItem(id)(data)
    this.props.closeModal()
    this.setState({ newParticipant: emptyParticipant })
  }

  handleDeleteParticipant = () => {
    this.props.onDeleteItem(this.state.newParticipant.id)()
    this.props.closeModal()
    this.setState({ newParticipant: emptyParticipant })
  }

  render() {
    const { handleDeleteParticipant, handleSaveParticipant, handleChange, handleImageChange, handleDescChange } = this;
    const { showModal, closeModal } = this.props;
    const { name, affiliateOrganization, description, image, id, twitter, linkedin, instagram, website } = this.state.newParticipant;

    return (
      <Dialog open={showModal} onClose={closeModal} aria-labelledby="form-dialog-title" scroll="body">
        <DialogTitle id="form-dialog-title">{id ? 'Edit Participant' : 'New Participant' }</DialogTitle>
        <DialogContent>
          {
            !id &&
            <DialogContentText>
              Fill out this form to add a new participant.
            </DialogContentText>
          }
          <ImageUploadEditor
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
          />
          <TextField
            value={affiliateOrganization || ''}
            margin="dense"
            id="affiliateOrganization"
            label="Affiliate Organization"
            type="text"
            fullWidth
            onChange={handleChange('affiliateOrganization')}
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
            value={instagram || ''}
            margin="dense"
            id="instagram"
            label="Instagram URL (optional)"
            type="text"
            fullWidth
            onChange={handleChange('instagram')}
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
          <RichTextEditor
            content={{ text: description || '' }}
            onContentChange={handleDescChange('description')}
            classes="mb-1"
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
                <Button onClick={closeModal} color="secondary">
                  Cancel
                </Button>
                <Button onClick={handleSaveParticipant} color="primary">
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

export default ParticipantModal

