import React, { Component, Dispatch } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { StoreState } from '../redux/store-state';
import { IReduxAction, ReduxAction } from '../redux/redux-action.class';
import { databaseSvc } from '../services/database.service';
import { INote } from '../models/note.interface';
import { Paper, InputBase, Icon, LinearProgress, List, ListItem, ListItemText, ButtonBase, Button, Divider } from '@material-ui/core';
import color from '@material-ui/core/colors/lime';
import { ActionTypes } from '../redux/action-types';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

interface Props extends StoreState{
  notes?:INote[];
  dispatch?:Dispatch<IReduxAction<any>>;
  onSelectNote?:(note:INote)=>any
}

interface State{
  loading?:boolean;
}

class NoteList extends Component<Props,State> {
  constructor(p){
    super(p);
    this.state = {};
  }

  sbjSearch = new Subject();

  componentDidMount(){
    this.sbjSearch
      .pipe(debounceTime(500))
      .subscribe(()=>this.filterNotes());
  }

  componentWillReceiveProps(a,b){
    
  }

  // async loadNotes(){
  //   this.setState({...this.state,loading:true});
  //   const notes = await databaseSvc.getCollection<INote>("notes", (qry)=>qry.where("UID","==",this.props.user.uid));
  //   this.props.dispatch(new ReduxAction(ActionTypes.SET_NOTE_LIST, notes).value);
  //   this.setState({...this.state,loading:false});
  //   this.filterNotes();
  // }

  filterNotes(){
    const selectedNoteID = this.props && this.props.selectedNote && this.props.selectedNote.ID || "";
    const searchToLower = (this.props.strSearch||"").toLowerCase();
    const filtered = this.props.notes
                          .filter(n => 
                                    n.Body.toLowerCase().includes(searchToLower) ||
                                    n.Title.toLocaleLowerCase().includes(searchToLower) ||
                                    n.ID == selectedNoteID
                                  );
    this.props.dispatch(new ReduxAction(ActionTypes.SET_FILTERED_NOTE_LIST, filtered).value);
    this.setState({...this.state,loading:false});
  }

  onSearchChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    this.props.dispatch(new ReduxAction(ActionTypes.SET_SEARCH_QUERY,e.target.value).value);
    this.setState({...this.state,loading:true});
    this.sbjSearch.next({});
  }

  renderListItem(note:INote, index:number){
    return(
      <ListItem button dense divider
        classes={({root:this.props.selectedNote == note? 'list-item-note-selected':'list-item-note'})}
        onClick={e=>this.props.onSelectNote && this.props.onSelectNote(note)} >
        <ListItemText>{note.Title}</ListItemText>
      </ListItem>
    );
  }

  render() {
    const { loading } = this.state;
    const filteredNotes = this.props.filteredNotes||[];

    return (
      <div className="note-list-component">
        <div className="actions-bar-wrapper">
          aw aw aw
          <br/>
          aw aw aw
        </div>
        <Paper classes={({root:"searchbar-paper"})} >
          <div className="search-input-wrapper">
            <InputBase onChange={this.onSearchChange}
              value={this.props.strSearch} 
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
            {(filteredNotes||[]).map((n,index) => this.renderListItem(n,index))}
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
