import React from "react";
import Grid from '@material-ui/core/Grid';
import AddIcon from "@material-ui/icons/Add"

import Layout from "../layouts/default.js";
import Section from "../components/common/Section"


const SessionProposalPage = props => {
    const subject = encodeURIComponent('Session proposal')
    const body = encodeURIComponent('Please provide the following information to propose a session. \n\nSession title: \nSession description: \nProposed date and time: \nAny other comments?\n')

    return (
      <Layout theme="gray" location={props.location}>
        <Section id="intro" className={`position-relative bg-white`}>
          <Grid container className="title" justify="flex-start" data-aos="fade-up">
            <Grid item md={8}>
              <h1 className="text-dark">Propose a Session</h1>
              <p>If you are interested in hosting a session for Responsible Leaders Network WANA 2021, please reach out to us at <span className="text-bold">wana@bmw-foundation.org</span> and include the following information in your email.</p>
              <ul>
                <li>Session title</li>
                <li>Session description</li>
                <li>Proposed date and time</li>
                <li>Any other comments</li>
              </ul>

              <p>Alternatively, you can use the email template below which will open in your default email client.</p>

              <a href={`mailto:wana@bmw-foundation.org?subject=${subject}&body=${body}`} className="add-item-btn">
                <div className="icon-btn">
                  <AddIcon />
                </div>
                <span className="pretty-link">Use the email template</span>
              </a>
            </Grid>
          </Grid>
        </Section>
      </Layout>
    );
  }

export default SessionProposalPage;



