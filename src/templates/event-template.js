import React from "react";
import Helmet from "react-helmet";
import Container from "@material-ui/core/Container"
import Grid from '@material-ui/core/Grid';
import { DateTime } from "luxon";
import AddToCalendarHOC from 'react-add-to-calendar-hoc';
import VideoEmbed from '../components/common/VideoEmbed';
import IframeEmbed from '../components/common/IframeEmbed';
import SessionMaterials from '../components/common/SessionMaterials';

import Layout from "../layouts/default.js";

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

// const getLocalDateTime = date => {
//   try {
//     return date.setZone(DateTime.local().zoneName)
//   } catch(err) {
//     console.log("err getting local date", err)
//     return date
//   }
// }

const EventPageTemplate = ({ pageContext: { event } }) => {
  const startDate = DateTime.fromISO(event['startDate'])
  const endDate = DateTime.fromISO(event['endDate'])

  const originalStartDate = DateTime.fromISO(event['startDate']).setZone(event['timezone'])
  const originalEndDate = DateTime.fromISO(event['endDate']).setZone(event['timezone'])

  const formattedStartDate = startDate.toLocaleString({ month: 'long', day: 'numeric' })
  const eventEndDate = endDate.toLocaleString({ month: 'long', day: 'numeric' })
  const formattedEndDate = eventEndDate && eventEndDate !== formattedStartDate ? `${eventEndDate}, ` : ''
  const eventStart = startDate.toLocaleString(DateTime.TIME_SIMPLE)
  const eventEnd = endDate.toLocaleString(DateTime.TIME_SIMPLE)

  const timezone = startDate.toFormat("z")

  const calendarEvent = {
    title: event['title'],
    description: `${event["description"]}\n\n${event['linkText']}: ${event['url']}`,
    location: event['url'],
    startDatetime: startDate.toFormat("yyyyLLdd'T'HHmmss"),
    endDatetime: endDate.toFormat("yyyyLLdd'T'HHmmss"),
    duration: endDate.diff(startDate).as('hours'),
    timezone: timezone,
  }

  const bgStyle = event["image"] && event["image"]["imageSrc"] ? {background: `url(${event["image"]["imageSrc"]}) no-repeat center center`, backgroundSize: 'cover', width: '100%', height: '100%', minHeight: '200px', paddingRight: '20px' } : null

  return (
    <Layout>
      <Helmet>
        <title>{event['title']}</title>
      </Helmet>

      <Container maxWidth="md" className="pb-10 pt-10">
        <header>
          <Grid container spacing={2}>
            {bgStyle &&
            <Grid item xs={12} md={4}>
              <div className="event-image" style={bgStyle}>
              </div>
            </Grid>
            }
            <Grid item xs={12} md={8}>
              <div className="event-page-title">
                <h1 className="underline">{event['title']}</h1>
                <div className="font-size-h6 text-primary mb-2">
                  {formattedStartDate}, <time>{eventStart}</time> - {formattedEndDate} <time>{eventEnd}</time>
                </div>
                <p className="text-muted text-small">{`Timezone: ${timezone}`}</p>
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
            <div dangerouslySetInnerHTML={{__html: event["description"]}} />
            {event['host'] && <p><span className="text-bold mr-1">Hosted by:</span>{event['host']}</p>}
            <p>
              <span className="text-bold mr-1">{`${event['linkText']}:`}</span>
              {
                Boolean(event['url']) ? (
                <a href={event['url']} target="_blank" rel="noopener noreferrer">
                  {event['url']}
                </a>
                ) : (
                  <span>More information will follow</span>
                )
              }
            </p>
            <p>
              <span className="text-bold mr-1">Original time:</span>
              <time>{originalStartDate.toLocaleString(DateTime.DATETIME_FULL)}</time> - <time>{originalEndDate.toLocaleString(DateTime.DATETIME_FULL)}</time>
            </p>
          </Grid>
          <Grid item xs={12}>
            <VideoEmbed url={event['video']} />
          </Grid>

          <Grid item xs={12}>
            <IframeEmbed src={event['iframe']} />
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={12}>
            <SessionMaterials eventId={event.id} />
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
}

export default EventPageTemplate


