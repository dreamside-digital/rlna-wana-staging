import React, { useState } from "react";
import Grid from '@material-ui/core/Grid';
import slugify from "slugify";
import { connect } from "react-redux";
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

    const slug = content['slug'] || slugify(`${newContent['title']}-${localStartDate}`, {
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

  const formattedStartDate = startDate.toLocaleString({ month: 'long', day: 'numeric' })
  const eventEndDate = endDate.toLocaleString({ month: 'long', day: 'numeric' })
  const formattedEndDate = eventEndDate && eventEndDate !== formattedStartDate ? `${eventEndDate}, ` : ''
  const eventStart = startDate.toLocaleString(DateTime.TIME_SIMPLE)
  const eventEnd = endDate.toLocaleString(DateTime.TIME_SIMPLE)
  const bgStyle = content["image"] ? {background: `url(${content["image"]["imageSrc"]}) no-repeat center center`, backgroundSize: 'cover', width: '100%', height: '100%' } : {}

  return (
    <div className={`program-box mt-5 ${isCurrent ? 'is-large' : ''}`} data-aos="fade-right">
      <Grid container className="position-relative">
        <Grid item md={4} xs={12}>
          <div className="image-container" style={bgStyle}>
          </div>
        </Grid>
        <Grid item md={8} xs={11} className={'content-box'}>
          <div className="text-small text-primary mb-6">
            {formattedStartDate}, <time>{eventStart}</time> - {formattedEndDate} <time>{eventEnd}</time>
          </div>
          <h3 className="text-bold mt-2 mb-6">
            {content["title"]}
          </h3>
          <p><span className="text-bold mr-1">Hosted by:</span>{content['host']}</p>
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
  )
}

ProgramElementItem.defaultProps = {
  "title": "Title",
  "startDate": new Date().toISOString(),
  "endDate": new Date().toISOString(),
  "timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
  "url": "/",
  "linkText": "Event link",
  "description": "",
  "video": "",
  "host": "",
  "image": { "imageSrc": "", "title": "" },
  classes: "",
  onSave: () => { console.log('implement a function to save changes') }
}

export default connect(null, mapDispatchToProps)(ProgramElementItem);
