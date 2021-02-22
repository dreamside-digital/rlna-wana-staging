import React, { useState } from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button"
import BrowserNotificationModal from './BrowserNotificationModal'
import {
  fetchBrowserNotifications
} from '../../redux/actions';

function mapStateToProps(state) {
  return {
    browserNotifications: state.adminTools.browserNotifications
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchBrowserNotifications: () => {
      dispatch(fetchBrowserNotifications());
    }
  };
}

const BrowserNotifications = ({ browserNotifications={} }) => {
  const [isOpen, setOpen] = useState(false)
  const [editingNotification, setEditingNotification] = useState()
  const notifArr = Object.keys(browserNotifications).map(k => browserNotifications[k])

  const openModal = () => {
    setOpen(true)
  }

  const closeModal = () => {
    setOpen(false)
  }

  return (
    <div className="mt-10 mb-10">
      <h2>Notifications</h2>
      <div className="browser-notifications">
        {
          notifArr.map(notif => <p key={notif.id}>{notif.message}</p>)
        }
      </div>
      <button className="btn btn-primary" onClick={openModal}>Add notification</button>
      <BrowserNotificationModal
        showModal={isOpen}
        closeModal={closeModal}
        notification={editingNotification}
      />
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(
  BrowserNotifications
);
