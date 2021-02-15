import React from "react";
import { Link } from "gatsby";
import { connect } from "react-redux";
import { StaticQuery, graphql } from "gatsby";

import {
  userLoggedIn,
  userLoggedOut,
} from "../redux/actions";

const styles = {
  button: {
    padding: '6px 25px',
  },
  fullWidth: {
    width: '100%'
  }
}


const Navigation = (props) => {
  const pages = props.pages.map(p => p.node);
  return (
    <div>
      <nav className="navbar no-margin-bottom">
        <div className="navigation-menu padding-two no-padding-top no-padding-bottom">
          <div className="row">
            <div className="col-lg-1 col-md-3 navbar-header">
              <button
                type="button"
                className="navbar-toggle collapsed"
                data-toggle="collapse"
                data-target="#bs-example-navbar-collapse-1"
              >
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar" />
                <span className="icon-bar" />
                <span className="icon-bar" />
              </button>
            </div>
            <div
              className="col-lg-5 col-md-6 col-sm-9 collapse navbar-collapse"
              id="bs-example-navbar-collapse-1"
              style={styles.fullWidth}
            >
              <ul className="nav navbar-nav">
                { pages.map(page => (
                  <li key={page.slug}>
                    <Link
                      to={`${page.slug}`}
                      className="inner-link text-medium"
                      data-scroll
                    >
                      {page.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

const NavigationComponent = props => (
  <StaticQuery
    query={graphql`
      query {
        allPages {
          edges {
            node {
              title
              slug
            }
          }
        }
      }
    `}
    render={data => (
      <Navigation {...props} pages={data.allPages.edges} />
    )}
  />
);


const mapStateToProps = state => {
  return {
    isLoggedIn: state.adminTools.isLoggedIn,
    showMenu: state.navigation.showMenu,
    user: state.adminTools.user,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    userLoggedIn: user => {
      dispatch(userLoggedIn(user));
    },
    userLoggedOut: () => {
      dispatch(userLoggedOut());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavigationComponent);

