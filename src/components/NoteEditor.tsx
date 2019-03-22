import React, { Component, Dispatch } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ReactQuill from 'react-quill';
import { StoreState } from '../redux/store-state';
import { Paper, TextField, Typography, Button, IconButton, Hidden, CircularProgress } from '@material-ui/core';
import { Subject } from 'rxjs';
import { IReduxAction, ReduxAction } from '../redux/redux-action.class';
import { ActionTypes } from '../redux/action-types';
import { INote } from '../models/note.interface';
import { async } from 'q';
import { databaseSvc } from '../services/database.service';
import { debounceTime } from 'rxjs/operators';

interface Props extends StoreState{
  dispatch?:<T>(action:IReduxAction<T>)=>any;
}

interface State{
  loading?:boolean;
}

class NoteEditor extends Component<Props, State> {

  constructor(p){
    super(p);
    this.state = {};
  }

  sbjChange = new Subject();

  componentWillMount(){
    this.sbjChange.pipe(debounceTime(500))
      .subscribe(async ()=>{
        await databaseSvc.updateItem('notes', this.props.selectedNote);
        this.setState({...this.state,loading:false});
      });
  }

  onCloseNote = ()=>{
    this.props.dispatch(new ReduxAction(ActionTypes.SET_SELECTED_NOTE, null).value);
  }

  onDeleteNote = async (noteToDelete:INote)=>{
    await databaseSvc.removeItem('notes',noteToDelete);
    const newNoteList = this.props.notes.filter(n => n.ID!=noteToDelete.ID);
    this.props.dispatch(new ReduxAction(ActionTypes.SET_NOTE_LIST, newNoteList).value);
    this.onCloseNote();
  }

  onTitleChange(title:string){
    const note = this.props.selectedNote;
    note.Title = title;
    this.props.dispatch(new ReduxAction(ActionTypes.SET_SELECTED_NOTE, note).value);
    this.sbjChange.next();
    this.setState({...this.state,loading:true});
  }

  onBodyChange(body:string){
    const note = this.props.selectedNote;
    note.Body = body;
    this.props.dispatch(new ReduxAction(ActionTypes.SET_SELECTED_NOTE, note).value);
    this.sbjChange.next();
    this.setState({...this.state,loading:true});
  }

  render() {
    const { selectedNote } = this.props;
    return (
      <div className="note-editor-component">
        <Paper square>
          <div className="title-wraper">
            <TextField id="txt-note-title" onChange={e=>this.onTitleChange(e.target.value)} classes={({root:'txt-title'})} disabled={!selectedNote} label="Title" value={selectedNote? selectedNote.Title:''}></TextField>
            <IconButton disabled={!selectedNote} onClick={this.onCloseNote} color="default">
              <i style={({fontSize:'20px'})} className="fas fa-times-circle"></i>
            </IconButton>
            <CircularProgress className={"editor-save-progress "+(!this.state.loading && "hidden")} />
          </div>
        </Paper>
        <Paper classes={({root:"quill-paper-wrapper"})} square >
          <ReactQuill onChange={e=>this.onBodyChange(e)} readOnly={!selectedNote} value={selectedNote? selectedNote.Body:''} placeholder="write your notes :)" theme="snow"></ReactQuill>
          <IconButton onClick={e=>this.onDeleteNote(this.props.selectedNote)} classes={({root:"delete-btn "+(!selectedNote&&"hidden")})}>
            <i style={({fontSize:'20px'})} className="fas fa-trash-alt"></i>
          </IconButton>
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
