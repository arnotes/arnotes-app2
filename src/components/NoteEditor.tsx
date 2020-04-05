import React, { Component, Dispatch, createRef } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Editor } from '@tinymce/tinymce-react';
import { StoreState } from '../redux/store-state';
import { Paper, TextField, Typography, Button, IconButton, Hidden, CircularProgress, Icon, FormControlLabel, Switch } from '@material-ui/core';
import { Subject } from 'rxjs';
import { IReduxAction, ReduxAction } from '../redux/redux-action.class';
import { ActionTypes } from '../redux/action-types';
import { INote } from '../models/note.interface';
import { async } from 'q';
import { databaseSvc } from '../services/database.service';
import { debounceTime } from 'rxjs/operators';

import { toast } from 'react-toastify';

interface Props extends StoreState{
  dispatch?:<T>(action:IReduxAction<T>)=>any;
  notes?:INote[];
}

interface State{
  loading?:boolean;
  title?:string;
  body?:string;
  readonly?: boolean;
}

class NoteEditor extends Component<Props, State> {

  constructor(p){
    super(p);
    this.state = {};
  }

  sbjChange = new Subject<{title:string,body:string,readonly:boolean}>();
  //quillRef = createRef<ReactQuill>();

  currentNoteID:string = null;

  componentWillMount(){
    this.sbjChange.pipe(debounceTime(500))
      .subscribe(async ()=>{
        this.props.dispatch(new ReduxAction(ActionTypes.SET_SELECTED_NOTE, this.props.selectedNote).value);
        this.props.dispatch(new ReduxAction(ActionTypes.SET_NOTE_LIST, [...this.props.notes]).value);
        await databaseSvc.updateItem('notes', this.props.selectedNote);
        this.setState({...this.state,loading:false});
      });
  }

  componentWillReceiveProps(a,b){
    const prop = a as Props;
    const upcomingNoteID = prop.selectedNote && prop.selectedNote.ID || null;
    if(this.currentNoteID != upcomingNoteID){
      this.setState({...this.state,title:null,body:null,readonly:null});
    }
    this.currentNoteID = prop.selectedNote && prop.selectedNote.ID || null;
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
    this.sbjChange.next({title:this.state.title, body:this.state.body, readonly:this.state.readonly});
    this.setState({...this.state,loading:true,title:title});
  }

  onBodyChange = (text:string) => {
    // if(source!="user"){
    //   return;
    // }
    //const text = ev.level.content;
    const note = this.props.selectedNote;
    note.Body = text;
    this.sbjChange.next({title:this.state.title, body:this.state.body, readonly:this.state.readonly});
    this.setState({...this.state,loading:true,body:text});
  }

  onReadOnlyChange(isReadOnlyChecked:boolean){
    const note = this.props.selectedNote;
    note.IsReadOnly = isReadOnlyChecked;
    this.sbjChange.next({title:this.state.title, body:this.state.body, readonly:this.state.readonly });
    this.setState({...this.state,loading:true,readonly:isReadOnlyChecked});
  }

  copyClipboard = () => {
    //const text =this.quillRef.current.getEditor().getText();
    var copyhelper = document.createElement("input");
    copyhelper.className = 'copyhelper'
    document.body.appendChild(copyhelper);
    //copyhelper.value = text;
    copyhelper.select();
    document.execCommand("copy");
    document.body.removeChild(copyhelper);    
    toast.info(`"${this.props.selectedNote.Title}" copied to clipboard.`, { position:"bottom-right", hideProgressBar:true, autoClose:2500 });
  }

  render() {
    const { selectedNote } = this.props;
    let { title,body,readonly } = this.state;
    if(title==null){
      title = selectedNote && selectedNote.Title || "";
    }    

    if(body==null){
      body = selectedNote && selectedNote.Body || "";
    }    

    if(readonly==null){
      readonly = selectedNote && selectedNote.IsReadOnly || false;
    }

    return (
      <div className={"note-editor-component"}>
        <div className={"empty-editor-wrapper "+(selectedNote && "hidden")}>
          <div className={"empty-editor-paper"}>
            <div>
              <Icon>
                <i className="backdrop-icon fas fa-book"></i>
              </Icon>
            </div>
          </div>        
        </div> 
        <Paper classes={({root:(!selectedNote && "hidden")})} square>
          <div className="title-wraper">
            <TextField id="txt-note-title" 
              label="Title" 
              onChange={e=>this.onTitleChange(e.target.value)} 
              classes={({root:'txt-title'})} 
              disabled={!selectedNote} 
              value={title}></TextField>
            <CircularProgress color="secondary" className={"editor-save-progress "+(!this.state.loading && "hidden")} />
          </div>
        </Paper>
        <Paper classes={({root:"quill-paper-wrapper "+(!selectedNote && "hidden")})} square >      
          {/* <ReactQuill onChange={(e,delta,source)=>this.onBodyChange(e,delta,source)} 
            ref={this.quillRef}
            readOnly={!selectedNote || readonly} 
            value={body} 
            placeholder="write your notes :)" theme="snow" /> */}
          <Editor
            apiKey="g8p3uw4cm5xtob3gmhm918uozx96r78pql9tian9u9rzr1ip"
            init={{
              paste_data_images : true,
              skin: "oxide-dark",
              content_css: "dark",
              height: 666,
              menubar: false,
              plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount'
              ],
              toolbar:
                'undo redo | formatselect | bold italic backcolor | \
                alignleft aligncenter alignright alignjustify | \
                bullist numlist outdent indent | removeformat | help'
            }}
            disabled={!selectedNote || readonly}
            value={body}
            onEditorChange={this.onBodyChange}
          />            

          <div className="bottom-toolbar">
            {/* <IconButton onClick={this.copyClipboard} className="btn-copy" disableRipple>
              <i className="fas fa-clipboard"></i>
            </IconButton>             */}
            <FormControlLabel
              control={
                <Switch checked={readonly} onChange={(e,checked)=>this.onReadOnlyChange(checked)} />
              }
              label="Read-only"/>            
          </div>
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
