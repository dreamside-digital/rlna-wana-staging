import React from "react";
import { EditableText, EditableBackgroundImage, EditableParagraph, EditableLink } from "react-easy-editables";
import { uploadImage } from "../../firebase/operations";
import Branch from "../../assets/images/branch_dark_blue.svg";

const defaultHeader = "https://firebasestorage.googleapis.com/v0/b/tru-web.appspot.com/o/images%2Fimperial-oil.jpg?alt=media&token=f9072b5c-161a-4bd8-bd61-b3ad3b9c5853";

const PageHeader = ({ onSave, content, title, headerImage, onUpdateTitle, onUpdateHeaderImage }) => {
  return (
    <EditableBackgroundImage
      classes="breadcrumb-area d-flex pt-160 pb-80 align-items-center home-page-header bg-dark"
      onSave={ onUpdateHeaderImage }
      uploadImage={ uploadImage }
      content={ headerImage || { imageSrc: defaultHeader} }
      styles={{ paddingTop: "4.5%", paddingBottom: "4.5%"}}
    >
      <div className="container">
        <div className="row">
          <div className="col-xl-8 col-md-8 col-sm-10 col-xs-10 bg-header">
            <div className="col-xl-10 md bg-landingpage">
            </div>
            <div className="col-xl-10 pt-20 pb-20 pl-30 pr-30 mb-20" data-animation="fadeInUp" data-delay=".3s">
              <h1 data-animation="fadeInUp" data-delay=".5s">
                <EditableText content={{ text: title }} onSave={ onUpdateTitle } />
              </h1>
              <div className="pb-10">
                <img src={Branch} style={{ width: "180px", maxWidth: "100vw" }} />
              </div>
              <h2>
                <EditableText content={ content["header-subtitle"] } handleSave={ onSave("header-subtitle") } placeholder="Subtitle" />
              </h2>
              <EditableParagraph content={ content["intro-description"]} handleSave={ onSave("intro-description") }/>
              <EditableLink classes={"mt-20"} content={content["intro-more-btn"]} handleSave={onSave("intro-more-btn")} />

          </div>
          </div>
        </div>
      </div>

    </EditableBackgroundImage>
  );
};


PageHeader.defaultProps = {
  content: {
    "header-subtitle": {
      "text": ""
    }
  },
  headerImage: {
    "imageSrc": defaultHeader
  }
}

export default PageHeader
