import * as React from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@material-ui/core';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';

export interface ITextDialogProps {
  title?:string;
  label?:string;
  setShow?:(showFn:(str:string)=>Promise<string>)=>any
}

export function TextDialog (props: ITextDialogProps) {
    
    const [value,setValue] = React.useState("");
    const [open,setOpen] = React.useState(false);
    const responseStream = React.useMemo(()=>new Subject<string>(),[]);

    const show = React.useCallback((initialValue:string = "")=>{
      setValue(initialValue);
      setOpen(true);
      return responseStream.pipe(take(1)).toPromise();
    },[]);

    const respondAndClose = React.useCallback((response:string)=>{
      responseStream.next(response);
      setOpen(false);
    },[]);

    props.setShow && props.setShow(show);

    return (
      <Dialog open={open}>
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>
          <TextField
            style={({minWidth:"300px"})}
            label={props.label}
            fullWidth
            value={value}
            onChange={(e)=>setValue(e.target.value)}
            margin="dense"
          />          
        </DialogContent>
        <DialogActions>
          <Button onClick={e=>respondAndClose(undefined)}>
            Cancel
          </Button>
          <Button onClick={e=>respondAndClose(value)}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
}
