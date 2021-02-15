import React from "react";
import T from "../common/Translation"

const NavigationModule = ({ page, order }) => {
  return (
    <MenuItem className="navigation-module">
      <div className="title">
        <a tabIndex={0} href={page.slug}><T id="module" />{` ${order}: ${page.title}`}</a>
      </div>
    </MenuItem>
  );
};

export default NavigationModule;
