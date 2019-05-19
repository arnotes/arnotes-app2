import * as React from 'react';
import { INote } from '../models/note.interface';
import { IFolder } from '../models/folder.interface';
import { mapStateFn } from '../models/mapState.interface';
import { connect } from 'react-redux'
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import { dispatchFn, mapDispatchFn } from '../models/mapDispatch.interface';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import { Badge, ListItem, List, ListItemText, Checkbox, ListItemIcon, Fab, IconButton, Icon, ExpansionPanelActions, Button, MenuItem, Menu } from '@material-ui/core';
import { ReduxAction } from '../redux/redux-action.class';
import { ActionTypes } from '../redux/action-types';
import { TextDialog } from './TextDialog';
import { useConfirmDialog } from '../hooks/useConfirmDialog';

export interface IAppProps {
  strSearch?:string;
  dispatch?:dispatchFn;
  notes?:INote[];
  folder:IFolder;
  selectedNote?:INote;
  onCheckNote?:(note:INote,checked:boolean)=>any;
  onClickAddNote?:(folderID:string)=>any;
  onClickDeleteNotes?:()=>any;
  onClickDeleteFolder?:(folder:IFolder)=>any;
  onUpdateFolder?:(folder:IFolder)=>any;
  checkedNotes:INote[];
}

function Folder (props: IAppProps) {
    const [expanded,setExpanded] = React.useState(false);
    const [menuAnchor,setMenuAnchor] = React.useState(null);
    const regex = new RegExp(props.strSearch||"","ig");
    const folder = props.folder;
    const notes = (props.notes||[])
                    .filter(n=>(n.Title+" "+n.Body).match(regex) && n.FolderID==folder.ID)
                    .sort((a,b)=>a.Title.toLowerCase().localeCompare(b.Title.toLowerCase()));

    const selectedNote = props.selectedNote;
    const checkedNotes = props.checkedNotes||[];
    const [showConfirm, confirmDialog] = useConfirmDialog();

    let showTextDialog:(val:string)=>Promise<string> = null;

    const handleNoteCheckChange = React.useCallback((note:INote,checked:boolean)=>{
      props.onCheckNote && props.onCheckNote(note,checked);
    },[]);

    const handleClickMenu = React.useCallback((e:React.MouseEvent<HTMLDivElement, MouseEvent>)=>{
      e.preventDefault();
      e.stopPropagation();
      setMenuAnchor(e.target);
    },[]);

    const handleMenuClose = React.useCallback(()=>{
      setMenuAnchor(null);
    },[]);

    const handleAddNote = React.useCallback(()=>{
      props.onClickAddNote && props.onClickAddNote(folder.ID);
      handleMenuClose();
    },[folder]);

    const handleDeleteNotes = React.useCallback(async ()=>{
      handleMenuClose();
      if(await showConfirm(`Confirm`,`Delete Notes?`)){
        props.onClickDeleteNotes && props.onClickDeleteNotes();
      }
    },[folder,notes]);

    const handleDeleteFolder = React.useCallback(async ()=>{
      handleMenuClose();
      if(await showConfirm(`Confirm`,`Delete folder "${folder.Name}?"`)){
        props.onClickDeleteFolder && props.onClickDeleteFolder(props.folder);
      }
    },[folder]);

    const handleRename = React.useCallback(async ()=>{
      handleMenuClose();
      const response = await showTextDialog(folder.Name);
      if(response != null){
        props.onUpdateFolder && props.onUpdateFolder({...folder,Name:response});
      }
    },[folder]);

    return (
      <div>
        <ExpansionPanel expanded={expanded} onChange={()=>setExpanded(!expanded)}>
          <ExpansionPanelSummary expandIcon={<i className="fas fa-angle-down"></i>}>
            <Badge color={notes.length? "primary":"error"} showZero badgeContent={notes.length}>
              <Typography>{folder.Name}</Typography>
            </Badge>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails style={({paddingLeft:"5px",paddingRight:"5px"})}>
            <List dense disablePadding style={({width:"100%"})}>
            {
              notes.map((n,index)=>(
              <ListItem divider={index+1 < notes.length} 
                        dense
                        key={n.ID} 
                        button 
                        selected={n.ID==(selectedNote && selectedNote.ID || "")}
                        onClick={()=>props.dispatch(new ReduxAction(ActionTypes.SET_SELECTED_NOTE,n).value)} >
                <Checkbox style={({padding:"0px"})} 
                    onClick={e=>e.stopPropagation()} 
                    onChange={(e,checked)=>handleNoteCheckChange(n,checked)} 
                    checked={checkedNotes.includes(n)}>
                </Checkbox>
                <ListItemText primary={n.Title}/>
              </ListItem>    
              ))
            }
            </List>
          </ExpansionPanelDetails>
          <ExpansionPanelActions>
            <Fab size="small" color="primary" onClick={handleClickMenu}>
              <i className="fas fa-ellipsis-v"></i>
            </Fab>
          </ExpansionPanelActions>
          <Menu
            id="simple-menu"
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleAddNote}>
              <i className="fas fa-file-medical"></i>
              &nbsp; Add Note
            </MenuItem>
            {
            folder.ID!=null &&
            <MenuItem onClick={handleRename}>
              <i className="fas fa-pen"></i>
              &nbsp; Rename
            </MenuItem>
            }        
            {
            checkedNotes.length &&
            <MenuItem onClick={handleDeleteNotes}>
              <i style={({color:"#F44336"})} className="fas fa-file"></i>
              &nbsp; Delete Notes
            </MenuItem>
            }
            {
            folder.ID!=null &&
            <MenuItem onClick={handleDeleteFolder}>
              <i style={({color:"#F44336"})} className="fas fa-folder"></i>
              &nbsp; Delete Folder
            </MenuItem>
            }
          </Menu>

          <TextDialog title="Rename Folder" label="Folder Name" setShow={fn=>showTextDialog=fn}></TextDialog>
          {confirmDialog}
        </ExpansionPanel>
      </div>
    );
}


const mapState:mapStateFn<any> = (state)=>({
  notes:state.notes,
  strSearch: state.strSearch,
  selectedNote: state.selectedNote
});

const mapDispatch:mapDispatchFn = (d)=>({
  dispatch:d
});

export default connect(mapState, mapDispatch)(Folder);