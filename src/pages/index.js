import React from "react";
import { graphql } from "gatsby";
import { connect } from "react-redux";
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import {
  EditableText,
  EditableParagraph,
  EditableBackgroundImage,
  EditableEmbeddedIframe,
} from "react-easy-editables";

import {
  updatePage,
  loadPageData,
  validateAccessCode,
  showNotification
} from "../redux/actions";

import {
  requestPermissionForNotifications,
  notificationPermission
} from '../utils/notifications';

import { uploadImage } from '../firebase/operations';

import Layout from "../layouts/default.js";
import Section from "../components/common/Section"
import ParticipantGallery from "../components/common/ParticipantGallery"
import ProgramElements from "../components/common/ProgramElements"
import PastProgramElements from "../components/common/PastProgramElements"

const mapDispatchToProps = dispatch => {
  return {
    onUpdatePageData: (page, id, data) => {
      dispatch(updatePage(page, id, data));
    },
    onLoadPageData: data => {
      dispatch(loadPageData(data));
    },
    validateAccessCode: (code) => {
      dispatch(validateAccessCode(code));
    },
    showNotification: (msg) => {
      dispatch(showNotification(msg));
    },
  };
};

const mapStateToProps = state => {
  return {
    pageData: state.page.data,
    isLoggedIn: state.adminTools.isLoggedIn,
    accessGranted: state.adminTools.accessGranted,
  };
};

const isClient = typeof window !== 'undefined';

class HomePage extends React.Component {

