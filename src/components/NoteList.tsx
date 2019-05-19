import React, { Component, Dispatch } from 'react'
import PropTypes, { element } from 'prop-types'
import { connect } from 'react-redux'
import { StoreState } from '../redux/store-state';
import { IReduxAction, ReduxAction } from '../redux/redux-action.class';
import { databaseSvc } from '../services/database.service';
import { INote } from '../models/note.interface';
import { Paper, InputBase, Icon, LinearProgress, List, ListItem, ListItemText, ButtonBase, Button, Divider, ListItemIcon, Checkbox } from '@material-ui/core';
import color from '@material-ui/core/colors/lime';
import { ActionTypes } from '../redux/action-types';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import * as ReactDOM from 'react-dom';
import Dragula from 'react-dragula';
import { ToastContainer, toast } from 'react-toastify';
import Folder from './Folder';
import { IFolder } from '../models/folder.interface';

interface Props extends StoreState{
  notes?:INote[];
  folders?:IFolder[];
  dispatch?:Dispatch<IReduxAction<any>>;
  onSelectNote?:(note:INote)=>any
  onAddNote?:(note:INote)=>any
}

interface State{
  loading?:boolean;
  strSearch?:string;
  checkedNotes?:INote[];
}

class NoteList extends Component<Props,State> {
  constructor(p){
    super(p);
    this.state = {
      checkedNotes:[],
      strSearch:null
    };
  }

  sbjSearch = new Subject();

  componentDidMount(){
    this.sbjSearch
      .pipe(debounceTime(500))
      .subscribe(()=>{
        this.setState({...this.state,loading:false});
        this.props.dispatch(new ReduxAction(ActionTypes.SET_SEARCH_QUERY, this.state.strSearch).value);
      });
  }

  getFilterNotes(){
    const selectedNoteID = this.props && this.props.selectedNote && this.props.selectedNote.ID || "";
    const searchToLower = (this.props.strSearch||"").toLowerCase();
    const filtered = (this.props.notes||[])
                          .slice(0)
                          .filter(n => n.Body.toLowerCase().includes(searchToLower) ||
                                    n.Title.toLocaleLowerCase().includes(searchToLower) ||
                                    n.ID == selectedNoteID);
    return filtered;
  }

  onSearchChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    this.setState({...this.state,loading:true,strSearch:e.target.value});
    this.sbjSearch.next({});
  }

  onClickNote = (note:INote)=>{
    this.props.onSelectNote && this.props.onSelectNote(note);
  }

  onClickAddNote = async (folderID:string)=>{
    const dummyTitle = 'NEW_NOTE_'+(new Date().getTime().toString());
    let newNote:INote = {
      Body:'',
      Title:dummyTitle,
      UID:this.props.user.uid,
      FolderID: folderID
    }
    
    await databaseSvc.addToCollection('notes',newNote);
    const newNoteList = [...this.props.notes, newNote];
    this.props.dispatch(new ReduxAction(ActionTypes.SET_NOTE_LIST,newNoteList).value);
    this.props.dispatch(new ReduxAction(ActionTypes.SET_SELECTED_NOTE, newNote).value);

    toast.info("New note added!", { position:"bottom-right", hideProgressBar:true, autoClose:2500 });
    setTimeout(() => {
      const titleInput = document.querySelector('#txt-note-title') as HTMLInputElement;
      titleInput.focus();
      titleInput.select();
    }, 100);
  }

  onClickDeleteNotes = async ()=>{
    const notesToDelete = [...this.state.checkedNotes];

    if(this.state.checkedNotes.includes(this.props.selectedNote)){
      this.props.dispatch(new ReduxAction(ActionTypes.SET_SELECTED_NOTE, null).value);
    }
    this.setState({...this.state, checkedNotes:[]});

    const newNoteList = this.props.notes.filter(n => !notesToDelete.includes(n));
    this.props.dispatch(new ReduxAction(ActionTypes.SET_NOTE_LIST, newNoteList).value);

    toast.info(`${notesToDelete.length} note/s deleted!`, { position:"bottom-right", hideProgressBar:true, autoClose:2500 });

    await databaseSvc.removeMany('notes', notesToDelete);
  }

  onClickAddFolder = async ()=>{
    const newFolder:IFolder = {
      ID:null,
      Name: "NEW_FOLDER_"+(new Date().getTime()),
      UID: this.props.user.uid
    }
    await databaseSvc.addToCollection("folders", newFolder);
    this.props.dispatch(new ReduxAction(ActionTypes.SET_FOLDER_LIST,[...this.props.folders,newFolder]).value);
    toast.info(`New folder added!`, { position:"bottom-right", hideProgressBar:true, autoClose:2500 });
  }

  onClickDeleteFolder = async (folder:IFolder)=>{
    const newFolderList = this.props.folders.filter(f => f.ID!=folder.ID);
    const notesFromFolder = this.props.notes.filter(n => n.FolderID==folder.ID);
    notesFromFolder.forEach(n => n.FolderID=null);

    console.log(folder, notesFromFolder);
    await databaseSvc.removeItem("folders", folder);
    await databaseSvc.updateMany("notes",notesFromFolder);

    this.props.dispatch(new ReduxAction(ActionTypes.SET_FOLDER_LIST, newFolderList).value);
    this.props.dispatch(new ReduxAction(ActionTypes.SET_NOTE_LIST, [...this.props.notes]).value);
    toast.info(`Folder deleted!`, { position:"bottom-right", hideProgressBar:true, autoClose:2500 });
  }

  onNoteListCheck = (note:INote, checked:boolean)=>{
    if(checked){
      this.setState({...this.state, checkedNotes:[...this.state.checkedNotes,note]});
    }else{
      this.setState({...this.state, checkedNotes:this.state.checkedNotes.filter(n => n.ID!=note.ID)});
    }
  }

  onUpdateFolder = async (folder:IFolder)=>{
    const ix = this.props.folders.findIndex(f => f.ID==folder.ID);
    if(ix+1){
      this.props.folders[ix] = folder;
      this.props.dispatch(new ReduxAction(ActionTypes.SET_FOLDER_LIST,[...this.props.folders]).value);
      await databaseSvc.updateItem("folders",folder);
    }
  }

  render() {
    const { loading } = this.state;
    let strSearch = this.state.strSearch;
    const folders = (this.props.folders||[]).sort((a,b)=>a.Name.toLowerCase().localeCompare(b.Name.toLowerCase()));
    const foldersWithGeneral:IFolder[] = [{ID:null,Name:"General Notes",UID:this.props.user.uid},...folders];

    if(strSearch==null){
      strSearch = this.props.strSearch || "";
    }

    return (
      <div className="note-list-component">
        <Paper classes={({root:"actions-bar-wrapper"})}>
          <List>
            <ListItem button dense onClick={this.onClickAddFolder}>
              <ListItemText classes={({root:'note-item-text'})} >ADD FOLDER</ListItemText>
              <ListItemIcon>
                <i className="fas fa-folder-plus"></i>
              </ListItemIcon>        
            </ListItem>            
          </List>
          &nbsp;
        </Paper>
        <Paper classes={({root:"searchbar-paper"})} >
          <div className="search-input-wrapper">
            <InputBase onChange={this.onSearchChange}
              value={strSearch} 
              classes={({root:"search-input"})} placeholder="Search.."></InputBase>
            <Icon fontSize="small" classes={({root:'search-icon'})}>
              <i style={({color:"#a0a0a0"})} className="fas fa-search"></i>
            </Icon>
          </div>
        </Paper>
        <LinearProgress classes={({root:loading?"search-progress-loading":"search-progress-complete"})} 
          color="primary">
        </LinearProgress>
        <div className="list-of-notes">
          {
            foldersWithGeneral.map(folder=>(
              <Folder key={folder.ID} checkedNotes={this.state.checkedNotes} 
                    onCheckNote={this.onNoteListCheck} 
                    onClickAddNote={this.onClickAddNote}
                    onClickDeleteNotes={this.onClickDeleteNotes}
                    onClickDeleteFolder={this.onClickDeleteFolder}
                    onUpdateFolder={this.onUpdateFolder}
                    folder={folder}>
              </Folder>)
            )
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state:StoreState):StoreState => ({
  ...state
})

const mapDispatchToProps = dispatch => ({
  dispatch:dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(NoteList)
