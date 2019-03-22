import React, { Component, Dispatch } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ReactQuill from 'react-quill';
import { StoreState } from '../redux/store-state';
import { Paper, TextField, Typography, Button, IconButton } from '@material-ui/core';
import { Subject } from 'rxjs';
import { IReduxAction, ReduxAction } from '../redux/redux-action.class';
import { ActionTypes } from '../redux/action-types';

interface Props extends StoreState{
  dispatch?:<T>(action:IReduxAction<T>)=>any;
}

interface State{
  
}

class NoteEditor extends Component<Props, State> {

  sbjChange = new Subject();

  onCloseNote = ()=>{
    this.props.dispatch(new ReduxAction(ActionTypes.SET_SELECTED_NOTE, null).value);
  }

  render() {
    const { selectedNote } = this.props;
    return (
      <div className="note-editor-component">
        <Paper square>
          <div className="title-wraper">
            <TextField id="txt-note-title" classes={({root:'txt-title'})} disabled={!selectedNote} label="Title" value={selectedNote? selectedNote.Title:''}></TextField>
            <IconButton disabled={!selectedNote} onClick={this.onCloseNote} color="default">
              <i style={({fontSize:'20px'})} className="fas fa-times-circle"></i>
            </IconButton>
          </div>
        </Paper>
        <Paper classes={({root:"quill-paper-wrapper"})} square >
          <ReactQuill readOnly={!selectedNote} value={selectedNote? selectedNote.Body:''} placeholder="write your notes :)" theme="snow"></ReactQuill>
        </Paper>
      </div>
    )
  }
}

const mapStateToProps = (state: any) => ({
  ...state
})

const mapDispatchToProps = (dispatch: any) => ({dispatch})

export default connect(mapStateToProps, mapDispatchToProps)(NoteEditor)
