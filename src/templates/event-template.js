import React, { useEffect, useState } from "react";
import Helmet from "react-helmet";
import Container from "@material-ui/core/Container"
import Grid from '@material-ui/core/Grid';
import { DateTime } from "luxon";
import AddToCalendarHOC from 'react-add-to-calendar-hoc';
import VideoEmbed from '../components/common/VideoEmbed';

import Layout from "../layouts/default.js";

// const convertDate = (date, timezone) => {
//   const dateWithTZ = date.setZone(timezone, { keepLocalTime: true })
//   return dateWithTZ.toISO()
// }


const Button = ({ children, onClick }) => (
  <button className="btn btn-primary" onClick={onClick}>{children}</button>
)

const DropDown = ({ children }) => {
  return (
    <div className={"add-to-calendar-dropdown"}>
      {children}
    </div>
  );
}

const AddToCalendarDropdown = AddToCalendarHOC(Button, DropDown);

const getLocalDateTime = date => {
  try {
    return date.setZone(DateTime.local().zoneName)
  } catch(err) {
    console.log("err getting local date", err)
    return date
  }
}

const EventPageTemplate = ({ pageContext: { event } }) => {
  const [CalButton, setCalButton] = useState()
  console.log(event)
  const startDate = DateTime.fromISO(event['program-elements-start-date'])
  const endDate = DateTime.fromISO(event['program-elements-end-date'])

  const startDateLocal = getLocalDateTime(startDate)
  const endDateLocal = getLocalDateTime(endDate)

  // const today = DateTime.local();
  // const isPast = endDateLocal ? endDateLocal < today : startDateLocal < today;
  // const isCurrent = endDateLocal ? startDateLocal < today && endDateLocal > today  : startDateLocal.hasSame(today, 'day');
  // const isUpcoming = startDateLocal > today;
  // const sameDay = startDateLocal && endDateLocal && startDateLocal.hasSame(endDateLocal, 'day')

  const eventDate = startDateLocal.toLocaleString({ month: 'long', day: 'numeric' })
  // const eventEndDate = endDateLocal && endDateLocal !== startDateLocal ? `- ${endDateLocal.toLocaleString({ day: 'numeric' })}` : ''
  const eventStart = startDateLocal.toLocaleString(DateTime.TIME_SIMPLE)
  const eventEnd = endDateLocal.toLocaleString(DateTime.TIME_SIMPLE)

  const calendarEvent = {
    title: event['program-elements-title']['text'],
    description: `${event["program-elements-text"]["text"]}\n\n${event['program-elements-link']['anchor']}: ${event['program-elements-link']['link']}`,
    location: event['program-elements-link']['link'],
    startDatetime: startDate.toFormat("yyyyLLdd'T'HHmmss"),
    endDatetime: endDate.toFormat("yyyyLLdd'T'HHmmss"),
    duration: endDate.diff(startDate).as('hours'),
    timezone: startDate.toFormat("z"),
  }

  return (
    <Layout>
      <Helmet>
        <title>{event['program-elements-title']['text']}</title>
      </Helmet>

      <Container maxWidth="md" className="pb-10 pt-10">
        <header>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <div className="" style={{background: `url(${event["program-elements-image"]["imageSrc"]}) no-repeat center center`, backgroundSize: 'cover', width: '100%', height: '100%' }}>
              </div>
            </Grid>
            <Grid item xs={12} md={8}>
              <div className="event-page-title">
                <h1 className="underline">{event['program-elements-title']['text']}</h1>
                <div className="font-size-h6 text-primary mb-2">
                  {eventDate}, <time>{eventStart}</time> - <time>{eventEnd}</time>
                </div>
                <p className="text-muted text-small">{`Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`}</p>
                <AddToCalendarDropdown
                  event={calendarEvent}
                  filename={event["slug"]}
                  className="add-to-calendar-btn"
                  linkProps={{
                    className: "pretty-link",
                  }}
                />
              </div>
            </Grid>
          </Grid>
        </header>
        <Grid container>
          <Grid item xs={12}>
            <h2 className="mt-6 mb-2">Overview</h2>
            <div dangerouslySetInnerHTML={{__html: event["program-elements-text"]["text"]}} />
            <p><span className="text-bold mr-1">Host:</span>{event['program-elements-host']['text']}</p>
            <p>
              <span className="text-bold mr-1">Link:</span>
              <a href={event['program-elements-link']['link']} target="_blank" rel="noopener noreferrer">
                {event['program-elements-link']['anchor']}
              </a>
            </p>
          </Grid>
          <Grid item xs={12}>
            <VideoEmbed url={event['program-elements-video'] ? event['program-elements-video']['text'] : null} />
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
}

export default EventPageTemplate


