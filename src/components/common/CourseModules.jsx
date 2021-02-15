import React from "react";
import { connect } from "react-redux";

import CourseModule from "./CourseModule"

const mapStateToProps = state => {
  return {
    orderedPages: state.pages.orderedPages,
    translations: state.translations,
    currentLang: state.navigation.currentLang,
  };
};


const CourseModules = props => (
  props.orderedPages.map((page, index) => {
    return <CourseModule page={page} order={index + 1} key={page.id} {...props} />
  })
)


export default connect(mapStateToProps, null)(CourseModules);
