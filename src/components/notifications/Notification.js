import React from "react";
import { connect } from "react-redux";
import { closeNotification } from "../../redux/actions";

import Snackbar from "@material-ui/core/Snackbar";

function mapStateToProps(state) {
  return {
    notificationMessage: state.notifications.message,
    notificationColor: state.notifications.color
  };
}

function mapDispatchToProps(dispatch) {
  return {
    closeNotification: () => {
      dispatch(closeNotification());
    }
  };
}

const styles = {
  container: {
    position: "fixed",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginTop: "10px",
    zIndex: "1400"
  },
  alert: {
    minWidth: "50vw"
  }
};

const Notification = props => {
  const showNotification = !!props.notificationMessage;

  return (
    <div className="notification-container" style={styles.container}>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={5000}
        open={showNotification}
        onClose={props.closeNotification}
        ContentProps={{
          'aria-describedby': 'notification-id',
          style: { width: '100%', textAlign: 'center' }
        }}
        message={<span id="notification-id">{props.notificationMessage}</span>}
      />
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(
  Notification
);
