import React from "react";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import { Link } from "gatsby";
import {DateTime} from "luxon";

const getLocalDateTime = date => {
  try {
    return date.setZone(DateTime.local().zoneName)
  } catch(err) {
    console.log("err getting local date", err)
    return date
  }
}

const PastProgramElementItem = ({ content }) => {
  const startDate = getLocalDateTime(content["startDate"])
  const endDate = getLocalDateTime(content["endDate"])
  const formattedStartDate = startDate.toLocaleString({ month: 'long', day: 'numeric' })
  const eventEndDate = endDate.toLocaleString({ month: 'long', day: 'numeric' })
  const formattedEndDate = eventEndDate && eventEndDate !== formattedStartDate ? `${eventEndDate}, ` : ''
  const eventStart = startDate.toLocaleString(DateTime.TIME_SIMPLE)
  const eventEnd = endDate.toLocaleString(DateTime.TIME_SIMPLE)

  return (
    <Card
      className={`gallery-item mb-4 display-block`}
      square={true}
      raised={false}
      elevation={0}
      component={Link}
      to={content["slug"]}
    >
      <div className="position-relative img-container bg-gradient">
        {
          Boolean(content["image"]) ?
          <CardMedia
            className={"gallery-item-image"}
            image={content["image"]["imageSrc"]}
            title={content["image"]["title"]}
            style={{ height: '250px' }}
          /> :
          <div className="pt-20" />
        }
        <div className={`overlay-gradient ${content["image"] ? '' : 'full-opacity'}`} />
      </div>
      <CardContent className="card-body">

        <Grid container>
          <Grid item xs={12}>
            <div className="author">
              {formattedStartDate}, <time>{eventStart}</time> - {formattedEndDate} <time>{eventEnd}</time>
            </div>
          </Grid>

          <Grid item xs={12}>
            <div className="card-title">
              <h4 className="text-dark mt-2 mb-0">
                { content["title"] }
              </h4>
            </div>
          </Grid>

          {
            content["host"] &&
            <Grid item xs={12}>
              <div className="details text-primary">
                Hosted by: {content["host"]}
              </div>
            </Grid>
          }

        </Grid>
      </CardContent>
    </Card>
  );
};

export default PastProgramElementItem;
