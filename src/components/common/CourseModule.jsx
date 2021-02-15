import React from "react";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import { Link } from "gatsby"
import T from "./Translation"
import { REFERENCE_URLS } from "../../utils/constants";


const CourseModule = ({ page, order, translations, currentLang }) => {
  const content = typeof(page.content) === "string" ? JSON.parse(page.content) : page.content
  const headerImageSrc = content.headerImage ? content.headerImage.imageSrc : null

  return (
    <Card variant="outlined" square={true} key={page.slug} className="my-20 course-module">
      <Grid container>
        <Hidden smDown>
        {
          headerImageSrc &&
          <Grid item xs={3}>
            <CardMedia
              image={headerImageSrc}
              title={"Header image"}
              style={{ height: '240px', width: '240px', backgroundPosition: 'left' }}
            />
          </Grid>
        }
        </Hidden>
        <Grid item xs={12} md={headerImageSrc ? 9 : 12} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <CardContent className="card-body">
            {
              !REFERENCE_URLS[page.id] &&
              <p><T id="module" />{` ${order}`}</p>
            }
            <h3>{page.title}</h3>
          </CardContent>
          <CardActions className="card-actions">
            <Button component={Link} to={page.slug} variant="contained" className="flr-btn">
              <T id="start_now" />
            </Button>
          </CardActions>
        </Grid>
      </Grid>
    </Card>
  );
};

export default CourseModule;
