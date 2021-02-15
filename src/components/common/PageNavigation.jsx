import React, { Component } from "react";
import { connect } from "react-redux";
import Collapsible from 'react-collapsible';
import { StaticQuery, Link, graphql } from "gatsby";
import { find } from "lodash"
import Grid from "@material-ui/core/Grid";
import ArrowRight from "@material-ui/icons/ArrowForward"
import ArrowLeft from "@material-ui/icons/ArrowBack"
import Container from "./Container";

import defaultImage from "../../assets/images/imperial-oil.jpg";


const mapStateToProps = state => {
  return {
    currentPage: state.page.data,
  };
};

const ArticlePreview = ({ article, topics, categories, direction }) => {
  if (!article) {
    return null
  }

  const category = categories[article.category]
  const image = article.header_image ? article.header_image.imageSrc : defaultImage;
  const tags = article.topics || [];
  const tagsString = tags.map(tag => topics[tag]).join(", ")

  return(
    <div className={`col-md-6 mt-40 mb-40 ${direction == "prev" ? "d-none d-md-block" : ""}`}>
      <Link to={`${article.slug}`}>
        <div className={`card mb-4 mb-md-0 ${direction}`}>
          {
            direction == "next" ?
            <div className="card-header">
              <h5 className="mb-0">Next Page</h5>
              <ArrowRight className="ml-1" />
            </div> :
            <div className="card-header">
              <ArrowLeft className="mr-1" />
              <h5 className="mb-0">Previous Page</h5>
            </div>
          }
          <div className="card-image">
            <img src={image} />
          </div>
          <div className="card-body">
            { category && <h5 className="topics">{ category.label }</h5> }
            <h4 className="">{ article.title }</h4>
            <p className="mb-0 topics">{ tagsString }</p>
          </div>
        </div>
      </Link>
    </div>
  )
}


class PageNavigationInner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pages: this.props.pages,
    }
  }

  sortPages = pages => {
    return pages.sort((a, b) => (a.order - b.order));
  }

  filterPagesByTopic = pages => {
    if (this.props.selectedTopics) {
      return pages.filter(page => page.topics && page.topics.includes(this.props.selectedTopics.id));
    }

    return pages;
  }

  filterPagesByCategory = (pages, category) => {
    return pages.filter(page => page.category === category.id);
  }

  nextCategory = category => {
    return this.props.categories[category.next];
  }

  prevCategory = category => {
    return this.props.categories[category.prev];
  }

  nextPage = page => {
    let nextPage = this.props.pages[page.next]

    if (nextPage) {
      return nextPage
    }

    const currentCategory = this.props.categories[page.category]

    if (!currentCategory) {
      return null
    }

    const nextCategory = this.nextCategory(currentCategory)
    if (nextCategory) {
      nextPage = find(this.props.pages, page => { return (page.category === nextCategory.id) && !page.prev})
    }

    if (nextPage) {
      return nextPage
    }

    return null
  }

  prevPage = page => {
    let prevPage = this.props.pages[page.prev]

    if (prevPage) {
      return prevPage
    }

    const currentCategory = this.props.categories[page.category]

    if (!currentCategory) {
      return null
    }

    const prevCategory = this.prevCategory(currentCategory)
    if (prevCategory) {
      prevPage = find(this.props.pages, page => { return (page.category === prevCategory.id) && !page.next})
    }

    if (prevPage) {
      return prevPage
    }

    return null
  }

  orderedCategories = (category, arr=[]) => {
    if (!category) {
      return arr
    }

    arr.push(category)
    return this.orderedCategories(this.nextCategory(category), arr)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedTopics != this.props.selectedTopics) {
      if (this.props.selectedTopics) {
        const topicId = this.props.selectedTopics.id
        const filteredPages = this.props.pages.filter(page => page.topics && page.topics.includes(topicId))
        return this.setState({ pages: filteredPages })
      }

      return this.setState({ pages: this.props.pages })
    }
   }

  render() {
    const nextPage = this.nextPage(this.props.currentPage)
    const prevPage = this.prevPage(this.props.currentPage)

    return(
      <div className="row">
        <ArticlePreview article={prevPage} topics={this.props.topics} categories={this.props.categories} direction="prev" />
        <ArticlePreview article={nextPage} topics={this.props.topics} categories={this.props.categories} direction="next" />
      </div>
    )
  }
}

const PageNavigation = props => (
  <StaticQuery
    query={graphql`
      query {
        allPages {
          edges {
            node {
              id
              title
              slug
            }
          }
        }
      }
    `}
    render={data => {
      const pagesArr = data.allPages.edges.map(edge => edge.node);
      const pages = pagesArr.reduce((obj, page) => {
        obj[page.id] = page
        return obj
      }, {})

      return <PageNavigationInner {...props} pages={pages} />
    }}
  />
);


export default connect(mapStateToProps, null)(PageNavigation);