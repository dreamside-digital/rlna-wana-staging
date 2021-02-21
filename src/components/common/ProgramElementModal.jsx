import React from "react";
import Button from "@material-ui/core/Button"
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import ImageUpload from '../editing/ImageUpload';
import {uploadImage} from "../../firebase/operations";
import { saveEvent, removeEvent, showNotification } from "../../redux/actions"
import { connect } from "react-redux";
import {KeyboardDateTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import LuxonUtils from "@date-io/luxon";
import TimezoneSelect from "./TimezoneSelect";
import slugify from "slugify";
import {DateTime} from "luxon";

const mapDispatchToProps = dispatch => {
  return {
    saveEvent: (id, event) => {
      dispatch(saveEvent(id, event));
    },
    removeEvent: (id) => {
      dispatch(removeEvent(id));
    },
    showNotification: (text) => {
      dispatch(showNotification(text));
    },
  };
};

const emptyEvent = {
  "title": "Title",
  "startDate": new Date().toISOString(),
  "endDate": new Date().toISOString(),
  "timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
  "url": "/",
  "linkText": "Event link",
  "description": "",
  "video": "",
  "host": "",
  image: {},
}

class ProgramElementModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newEvent: props.event || emptyEvent
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.event !== this.props.event && !Boolean(this.props.event)) {
      this.setState({ newEvent: emptyEvent })
    }

    if (prevProps.event !== this.props.event && this.props.event?.id) {
      this.setState({ newEvent: this.props.event })
    }
  }

  handleChange = key => event => {
    this.setState({ errors: {} })
    const value = event.currentTarget.value
    this.setState({ newEvent: {...this.state.newEvent, [key]: value} })
  }

  handleValueChange = key => value => {
    this.setState({ newEvent: {...this.state.newEvent, [key]: value} })
  }

  handleImageChange = key => image => {
    this.setState({ newEvent: {...this.state.newEvent, [key]: image} })
  }

  handleDescChange = key => desc => {
    this.setState({ newEvent: {...this.state.newEvent, [key]: desc.text} })
  }

  convertDate = (date, timezone) => {
    const dateWithTZ = date.setZone(timezone, { keepLocalTime: true })
    return dateWithTZ.toISO()
  }

  getLocalDateTime = date => {
    try {
      return date.setZone(DateTime.local().zoneName)
    } catch(err) {
      console.log("err getting local date", err)
      return date
    }
  }

  handleSaveEvent = () => {
    const { newEvent } = this.state;

    if (!newEvent['startDate'] || !newEvent['endDate']) {
      return this.props.showNotification("Start date and end date are required")
    }

    const startDate = this.convertDate(newEvent['startDate'], newEvent['timezone'])
    const endDate = this.convertDate(newEvent['endDate'], newEvent['timezone'])
    const localStartDate = startDate.toLocaleString(DateTime.DATE_SHORT)

    const id = newEvent.id ? newEvent.id : `event-${Date.now()}`

    const slug = newEvent.slug ? newEvent.slug : slugify(`${newEvent['title']}-${localStartDate}`, {
      lower: true,
      remove: /[$*_+~.,()'"!:@%^&?=]/g
    })

    const data = {
      ...newEvent,
      startDate,
      endDate,
      slug,
      id
    }

    this.props.saveEvent(id, data)
    this.props.closeModal()
    this.setState({ newEvent: emptyEvent })
  }

  handleCancel = () => {
    this.props.closeModal()
    this.setState({ newEvent: emptyEvent })
  }

  handleDeleteEvent = () => {
    this.props.removeEvent(this.state.newEvent.id)
    this.props.closeModal()
    this.setState({ newEvent: emptyEvent })
  }

  render() {
    const {
      handleDeleteEvent,
      handleSaveEvent,
      handleChange,
      handleImageChange,
      handleValueChange,
      handleCancel
    } = this;
    const { showModal, closeModal } = this.props;
    const {
      title,
      startDate,
      endDate,
      timezone,
      url,
      linkText,
      description,
      image,
      video,
      host,
      id
    } = this.state.newEvent;

    const startDateTime = DateTime.fromISO(startDate)
    const endDateTime = DateTime.fromISO(endDate)

    const formattedStartDate = startDateTime.toFormat('')
    const formattedEndDate = endDateTime.toFormat('')

    return (
      <Dialog open={showModal} onClose={closeModal} aria-labelledby="form-dialog-title" scroll="body">
        <DialogTitle id="form-dialog-title">{id ? 'Edit Event' : 'Create a Event' }</DialogTitle>
        <DialogContent>
          <ImageUpload
            content={image}
            onContentChange={handleImageChange('image')}
            uploadImage={uploadImage}
            label="Upload an image"
          />
          <TextField
            value={title}
            margin="dense"
            id="title"
            label="Title"
            type="text"
            fullWidth
            onChange={handleChange('title')}
            variant="outlined"
            required
          />

          <MuiPickersUtilsProvider utils={LuxonUtils}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <KeyboardDateTimePicker
                  fullWidth
                  margin="dense"
                  id="date"
                  label="Start date"
                  format="MM/dd/yyyy h:mm a"
                  value={startDate}
                  KeyboardButtonProps={{
                    'aria-label': 'select date',
                  }}
                  onChange={handleValueChange('startDate')}
                  inputVariant="outlined"
                  shrink
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <KeyboardDateTimePicker
                  fullWidth
                  margin="dense"
                  id="date"
                  label="End date"
                  format="MM/dd/yyyy h:mm a"
                  value={endDate}
                  KeyboardButtonProps={{
                    'aria-label': 'select date',
                  }}
                  onChange={handleValueChange('endDate')}
                  inputVariant="outlined"
                  shrink
                  required
                />
              </Grid>
            </Grid>
          </MuiPickersUtilsProvider>

          <Grid item xs={12}>
            <label className="text-small" htmlFor="timezone">Timezone</label>
            <TimezoneSelect
              handleChange={handleValueChange('timezone')}
              name="timezone"
              id="timezone"
              className="mb-2"
              value={timezone}
              required
            />
          </Grid>

          <TextField
            value={host}
            margin="dense"
            id="host"
            label="Host"
            type="text"
            fullWidth
            onChange={handleChange('host')}
            variant="outlined"
            required
          />
          <TextField
            value={description}
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            onChange={handleChange('description')}
            variant="outlined"
            multiline
            rows={4}
          />
          <TextField
            value={url}
            margin="dense"
            id="url"
            label="Event URL"
            type="text"
            fullWidth
            onChange={handleChange('url')}
            variant="outlined"
            required
          />
          <TextField
            value={linkText}
            margin="dense"
            id="linkText"
            label="Event link text"
            type="text"
            fullWidth
            onChange={handleChange('linkText')}
            variant="outlined"
          />
          <TextField
            value={video}
            margin="dense"
            id="video"
            label="Link to video on YouTube or Vimeo (optional)"
            type="text"
            fullWidth
            onChange={handleChange('video')}
            variant="outlined"
            placeholder="https://vimeo.com/511895527"
          />
        </DialogContent>
        <DialogActions>
          <div className="pr-3 pl-3 pb-2 width-100">
            <Grid container justify="space-between">
              <Grid item>
                {
                  id &&
                  <Button onClick={handleDeleteEvent} color="secondary">
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
                  onClick={handleSaveEvent}
                  color="primary"
                  variant="contained"
                  style={{borderRadius:0}}
                  disabled={!title || !url || !startDate || !endDate || !timezone}
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

ProgramElementModal.defaultProps = {
  onSaveItem: () => console.log("uh oh you're missing onSaveItem"),
  event: emptyEvent,
  showModal: false
}

export default connect(null, mapDispatchToProps)(ProgramElementModal)