  constructor(props) {
    super(props)
    const initialPageData = {
      ...this.props.data.pages,
      content: JSON.parse(this.props.data.pages.content)
    };
    this.state = {
      tweets: [],
      tweetCount: 2,
      isModalOpen: false
    }

    this.props.onLoadPageData(initialPageData);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.accessGranted && this.props.accessGranted) {
      if (isClient) {
        if (notificationPermission() === "default") {
          setTimeout(this.openModal, 4000)
        }
      }
    }
  }

  onSave = id => content => {
    this.props.onUpdatePageData("home", id, content);
  };

  onAccessCodeSubmit = e => {
    e.preventDefault()
    this.props.validateAccessCode(this.state.accessCode)
    this.setState({ accessCode: '' })
  }

  closeModal = () => {
    this.setState({ isModalOpen: false })
  }

  openModal = () => {
    this.setState({ isModalOpen: true })
  }

  render() {
    const content = this.props.pageData ? this.props.pageData.content : JSON.parse(this.props.data.pages.content);
    const showModalPrompt = isClient && notificationPermission() === "default"

    // ---------- LOCK SCREEN ------------

    if (!this.props.accessGranted) {
      return(
        <Layout theme="gray" location={this.props.location}>
          <EditableBackgroundImage
            classes="header-bg-image animate__animated animate__fadeIn"
            content={content["landing-bg-image"]}
            onSave={this.onSave("landing-bg-image")}
            uploadImage={uploadImage}
            styles={{ backgroundPosition: 'bottom' }}
          >
            <div className="" />
            <section id="landing" className="animate__animated animate__fadeIn">
              <Container maxWidth="lg" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <Grid container>
                  <Grid item md={8}>
                    <div className="mb-4">
                      <div className="text-white font-size-h4 mb-4 event-dates">
                        <EditableText content={content["landing-subtitle"]} onSave={this.onSave("landing-subtitle")} />
                      </div>
                    </div>
                    <div className="">
                      <h1 className="text-white"><EditableText content={content["landing-title"]} onSave={this.onSave("landing-title")} /></h1>
                    </div>
                  </Grid>
                </Grid>
                <Hidden smDown>
                <Grid container justify="flex-end">
                  <Grid item xs={12} md={8}>
                    <form onSubmit={this.onAccessCodeSubmit} autoComplete="off" className="login-form mt-10 mb-6 display-flex align-center justify-right">
                      <div className="help-text text-white text-bold">
                        <label htmlFor="access-code"><EditableText content={content["access-code"]} onSave={this.onSave("access-code")} /></label>
                      </div>
                      <input type="text" className="ml-2" id="access-code" name="access-code" onChange={e => this.setState({ accessCode: e.currentTarget.value })} />
                      <input type="submit" value="Enter site" className="btn ml-2" />
                    </form>
                  </Grid>
                </Grid>
                </Hidden>
              </Container>
            </section>
          </EditableBackgroundImage>
          <Hidden mdUp>
            <section id="login-mobile" className="bg-light">
              <Container>
                <Grid container justify="center">
                  <Grid item xs={12}>
                    <form onSubmit={this.onAccessCodeSubmit} autoComplete="off" className="login-form mt-10 mb-6 display-flex flex-column">
                      <div className="help-text text-white text-bold mb-2">
                        <label htmlFor="access-code"><EditableText content={content["access-code"]} onSave={this.onSave("access-code")} /></label>
                      </div>
                      <input type="text" className="ml-2" id="access-code" name="access-code" onChange={e => this.setState({ accessCode: e.currentTarget.value })} />
                      <input type="submit" value="Enter site" className="btn ml-2" />
                    </form>
                  </Grid>
                </Grid>
              </Container>
            </section>
          </Hidden>
        </Layout>
      )
    }

    // ----------------------

    return (
      <Layout theme="gray" location={this.props.location}>
        <EditableBackgroundImage
          classes="header-bg-image animate__animated animate__fadeIn"
          content={content["landing-bg-image"]}
          onSave={this.onSave("landing-bg-image")}
          uploadImage={uploadImage}
          styles={{ backgroundPosition: 'bottom' }}
        >
          <div className="" />
          <section id="landing" data-aos="fade-down">
            <Container maxWidth="lg" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <Grid container>
                <Grid item md={8}>
                  <div className="mb-4">
                      <div className="text-white font-size-h4 mb-4 event-dates">
                        <EditableText content={content["landing-subtitle"]} onSave={this.onSave("landing-subtitle")} />
                      </div>
                    </div>
                    <div className="">
                      <h1 className="text-white"><EditableText content={content["landing-title"]} onSave={this.onSave("landing-title")} /></h1>
                    </div>
                </Grid>
              </Grid>
            </Container>
          </section>
        </EditableBackgroundImage>

        <Section id="intro" className={`position-relative bg-white`}>
          <Grid container className="title" justify="flex-start" data-aos="fade-up">
            <Grid item xs={12} md={8}>
              <h2 className="text-dark">
                <EditableText content={content["intro-title"]} onSave={this.onSave("intro-title")} />
              </h2>
              <EditableParagraph classes="text-dark mb-3" content={content["intro-text"]} onSave={this.onSave("intro-text")} />
              {showModalPrompt &&
                <button
                  className="btn btn-primary mt-2 mb-2"
                  onClick={this.openModal}
                  >
                  Get notifications about community activity
                </button>
              }
            </Grid>
          </Grid>
        </Section>

        <Section id="program-elements">
          <Grid container>
            <Grid item xs={12} md={8}>
              <h2>
                <EditableText content={content["program-elements-title"]} onSave={this.onSave("program-elements-title")} />
              </h2>
              <p className="text-small text-bold">{`Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`}</p>
            </Grid>
            <ProgramElements />
          </Grid>
        </Section>
        <Section id="connecting-tree" className="bg-white text-black">
          <Grid container>
            <Grid item xs={12} md={8}>
              <div className="mb-4">
                <h2 className="text-bold">
                  <EditableText content={content["connecting-tree-title"]} onSave={this.onSave("connecting-tree-title")} />
                </h2>
                <div className="font-size-h4">
                  <EditableText content={content["connecting-tree-description"]} onSave={this.onSave("connecting-tree-description")} />
                </div>
              </div>
            </Grid>
            <EditableEmbeddedIframe content={content["connecting-tree"]} onSave={this.onSave("connecting-tree")} />
          </Grid>
        </Section>

        <Section id="participants">
          <Grid container>
            <Grid item md={8} className="mb-4">
              <h2 className="text-bold">
                <EditableText content={content["participants-title"]} onSave={this.onSave("participants-title")} />
              </h2>
              <EditableParagraph classes="font-size-h4" content={content["participants-description"]} onSave={this.onSave("participants-description")} />
            </Grid>
            <ParticipantGallery content={content["participants-collection"]} onSave={this.onSave("participants-collection")} />
          </Grid>
        </Section>

        <Section id="connect" className="bg-white text-black">
          <Grid container>
            <Grid item md={8}>
              <h2 className="text-bold">
                <EditableText content={content["connect-title"]} onSave={this.onSave("connect-title")} />
              </h2>
              <EditableParagraph classes="font-size-h4 mb-8" content={content["connect-description"]} onSave={this.onSave("connect-description")} />
            </Grid>
            <iframe
              src={ "https://embed.tlk.io/responsible-leaders" }
              frameBorder="0"
              height={ "460" }
              width={ "100%" }
              title={ "Chat" }
            />
          </Grid>
        </Section>

        <Section id="session-materials">
          <Grid container>
            <Grid item md={8} className="mb-4">
              <h2 className="text-bold">
                <EditableText content={content["gallery-title"]} onSave={this.onSave("gallery-title")} />
              </h2>
              <EditableParagraph classes="font-size-h4" content={content["gallery-description"]} onSave={this.onSave("gallery-description")} />
              <p className="text-small text-bold">{`Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`}</p>

            </Grid>
            <PastProgramElements />
          </Grid>
        </Section>

        <Dialog open={this.state.isModalOpen} onClose={this.closeModal} aria-labelledby="form-dialog-title" scroll="body">
            <DialogTitle id="form-dialog-title">
              <span className="text-bold font-size-h3">
                Would you like to get notifications about activity within this community?
              </span>
            </DialogTitle>
            <DialogContent>
              <p>We'd like to keep you informed about upcoming events, new content, and other opportunities to participate in this community as we grow and develop our regional network.</p>
              <p>This is completely optional and you can turn the notifications off at any time in your browser settings.</p>
            </DialogContent>
            <DialogActions>
              <button
                className="btn btn-primary mt-2 mb-2"
                onClick={() => {
                  this.closeModal()
                  if (isClient) {
                    requestPermissionForNotifications(this.props.showNotification)
                  }
                }}
                >
                Get notifications
              </button>
            </DialogActions>
          </Dialog>
      </Layout>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);

export const query = graphql`
  query {
    pages(id: { eq: "home" }) {
      id
      content
      title
      description
      slug
    }
  }
`;


