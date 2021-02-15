import React from "react";
import { connect } from "react-redux";
import { navigate, Link } from 'gatsby';
import { FirebaseAuth } from 'react-firebaseui';

import firebase from "../firebase/init";

import {
  userLoggedIn,
  userLoggedOut,
  deleteAccount,
} from "../redux/actions";


const mapStateToProps = state => {
  console.log('ok: ', state);
  const allowEditing = state.adminTools.user && state.adminTools.user.isEditor;

  return {
    isLoggedIn: state.adminTools.isLoggedIn,
    allowEditing: allowEditing,
    user: state.adminTools.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    userLoggedIn: user => {
      dispatch(userLoggedIn(user));
    },
    userLoggedOut: () => {
      dispatch(userLoggedOut());
    },
    deleteAccount: () => {
      dispatch(deleteAccount());
    },
  };
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
    flexDirection: 'column'
  }
}

const uiConfig = {
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
  credentialHelper: 'NONE',
  callbacks: {
      signInSuccessWithAuthResult: () => navigate('/admin')
    }
};


class ProtectedPage extends React.Component {
  state = { firebaseAuth: null }

  componentDidMount() {
    this.setState({ loading: true, firebaseAuth: firebase.auth() }, () => {
      this.state.firebaseAuth.onAuthStateChanged(user => {
        if (user) {
          const ref = firebase
            .app()
            .database()
            .ref(`users/${user.uid}`);
          ref.once("value").then(snapshot => {
            const userData = snapshot.val();
            if (userData) {
              this.props.userLoggedIn(userData);
              this.setState({ loading: false })
            } else {
              const newUser = {
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL
              };
              ref.set(newUser);
              this.props.userLoggedIn(newUser);
              this.setState({ loading: false })
            }
          });
        } else {
          this.props.userLoggedOut();
          this.setState({ loading: false })
        }
      });
    })
  }

  render () {
    if (this.state.loading) {
      return <div className="width-100 height-100 display-flex justify-center align-center mt-10 mb-10"><div className="loader">loading...</div></div>
    }

    if (this.props.isLoggedIn && this.props.allowEditing) {
      return <div>{this.props.children}</div>
    }

    if (this.props.isLoggedIn && !this.props.allowEditing) {
      return (
        <div className="width-100 height-100 display-flex flex-column justify-center align-center mt-10 mb-10">
          <p>You are not authorized to see this page.</p>
          <Link to={'/'} className="ml-2">Go to the home page.</Link>
          <div className="mt-10 mb-10">
            <button onClick={this.props.deleteAccount} className="btn btn-dark">Delete my account</button>
          </div>
        </div>
      )
    }

    return (
      <div style={styles.container}>
          <h1>Sign up / Sign in</h1>
          <p>By creating an account you agree to our <a href="https://bmw-foundation.org/privacy-policy/" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.</p>
          {this.state.firebaseAuth && <FirebaseAuth uiConfig={uiConfig} firebaseAuth={this.state.firebaseAuth} />}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProtectedPage);
