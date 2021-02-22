import React from "react";
import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"
import { connect } from "react-redux";
import { fetchMaterials, saveMaterial, removeMaterial } from "../../redux/actions"

import SessionMaterialsItem from "./SessionMaterialsItem"
import BreakpointMasonry from "./BreakpointMasonry"

const mapStateToProps = state => {
  return {
    isEditingPage: state.adminTools.isEditingPage,
    materials: state.materials.materials
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchMaterials: () => {
      dispatch(fetchMaterials());
    },
    saveMaterial: (id, material) => {
      dispatch(saveMaterial(id, material));
    },
    removeMaterial: (id) => {
      dispatch(removeMaterial(id));
    },
  };
};


class SessionMaterials extends React.Component {
  constructor(props) {
    super(props)
    this.props.fetchMaterials()
  }

  onSaveItem = itemId => itemContent => {
    this.props.saveMaterial(itemId, itemContent)
  }

  onDeleteItem = itemId => () => {
    this.props.removeMaterial(itemId)
  }

  onAddItem = () => {
    const newItemKey = `material-${Date.now()}`
    const newItem = {
      "title": "",
      "author": "",
      "details": "",
      id: newItemKey,
      event: this.props.eventId
    }

    this.props.saveMaterial(newItemKey, newItem)
  }

  render() {
    const itemsKeys = Object.keys(this.props.materials).reverse()
    const materialsArr = itemsKeys.map(key => this.props.materials[key]).filter(m => m.event === this.props.eventId)

    if (!materialsArr.length) {
      return null
    }

    return (
      <>
        <h2>Session Materials</h2>
        <div className={`collection width-100 mt-6 ${this.props.classes}`}>
          {
            this.props.isEditingPage &&
            <div className="row mb-4">
              <div className="col-12">
                <Button onClick={this.onAddItem} color="default" variant="contained">Add item</Button>
              </div>
            </div>
          }
          <BreakpointMasonry>
            {materialsArr.map((material,index) => {
              const content = material;
              return(
                <SessionMaterialsItem
                  index={index}
                  content={content}
                  onSave={this.onSaveItem(material.id)}
                  onDelete={this.onDeleteItem(material.id)}
                  key={material.id}
                />
              )
            })}
          </BreakpointMasonry>
        </div>
      </>
    );
  }
}

SessionMaterials.defaultProps = {
  content: {},
  classes: "",
  onSave: () => { console.log('Implement a function to save changes') }
}

export default connect(mapStateToProps, mapDispatchToProps)(SessionMaterials)

