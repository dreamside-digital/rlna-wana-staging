import React from "react";
import { connect } from "react-redux";
import { orderBy } from 'lodash';

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Paper from '@material-ui/core/Paper';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';

import T from "./Translation"

import { saveSelectedTag, closeTagSelectorModal, showNotification } from '../../redux/actions';

const mapStateToProps = state => {
  return {
    openModal: state.tags.openModal,
    tags: state.tags.tags,
    selectedTag: state.tags.selectedTag,
    currentLang: state.navigation.currentLang,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onCloseTagSelectorModal: () => {
      dispatch(closeTagSelectorModal())
    },
    onSelectTag: selection => {
      dispatch(saveSelectedTag(selection))
      dispatch(showNotification(`Showing content for ${selection ? selection.label.en : 'all provinces and territories'}`))
      dispatch(closeTagSelectorModal())
    }
  };
};


const TagSelectorModal = props => {
  const { selectedTag, tags, onSelectTag, currentLang, openModal, onCloseTagSelectorModal } = props;
  const orderedTags = orderBy(tags, tag => tag.label[currentLang]);

  const handleSelect = tag => () => {
    onSelectTag(tag);
  }

  return(
    <Dialog open={openModal} onClose={onCloseTagSelectorModal} aria-labelledby="tag-selector-dialogue" className="tag-selector-modal">
      <DialogContent style={{ padding: '0 10px' }}>
        <h3 className="subheading" id="tag-selector-dialogue">
          <T id="what_province" defaultText="What province are you in?" />
        </h3>
        <Paper elevation={0}>
          <MenuList
            id="tag-selector"
            role="menu"
            className="tag-selector text-center"
          >
          {
            orderedTags.map((tag, index) => {
              const selectedClass = tag === selectedTag ? "selected" : ""
              return (
                <MenuItem onClick={handleSelect(tag)} key={tag.value} className={`navigation-module ${selectedClass}`}>
                  {tag.label[currentLang]}
                </MenuItem>
              )
            })
          }
          <MenuItem onClick={handleSelect(null)} className={`navigation-module ${selectedTag ? '' : 'selected'}`}>
            <T id="all_tags" />
          </MenuItem>
          </MenuList>
        </Paper>
      </DialogContent>
    </Dialog>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(TagSelectorModal);
