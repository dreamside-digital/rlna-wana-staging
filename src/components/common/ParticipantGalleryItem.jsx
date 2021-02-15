import React, {useState} from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import TwitterIcon from '@material-ui/icons/Twitter';
import InstagramIcon from '@material-ui/icons/Instagram';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import LanguageIcon from '@material-ui/icons/Language';

const ParticipantGalleryItem = props => {
  const [ isOpen, setIsOpen ] = useState(false)

  const content = props.content || {};

  return (
    <>
      <button className="participant" onClick={() => setIsOpen(true)}>
        <div className="participant-image">
          <div className="participant-image-container">
            <img src={content.image?.imageSrc} alt={content.image?.title}/>
          </div>
        </div>
        <div className="participant-name pretty-link">
          {content.name}
        </div>
        <div className="participant-affiliate-organization">
          {content.affiliateOrganization}
        </div>
      </button>
      <Dialog maxWidth="sm" fullWidth open={isOpen} PaperProps={{square: true}} onClose={() => setIsOpen(false)}>
        <DialogContent className="participant-modal">
          <Grid container className="position-relative" alignItems="center">
            <Grid item xs={12} sm={4}>
              <div className="participant-image-lg">
                <img src={content.image?.imageSrc} alt={content.image?.title}/>
              </div>
            </Grid>
            <Grid item xs={12} sm={8}>
              <h2 className="font-size-h2">{content.name}</h2>
              <div className="participant-affiliate-organization">{content.affiliateOrganization}</div>
              {
                (content.linkedin || content.twitter || content.instagram || content.website) &&
                <div className="links">
                  {
                    content.linkedin &&
                    <a href={content.linkedin} target="_blank" rel="noopener noreferrer">
                      <LinkedInIcon />
                    </a>
                  }
                  {
                    content.twitter &&
                    <a href={content.twitter} target="_blank" rel="noopener noreferrer">
                      <TwitterIcon />
                    </a>
                  }
                  {
                    content.instagram &&
                    <a href={content.instagram} target="_blank" rel="noopener noreferrer">
                      <InstagramIcon />
                    </a>
                  }
                  {
                    content.website &&
                    <a href={content.website} target="_blank" rel="noopener noreferrer">
                      <LanguageIcon />
                    </a>
                  }
                </div>
              }
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={12}>
              <div className="mt-5" dangerouslySetInnerHTML={{__html: content.description}}/>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

ParticipantGalleryItem.defaultProps = {
  content: {},
  classes: "",
  onSave: () => { console.log('implement a function to save changes') }
}

export default ParticipantGalleryItem;
