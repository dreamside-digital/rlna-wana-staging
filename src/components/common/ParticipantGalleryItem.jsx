import React, {useState} from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import TwitterIcon from '@material-ui/icons/Twitter';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import LanguageIcon from '@material-ui/icons/Language';
import ensureAbsoluteUrl from '../../utils/ensureAbsoluteUrl';

const DEFAULT_IMAGE = '/default-profile-image.jpg'

const ParticipantGalleryItem = ({ id, content={} }) => {
  const [ isOpen, setIsOpen ] = useState(false)
  const profileImage = content.image?.imageSrc || DEFAULT_IMAGE

  return (
    <>
      <button className="participant" onClick={() => setIsOpen(true)}>
        <div className="participant-image">
          <div className="participant-image-container">
            <img src={profileImage} alt={content.image?.title}/>
          </div>
        </div>
        <div className="participant-name pretty-link">
          {content.name}
        </div>
        <div className="participant-affiliate-organization">
          {content.affiliateOrganization}
        </div>
      </button>
      <Dialog maxWidth="sm" fullWidth open={isOpen} PaperProps={{ square: true }} onClose={() => setIsOpen(false)}>
        <DialogContent className="participant-modal">
          <Grid container className="position-relative" alignItems="center">
            <Grid item xs={12} sm={4}>
              <div className="participant-image-lg">
                <img src={profileImage} alt={content.image?.title}/>
              </div>
            </Grid>
            <Grid item xs={12} sm={8}>
              <h2 className="font-size-h2">{content.name}</h2>
              <div className="participant-affiliate-organization">{content.affiliateOrganization}</div>
              <div className="participant-affiliate-organization">{content.country}</div>
              {
                (content.linkedin || content.twitter || content.website) &&
                <div className="links">
                  {
                    content.linkedin &&
                    <a href={ensureAbsoluteUrl(content.linkedin)} target="_blank" rel="noopener noreferrer">
                      <LinkedInIcon />
                    </a>
                  }
                  {
                    content.twitter &&
                    <a href={ensureAbsoluteUrl(content.twitter)} target="_blank" rel="noopener noreferrer">
                      <TwitterIcon />
                    </a>
                  }
                  {
                    content.website &&
                    <a href={ensureAbsoluteUrl(content.website)} target="_blank" rel="noopener noreferrer">
                      <LanguageIcon />
                    </a>
                  }
                </div>
              }
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={12}>
              {content.question1 &&
                <>
                  <h4>What projects/activities do you lead or are you involved in that express your Responsible Leadership?</h4>
                  <div>{content.question1}</div>
                </>
              }

              {
                content.question2 &&
                <>
                  <h4>What SDG(s) do these projects or initiatives address?</h4>
                  <div>{content.question2}</div>
                </>
              }

              {
                content.question3 &&
                <>
                  <h4>What are you passionate about? And/or: What are your hobbies?</h4>
                  <div>{content.question3}</div>
                </>
              }
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
