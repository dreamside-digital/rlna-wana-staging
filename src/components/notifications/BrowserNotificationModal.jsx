import React from "react";
import { connect } from "react-redux";
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
import {uploadImage} from "../../firebase/operations";
import { saveBrowserNotification, removeBrowserNotification } from '../../redux/actions'

const mapDispatchToProps = dispatch => {
  return {
    saveBrowserNotification: (id, data) => {
      dispatch(saveBrowserNotification(id, data));
    },
    removeBrowserNotification: (id) => {
      dispatch(removeBrowserNotification(id));
    },
  };
};

const emptyItem = {
    title: "",
    message: "",
    url: "",
  }

class BrowserNotificationModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { newItem: props.notification || emptyItem }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.notification !== this.props.notification && !Boolean(this.props.notification)) {
      this.setState({ newItem: emptyItem })
    }

    if (prevProps.notification !== this.props.notification && this.props.notification?.id) {
      this.setState({ newItem: this.props.notification })
    }
  }

  handleChange = key => event => {
    const value = event.currentTarget.value
    this.setState({ newItem: {...this.state.newItem, [key]: value} })
  }

  handleCheckboxChange = key => event => {
    const value = event.currentTarget.checked
    this.setState({ newItem: {...this.state.newItem, [key]: value} })
  }

  handleDescChange = key => desc => {
    this.setState({ newItem: {...this.state.newItem, [key]: desc.text} })
  }

  handleSave = () => {
    const { newItem } = this.state;

    const id = newItem.id ? newItem.id : `notification-${Date.now()}`
    const date = new Date()
    const data = {
      ...newItem,
      timestamp: date.toString(),
      id
    }

    this.props.saveBrowserNotification(id, data)
    this.props.closeModal()
    this.setState({ newItem: emptyItem })
  }

  handleDelete = () => {
    this.props.removeBrowserNotification(this.state.newItem.id)
    this.props.closeModal()
    this.setState({ newItem: emptyItem })
  }

  render() {
    const {handleChange, handleCheckboxChange, handleSave, handleDelete} = this;
    const { showModal, closeModal } = this.props;
    const {
      title,
      message,
      url,
      id,
      active
    } = this.state.newItem;

    return (
      <Dialog open={showModal} onClose={closeModal} aria-labelledby="form-dialog-title" scroll="body">
        <DialogTitle id="form-dialog-title">{id ? 'Edit Notification' : 'Create a Notification' }</DialogTitle>
        <DialogContent>
          <TextField
            value={title || ''}
            margin="dense"
            id="title"
            label="Title"
            type="text"
            fullWidth
            onChange={handleChange('title')}
            variant="outlined"
            required
          />
          <TextField
            value={message || ''}
            margin="dense"
            id="message"
            label="Message"
            type="text"
            fullWidth
            onChange={handleChange('message')}
            variant="outlined"
            required
          />
          <TextField
            value={url || ''}
            margin="dense"
            id="url"
            label="URL"
            type="text"
            fullWidth
            onChange={handleChange('url')}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <div className="pr-3 pl-3 pb-2 width-100">
            <Grid container justify="space-between">
              <Grid item>
                {
                  id &&
                  <Button onClick={handleDelete} color="secondary">
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
                  onClick={handleSave}
                  color="primary"
                  variant="contained"
                  style={{borderRadius:0}}
                  disabled={!title || !message}
                  disableElevation>
                  Send notification!
                </Button>
              </Grid>
            </Grid>
          </div>
        </DialogActions>
      </Dialog>
    );
  }

}

BrowserNotificationModal.defaultProps = {
  onSaveItem: () => console.log("uh oh you're missing onSaveItem"),
  notification: emptyItem,
  showModal: false
}

export default connect(null, mapDispatchToProps)(BrowserNotificationModal)

