import React from "react";

import {
  RichTextEditor,
  Editable
} from 'react-easy-editables';


class QuestionEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { content: this.props.content };
  }

  handleEditorChange = field => item => {
    this.setState({
      content: {
        ...this.state.content,
        [field]: {
          ...item
        }
      }
    });
  }

  render() {
    const { content } = this.state;

    return(
      <div className={`question-item ${this.props.classes}`}>
        <div className="question-body">
          <RichTextEditor
            content={content["question-item-text"]}
            handleEditorChange={this.handleEditorChange("question-item-text")}
          />
        </div>
      </div>
    )
  }
}

const Question = props => {

  const content = props.content || {};

  const handleSave = newContent => {
    props.onSave(newContent)
  }

  return (
    <Editable
      Editor={QuestionEditor}
      handleSave={handleSave}
      content={content}
      {...props}
    >
      <div className={`question-item ${props.classes}`}>
        <div className="question-body">
          <div className={"underline-sm"} dangerouslySetInnerHTML={ {__html: content["question-item-text"]["text"]} } />
        </div>
      </div>
    </Editable>
  );
};

Question.defaultProps = {
  content: {
    "question-item-text": { "text": "Discussion question" },
  },
  classes: "",
  onSave: () => { console.log('implement a function to save changes') }
}

export default Question;
