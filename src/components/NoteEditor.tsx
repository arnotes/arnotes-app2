import React, { Component, Dispatch } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ReactQuill from 'react-quill';
import { StoreState } from '../redux/store-state';
import { Paper } from '@material-ui/core';
import { Subject } from 'rxjs';

interface Props extends StoreState{

}

interface State{
  dispatch?:Dispatch<any>;
}

class NoteEditor extends Component<Props, State> {

  sbjChange = new Subject();

  render() {
    const { selectedNote } = this.props;
    return (
      <div className="note-editor-component">
        <Paper square>
          <br/>
          &nbsp;&nbsp; here here
          <br/>
          &nbsp;&nbsp; here here
          <br/>
        </Paper>
        <Paper classes={({root:"quill-paper-wrapper"})} square >
          <ReactQuill value={selectedNote? selectedNote.Body:''} placeholder="write your notes :)" theme="snow"></ReactQuill>
        </Paper>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  ...state
})

const mapDispatchToProps = (dispatch: any) => {
  dispatch:dispatch
}

export default connect(mapStateToProps, mapDispatchToProps)(NoteEditor)
