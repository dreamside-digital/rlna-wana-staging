import React, { useState } from "react";
import { connect } from "react-redux";
import { useStaticQuery, graphql } from "gatsby"
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';

import {
  validateAccessCode,
  showNotification,
  loadPageData,
  updatePage
} from "../redux/actions";

import {
  EditableText,
  EditableBackgroundImage,
} from "react-easy-editables";


import Layout from "../layouts/default.js";

import { uploadImage } from '../firebase/operations';

const mapDispatchToProps = dispatch => {
  return {
    validateAccessCode: (code) => {
      dispatch(validateAccessCode(code));
    },
    showNotification: (msg) => {
      dispatch(showNotification(msg));
    },
    onLoadPageData: data => {
      dispatch(loadPageData(data));
    },
    onUpdatePageData: (page, id, data) => {
      dispatch(updatePage(page, id, data));
    },
  };
};

const mapStateToProps = state => {
  return {
    pageData: state.page.data,
    accessGranted: state.adminTools.accessGranted,
  };
};


const PasswordPage = ({
  pageData,
  accessGranted,
  showNotification,
  validateAccessCode,
  children,
  onLoadPageData,
  onUpdatePageData,
  location
}) => {

  const data = useStaticQuery(graphql`
    query PasswordPageQuery {
      pages(id: { eq: "home" }) {
        id
        content
        title
        description
        slug
      }
    }
  `)
  const [accessCode, setCode] = useState('')

  const onAccessCodeSubmit = e => {
    e.preventDefault()
    validateAccessCode(accessCode)
    setCode('')
  }

  const content = JSON.parse(data.pages.content);

  const onSave = id => content => {
    onUpdatePageData("home", id, content);
  };

  if (accessGranted) {
    return <div>{children}</div>
  }

  // ---------- LOCK SCREEN ------------
  return(
    <Layout theme="gray" location={location}>
      <EditableBackgroundImage
        classes="header-bg-image animate__animated animate__fadeIn"
        content={content["landing-bg-image"]}
        onSave={onSave("landing-bg-image")}
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
                    <EditableText content={content["landing-subtitle"]} onSave={onSave("landing-subtitle")} />
                  </div>
                </div>
                <div className="">
                  <h1 className="text-white"><EditableText content={content["landing-title"]} onSave={onSave("landing-title")} /></h1>
                </div>
              </Grid>
            </Grid>
            <Hidden smDown>
            <Grid container justify="flex-end">
              <Grid item xs={12} md={8}>
                <form onSubmit={onAccessCodeSubmit} autoComplete="off" className="login-form mt-10 mb-6 display-flex align-center justify-right">
                  <div className="help-text text-white text-bold">
                    <label htmlFor="access-code"><EditableText content={content["access-code"]} onSave={onSave("access-code")} /></label>
                  </div>
                  <input type="text" className="ml-2" id="access-code" name="access-code" onChange={e => setCode(e.currentTarget.value)} />
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
                <form onSubmit={onAccessCodeSubmit} autoComplete="off" className="login-form mt-10 mb-6 display-flex flex-column">
                  <div className="help-text text-white text-bold mb-2">
                    <label htmlFor="access-code"><EditableText content={content["access-code"]} onSave={onSave("access-code")} /></label>
                  </div>
                  <input type="text" className="ml-2" id="access-code" name="access-code" onChange={e => setCode(e.currentTarget.value)} />
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

export default connect(mapStateToProps, mapDispatchToProps)(PasswordPage);


