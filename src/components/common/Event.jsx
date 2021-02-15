import React, { useState } from "react";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { DateTime } from "luxon";


const Event = props => {
  const [ isOpen, setIsOpen ] = useState(false)

  const content = props.content || {};

  const handleSave = newContent => {
    props.onSave(newContent)
  }

  const originalDate = DateTime.fromISO(content['startDate']).setZone(content['timezone'])
  const startDate = DateTime.fromISO(content['startDate']).setZone(DateTime.local().zoneName);
  const endDate = DateTime.fromISO(content['endDate']).setZone(DateTime.local().zoneName);

  return (
    <Card className={`event-item mb-4 mt-4 display-block ${props.classes}`} square={true} elevation={0}>
      <CardContent className="card-body">
        <div className="text-muted text-xs"><time>{startDate.toLocaleString(DateTime.TIME_SIMPLE)}</time> - <time>{endDate.toLocaleString(DateTime.TIME_SIMPLE)}</time></div>
        <div className="text-muted text-xs">{startDate.toLocaleString(DateTime.DATE_FULL)}</div>
        <h5 className="mt-3 mb-3">{content['title']}</h5>
        <div className="text-xs">{content['host']}</div>
        <div className="display-flex justify-right mt-4">
          <button className="text-xs text-blue pretty-link" onClick={() => setIsOpen(true)}>Read more</button>
        </div>
      </CardContent>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogContent>
          <h3>{content['title']}</h3>
          <div className="text-muted"><time>{startDate.toLocaleString(DateTime.DATETIME_MED)}</time> - <time>{endDate.toLocaleString(DateTime.DATETIME_MED)}</time></div>
          <p className="mt-6 mb-6">{content['description']}</p>
          <div className="mb-6">
            <p className="text-small mb-2 mt-2"><span className="text-bold">{`Hosted by: `}</span>{content['host']}</p>
            {content['eventUrl'] &&
            <p className="text-small mb-2 mt-2"><span className="text-bold">{`Link: `}</span><a href={content['eventUrl']} target="_blank" rel="noopener noreferrer">{content['eventUrl']}</a></p>
            }
            <p className="text-small mb-2 mt-2"><span className="text-bold">{`Event time: `}</span>{originalDate.toLocaleString(DateTime.DATETIME_HUGE)}</p>
          </div>
        </DialogContent>
        <DialogActions>
          <Grid container justify="center">
            <Grid item style={{ paddingBottom: '30px' }}>
              {content['rsvpUrl'] &&
              <a className="btn" href={content['rsvpUrl']} target="_blank" rel="noopener noreferrer">RSVP</a>
              }
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

Event.defaultProps = {
  content: {},
  classes: "",
  onSave: () => { console.log('implement a function to save changes') }
}

export default Event;
