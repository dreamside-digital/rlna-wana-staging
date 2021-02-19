import React from "react";
import Helmet from "react-helmet";
import Container from "@material-ui/core/Container"
import Grid from '@material-ui/core/Grid';
import { DateTime } from "luxon";

import Layout from "../layouts/default.js";

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

const styles = {
  iframeContainer: {
    position: "relative",
    paddingBottom: `43%`,
    height: 0,
    overflow: "hidden",
    width: "100%",
    maxWidth: "100%",
    marginTop: "20px",
  },
  iframe: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  }
}

const EventPageTemplate = ({ pageContext: { event } }) => {
  console.log(event)
  const startDate = DateTime.fromISO(event['program-elements-start-date'])
  const endDate = DateTime.fromISO(event['program-elements-end-date'])

  const startDateLocal = getLocalDateTime(startDate)
  const endDateLocal = getLocalDateTime(endDate)

  if (!startDateLocal || !endDateLocal) {
    return null
  }

  const today = DateTime.local();
  const isPast = endDateLocal ? endDateLocal < today : startDateLocal < today;
  const isCurrent = endDateLocal ? startDateLocal < today && endDateLocal > today  : startDateLocal.hasSame(today, 'day');
  const isUpcoming = startDateLocal > today;
  const sameDay = startDateLocal && endDateLocal && startDateLocal.hasSame(endDateLocal, 'day')

  const eventDate = startDateLocal.toLocaleString({ month: 'long', day: 'numeric' })
  const eventEndDate = endDateLocal && endDateLocal !== startDateLocal ? `- ${endDateLocal.toLocaleString({ day: 'numeric' })}` : ''
  const eventStart = startDateLocal.toLocaleString(DateTime.TIME_SIMPLE)
  const eventEnd = endDateLocal.toLocaleString(DateTime.TIME_SIMPLE)
  const videoId = 506669951
  // const videoId = event["program-elements-video"] ? event["program-elements-video"]["text"].split("vimeo.com/")[1] : null

  return (
    <Layout>
      <Helmet>
        <title>{event['program-elements-title']['text']}</title>
      </Helmet>

      <Container maxWidth="md" className="pb-10 pt-10">
        <header>
          <Grid container>
            <Grid xs={12} md={4}>
              <div className="image-container" style={{background: `url(${event["program-elements-image"]["imageSrc"]}) no-repeat center center`, backgroundSize: 'cover', width: '100%', height: '100%' }}>
              </div>
            </Grid>
            <Grid xs={12} md={8}>
              <div className="event-page-title">
                <h1 className="underline">{event['program-elements-title']['text']}</h1>
                <div className="font-size-h6 text-primary mb-2">
                  {eventDate}, <time>{eventStart}</time> - <time>{eventEnd}</time>
                </div>
                <p className="text-muted text-small">{`Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`}</p>
                <button className={"btn btn-primary"}>Add to calendar</button>
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
          {videoId &&
            <Grid item xs={12}>
              <div style={styles.iframeContainer}>
                <iframe style={styles.iframe} src={`https://player.vimeo.com/video/${videoId}`} width="640" height="268" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
              </div>
            </Grid>
          }
        </Grid>
      </Container>
    </Layout>
  );
}

export default EventPageTemplate


