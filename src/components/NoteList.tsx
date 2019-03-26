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

interface Props extends StoreState{
  notes?:INote[];
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

  onClickAddNote = async ()=>{
    const dummyTitle = 'NEW_NOTE_'+(new Date().getTime().toString());
    let newNote:INote = {
      Body:'',
      Title:dummyTitle,
      UID:this.props.user.uid
    }
    
    const newNoteList = [...this.props.notes, newNote];
    this.props.dispatch(new ReduxAction(ActionTypes.SET_NOTE_LIST,newNoteList).value);
    this.props.dispatch(new ReduxAction(ActionTypes.SET_SELECTED_NOTE, newNote).value);

    toast.info("New note added!", { position:"bottom-right", hideProgressBar:true, autoClose:2500 });

    setTimeout(() => {
      const titleInput = document.querySelector('#txt-note-title') as HTMLInputElement;
      titleInput.focus();
      titleInput.select();
    }, 100);

    await databaseSvc.addToCollection('notes',newNote);
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

  onNoteListCheck = (note:INote, checked:boolean)=>{
    if(checked){
      this.setState({...this.state, checkedNotes:[...this.state.checkedNotes,note]});
    }else{
      this.setState({...this.state, checkedNotes:this.state.checkedNotes.filter(n => n.ID!=note.ID)});
    }
  }

  onNoteListReorder(notes:INote[]){
    databaseSvc.updateMany("notes", notes);
  }

  dragulaDecorator = (componentBackingInstance) => {
    if (componentBackingInstance) {
      const options = {
        moves: function (el, container, handle) {
        return handle.classList.contains('note-drag-handle');
        }
      };
      const drake = Dragula([componentBackingInstance], options);
      
      drake.on('drop', (el:HTMLElement,target:HTMLElement,source,sibling)=>{
        const arrayMinusDroppedItem = this.props.notes.filter(n => n.ID!=el.id);
        const siblingList = Array.from(target.children);
        const dropIndex = siblingList.indexOf(el);
        
        const previousSibling = siblingList[dropIndex-1];
        const nextSibling = siblingList[dropIndex+1];

        let insertIndex = null;
        if(previousSibling){
          insertIndex = arrayMinusDroppedItem.findIndex(n => n.ID == previousSibling.id)+1;
        }else if(nextSibling){
          insertIndex = arrayMinusDroppedItem.findIndex(n => n.ID == nextSibling.id);
        }

        if(insertIndex!=null){
          arrayMinusDroppedItem.splice(insertIndex, 0, this.props.notes.find(n => n.ID==el.id));
          let i = 0;
          arrayMinusDroppedItem.forEach(n => {
            n.Index = i;
            i++;
          });
          this.onNoteListReorder(arrayMinusDroppedItem);
        }
      })
    }
  };

  renderListItem(note:INote, index:number){
    const selected = this.props.selectedNote == note;
    const { checkedNotes } = this.state;
    return(
      <ListItem button dense divider key={note.ID} id={note.ID}
        classes={({root:"note-list-item "+(selected? 'list-btn-primary':'')})}
        onClick={e=>this.onClickNote(note)} >
          <Checkbox checked={checkedNotes.includes(note)} 
            onChange={(e,checked)=>this.onNoteListCheck(note,checked)}
            onClick={e=>e.stopPropagation()} 
            classes={({root:'list-chk'})}/>
        <ListItemText classes={({root:'note-item-text '+(selected&&'note-item-text-selected')})} >{note.Title}</ListItemText>
        <div className="note-drag-handle">
          <i className="fas fa-arrows-alt-v"></i>
        </div>
      </ListItem>
    );
  }

  render() {
    const { loading } = this.state;
    const filteredNotes = this.getFilterNotes();
    let strSearch = this.state.strSearch;

    if(strSearch==null){
      strSearch = this.props.strSearch || "";
    }

    return (
      <div className="note-list-component">
        <Paper classes={({root:"actions-bar-wrapper"})}>
          <List>
            <ListItem onClick={this.onClickAddNote} classes={({root:'list-btn-primary_'})} button dense>
              <ListItemText classes={({root:'note-item-text'})} >CREATE NEW NOTE</ListItemText>
              <ListItemIcon>
                <i className="fas fa-plus-circle"></i>
              </ListItemIcon>              
            </ListItem>
            <ListItem onClick={this.onClickDeleteNotes} disabled={this.state.checkedNotes.length<1} classes={({root:'list-btn-danger_'})} button dense>
              <ListItemText classes={({root:'note-item-text'})} >DELETE NOTES</ListItemText>
              <ListItemIcon>
                <i className="fas fa-trash-alt"></i>
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
          <List>
            <div ref={this.dragulaDecorator}>
              {filteredNotes.map((n,index) => this.renderListItem(n,index))}
            </div>
          </List>
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
