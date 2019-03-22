import React, { Component, Dispatch } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { StoreState } from '../redux/store-state';
import { IReduxAction, ReduxAction } from '../redux/redux-action.class';
import { databaseSvc } from '../services/database.service';
import { INote } from '../models/note.interface';
import { Paper, InputBase, Icon, LinearProgress, List, ListItem, ListItemText, ButtonBase, Button, Divider, ListItemIcon } from '@material-ui/core';
import color from '@material-ui/core/colors/lime';
import { ActionTypes } from '../redux/action-types';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

interface Props extends StoreState{
  notes?:INote[];
  dispatch?:Dispatch<IReduxAction<any>>;
  onSelectNote?:(note:INote)=>any
  onAddNote?:(note:INote)=>any
}

interface State{
  loading?:boolean;
  strSearch?:string;
}

class NoteList extends Component<Props,State> {
  constructor(p){
    super(p);
    this.state = {
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
                          .filter(n => 
                                    n.Body.toLowerCase().includes(searchToLower) ||
                                    n.Title.toLocaleLowerCase().includes(searchToLower) ||
                                    n.ID == selectedNoteID
                                  );
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
    await databaseSvc.addToCollection('notes',newNote);
    const newNoteList = [...this.props.notes, newNote];
    this.props.dispatch(new ReduxAction(ActionTypes.SET_NOTE_LIST,newNoteList).value);
    this.props.dispatch(new ReduxAction(ActionTypes.SET_SELECTED_NOTE, newNote).value);
    setTimeout(() => {
      const titleInput = document.querySelector('#txt-note-title') as HTMLInputElement;
      titleInput.focus();
      titleInput.select();
    }, 100);
  }

  renderListItem(note:INote, index:number){
    const selected = this.props.selectedNote == note;
    return(
      <ListItem button dense divider key={note.ID}
        classes={({root:selected? 'list-item-note-selected':'list-item-note'})}
        onClick={e=>this.onClickNote(note)} >
        <ListItemText classes={({root:'note-item-text '+(selected&&'note-item-text-selected')})} >{note.Title}</ListItemText>
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
        <div className="actions-bar-wrapper">
          <br/>
        </div>
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
          color="secondary">
        </LinearProgress>
        <div className="list-of-notes">
          <List>
            <ListItem onClick={this.onClickAddNote} classes={({root:'add-note-btn'})} button dense divider>
              <ListItemText classes={({root:'note-item-text'})} >ADD NOTE</ListItemText>
              <ListItemIcon>
                <i className="fas fa-plus-circle"></i>
              </ListItemIcon>              
            </ListItem>
            {filteredNotes.map((n,index) => this.renderListItem(n,index))}
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
