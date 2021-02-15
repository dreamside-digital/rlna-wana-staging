import React from "react";
import { Link } from "gatsby";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from "react-redux";

import T from "../common/Translation"

const mapStateToProps = state => {
  return {
    orderedPages: state.pages.orderedPages,
    currentLang: state.navigation.currentLang,
    pageData: state.page.data,
    pages: state.pages.pages,
  };
};


const PopupNavigation = props => {
  const homePage = props.currentLang === "en" ? props.pages["nawl"] : props.pages["anfd"]
  const { anchorEl, closeMenu, orderedPages } = props;
  return (
    <Menu
      id="toc"
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={closeMenu}
      className="table-of-contents"
      keepMounted
      elevation={0}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
    >
      <MenuItem className="navigation-module" component={Link} to={homePage ? homePage.slug : '/'}>
        <div className="title">
          <T id="home" />
        </div>
      </MenuItem>
      {
        orderedPages.map((page, index) => (
          <MenuItem className="navigation-module" key={page.id} component={Link} to={page.slug}>
            <div className="title">
              {page.title}
            </div>
          </MenuItem>
        ))
      }
    </Menu>
  );
}

export default connect(mapStateToProps, null)(PopupNavigation);
