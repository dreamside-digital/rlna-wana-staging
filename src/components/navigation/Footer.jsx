import React from "react";
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';


const Footer = () => (
  <footer className="bg-gray" id="footer">
    <Container>
      <Grid container justify="space-between">
        <Grid item md={6}>
          <p className="m-0"><a href="https://bmw-foundation.org/privacy-policy/" target="_blank" rel="noopener noreferrer" className="pretty-link text-white">Privacy Policy</a></p>
        </Grid>
        <Grid item md={6}>
          <p className="m-0 text-right">For further questions, please <a href="mailto:wana@bmw-foundation.org" className="pretty-link text-white">contact our team</a>.</p>
        </Grid>
      </Grid>
    </Container>
  </footer>
)

export default Footer;
