import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button"
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


const NotificationsModal = ({ open, closeModal }) => {
    return (
      <Dialog open={open} onClose={closeModal} aria-labelledby="form-dialog-title" scroll="body">
        <DialogTitle id="form-dialog-title">Sign up for notifications</DialogTitle>
        <DialogContent>

        </DialogContent>
        <DialogActions>

        </DialogActions>
      </Dialog>
    );
  }

}

EventModal.defaultProps = {
  onSaveItem: () => console.log("uh oh you're missing onSaveItem"),
  event: emptyEvent,
  showModal: false
}

export default EventModal

