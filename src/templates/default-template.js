import React from "react";
import { graphql } from "gatsby";
import Helmet from "react-helmet";
import Container from "@material-ui/core/Container"

import { connect } from "react-redux";
import { EditableImageUpload } from "react-easy-editables";
import { uploadImage } from "../firebase/operations";

import {
  updatePage,
  loadPageData,
  updateTitle,
  updateHeaderImage,
  saveSelectedTag,
} from "../redux/actions";

import Layout from "../layouts/default.js";
import DynamicSection from "../components/editing/DynamicSection";


const mapDispatchToProps = dispatch => {
  return {
    onUpdatePageData: (page, id, data) => {
      dispatch(updatePage(page, id, data));
    },
    onLoadPageData: data => {
      dispatch(loadPageData(data));
    },
    onUpdateTitle: title => {
      dispatch(updateTitle(title));
    },
    onUpdateHeaderImage: image => {
      dispatch(updateHeaderImage(image));
    },
    onSelectTag: selection => {
      dispatch(saveSelectedTag(selection))
    }
  };
};

const mapStateToProps = state => {
  return {
    pageData: state.page.data,
    orderedPages: state.pages.orderedPages,
    pages: state.pages.pages,
    currentLang: state.navigation.currentLang,
    tags: state.tags.tags
  };
};


class DefaultTemplate extends React.Component {
  constructor(props) {
    super(props)
    const initialPageData = {
      ...this.props.data.pages,
      content: JSON.parse(this.props.data.pages.content)
    };

    this.props.onLoadPageData(initialPageData);
  }

  onSave = id => content => {
    this.props.onUpdatePageData(this.props.data.pages.id, id, content);
  };

  onUpdateTitle = content => {
    this.props.onUpdateTitle(content.text)
  }

  onUpdateHeaderImage = content => {
    this.props.onUpdateHeaderImage(content)
  }

  render() {
    const pageData = this.props.pageData ? this.props.pageData : this.props.data.pages;
    const content = this.props.pageData ? this.props.pageData.content : JSON.parse(this.props.data.pages.content);
    const sections = content.sections && content.sections.length > 0 ? content.sections : [{ content: [] }];

    return (
      <Layout>
        <Helmet>
          <title>{pageData.title}</title>
          <meta description={pageData.description} />
        </Helmet>

        <Container maxWidth="md">
          <header className="module-header">
            <h1 className="underline">{pageData.title}</h1>
          </header>

        {content.headerImage &&
          <EditableImageUpload
            styles={{ container: {display: 'flex', marginBottom: '40px'} }}
            onSave={ this.onUpdateHeaderImage }
            uploadImage={ uploadImage }
            content={ content.headerImage || { imageSrc: null } }
            maxSize={1024 * 1024 * 12}
          />}
        </Container>

        {
          sections.map((section, index) => {
            if (!section || !section.content) {
              return null
            }

            return(
              <DynamicSection
                content={ section.content }
                sectionIndex={index}
                key={index}
                type={ section.type }
                sectionTag={ section.tag }
              />
            )
          })
        }
      </Layout>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DefaultTemplate);

export const query = graphql`
  query BasicPageQuery($slug: String!) {
    pages(slug: { eq: $slug }) {
      id
      content
      title
      description
      slug
      template
    }
  }
`;
