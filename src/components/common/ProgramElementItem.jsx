import React, { useState } from "react";
import Grid from '@material-ui/core/Grid';
import slugify from "slugify";
import { connect } from "react-redux";
import slugify from "slugify";
import { Link } from "gatsby";

import {
  PlainTextEditor,
  TextAreaEditor,
  LinkEditor,
  ImageUploadEditor,
  Editable,
} from 'react-easy-editables';
import {KeyboardDateTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import LuxonUtils from "@date-io/luxon";
import {DateTime} from "luxon";
import TimezoneSelect from "./TimezoneSelect";
import {uploadImage} from "../../firebase/operations";

import { showNotification } from "../../redux/actions";

const mapDispatchToProps = dispatch => {
  return {
    showNotification: (text) => {
      dispatch(showNotification(text));
    },
  };
};

const ProgramElementItemEditor = ({ content, onContentChange }) => {

  const handleEditorChange = field => item => {
    onContentChange({
      ...content,
      [field]: {
        ...item
      }
    });
  }

  const startDate = content["startDate"].setZone(content["timezone"])
  const endDate = content["endDate"].setZone(content["timezone"])

  return(
    <div className="program-box mt-5 p-5">
      <Grid container className="position-relative">
        <Grid item xs={12}>
          <ImageUploadEditor
            content={content["image"]}
            onContentChange={handleEditorChange('image')}
            uploadImage={uploadImage}
          />
          <label className="text-small mb-2" htmlFor="title">Session title</label>
          <PlainTextEditor
            id="title"
            classes="mb-3 p-2"
            content={content["title"]}
            onContentChange={handleEditorChange("title")}
          />
        </Grid>
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
                onChange={date => {
                  onContentChange({ ...content, 'startDate': date })
                }}
                inputVariant="outlined"
                shrink
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
                onChange={date => {
                  onContentChange({ ...content, 'endDate': date })
                }}
                inputVariant="outlined"
                shrink
              />
            </Grid>
          </Grid>
        </MuiPickersUtilsProvider>
        <Grid item xs={12}>
          <label className="text-small" htmlFor="timezone">Timezone</label>
          <TimezoneSelect
            handleChange={value => {
              onContentChange({ ...content, 'timezone': value })
            }}
            name="timezone"
            id="timezone"
            className="mb-2"
            value={content["timezone"]}
          />
        </Grid>

        <Grid item xs={12}>
          <label className="text-small" htmlFor="host">Name of host (optional)</label>
          <PlainTextEditor
            id="host"
            classes="mb-2 p-2"
            content={content["host"]}
            onContentChange={handleEditorChange("host")}
          />
        </Grid>
        <Grid item xs={12}>
          <label className="text-small mt-3" htmlFor="description">Description</label>
          <TextAreaEditor
            id="description"
            classes="mb-3"
            content={content["description"]}
            onContentChange={handleEditorChange("description")}
          />
        </Grid>

        <Grid item xs={12}>
          <div className="mb-2">
            <LinkEditor
              content={content["link"]}
              onContentChange={handleEditorChange("link")}
            />
          </div>
        </Grid>
        <Grid item xs={12}>
          <label className="text-small" htmlFor="video">Link to video on YouTube or Vimeo (optional)</label>
          <PlainTextEditor
            id="video"
            classes="mb-3 p-2"
            content={content["video"]}
            onContentChange={handleEditorChange("video")}
            placeholder="https://vimeo.com/511895527"
          />
        </Grid>
      </Grid>
      <div className='mid-dot is-past' />
      <div className='line' />
    </div>
  )
}

const ProgramElementItem = props => {
  const [ isOpen, setIsOpen ] = useState(false)
  const content = props.content || {}

  const convertDate = (date, timezone) => {
    const dateWithTZ = date.setZone(timezone, { keepLocalTime: true })
    return dateWithTZ.toISO()
  }

  const getLocalDateTime = date => {
    try {
      return date.setZone(DateTime.local().zoneName)
    } catch(err) {
      console.log("err getting local date", err)
      return date
    }
  }

  const handleSave = newContent => {
    if (!newContent['startDate'] || !newContent['endDate']) {
      return props.showNotification("Start date and end date are required")
    }

    const startDate = convertDate(newContent['startDate'], newContent['timezone'])
    const endDate = convertDate(newContent['endDate'], newContent['timezone'])
    const localStartDate = startDate.toLocaleString(DateTime.DATE_SHORT)

    const slug = content['slug'] || slugify(`${newContent['title']['text']}-${localStartDate}`, {
      lower: true,
      remove: /[$*_+~.,()'"!:@%^&?=]/g
    })

    const data = {
      ...newContent,
      'startDate': startDate,
      'endDate': endDate,
      slug: slug,
    }

    console.log({ eventData: data })

    props.onSave(data)
  }

  const startDate = getLocalDateTime(content["startDate"])
  const endDate = getLocalDateTime(content["endDate"])


  if (!startDate || !endDate) {
    return null
  }

  const today = DateTime.local();
  const isPast = endDate ? endDate < today : startDate < today;
  const isCurrent = endDate ? startDate < today && endDate > today  : startDate.hasSame(today, 'day');
  // const isUpcoming = startDate > today;
  // const sameDay = startDate && endDate && startDate.hasSame(endDate, 'day')

  const eventDate = startDate.toLocaleString({ month: 'long', day: 'numeric' })
  // const eventEndDate = endDate && endDate !== startDate ? `- ${endDate.toLocaleString({ day: 'numeric' })}` : ''
  const eventStart = startDate.toLocaleString(DateTime.TIME_SIMPLE)
  const eventEnd = endDate.toLocaleString(DateTime.TIME_SIMPLE)

  return (
    <Editable
      Editor={ProgramElementItemEditor}
      handleSave={handleSave}
      content={content}
      {...props}
    >
      <div className={`program-box mt-5 ${isCurrent ? 'is-large' : ''}`} data-aos="fade-right">
        <Grid container className="position-relative">
          <Grid item md={4} xs={12}>
            <div className="image-container" style={{background: `url(${content["image"]["imageSrc"]}) no-repeat center center`, backgroundSize: 'cover', width: '100%', height: '100%' }}>
            </div>
          </Grid>
          <Grid item md={8} xs={11} className={isOpen ? 'content-box' : 'content-box hide-on-med-and-down'}>
            <div className="hide-on-large-only text-bold text-right cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
              {
                !isOpen &&
                <div className="display-flex align-center justify-right">
                  Read More <svg className="ml-2" width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path d="M11 11v-11h1v11h11v1h-11v11h-1v-11h-11v-1h11z"/></svg>
                </div>
              }
              {
                isOpen &&
                <div className="display-flex align-center justify-right">
                  Show less <svg className="ml-2" width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path d="M0 12v1h23v-1h-23z"/></svg>
                </div>
              }
            </div>
            <div className="font-size-h6 text-primary mb-6">
              {eventDate}, <time>{eventStart}</time> - <time>{eventEnd}</time>
            </div>
            <h3 className="text-bold mt-2 mb-6">
              {content["title"]["text"]}
            </h3>
            <p><span className="text-bold mr-1">Hosted by:</span>{content['host']['text']}</p>
          </Grid>
        </Grid>
        <div className={`program-link ${isCurrent ? 'is-large' : ''}`}>
          <Link
            className={`btn btn-lg ${isPast ? 'btn-gray' : ''}`}
            to={`/${content['slug']}`}>
            Read more
          </Link>
        </div>
        <div className={`mid-dot ${isPast ? 'is-past' : ''} ${isCurrent ? 'is-large' : ''}`} />
        <div className='line' />
      </div>
    </Editable>
  )
}

ProgramElementItem.defaultProps = {
  content: {
    "title": { "text": "Title" },
    "startDate": new Date().toISOString(),
    "endDate": new Date().toISOString(),
    "timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
    "link": { "link": "/", "anchor": "Zoom Link" },
    "description": { "text": `<p>Description text</p>` },
    "image": { "imageSrc": "", "title": "" },
    "video": { "text": "" },
    "host": { "text": "" },
  },
  classes: "",
  onSave: () => { console.log('implement a function to save changes') }
}

export default connect(null, mapDispatchToProps)(ProgramElementItem);
