import React from "react";
import { useCallback, useMemo, useState } from "react";
import { Subject } from "rxjs";
import { Dialog, DialogContent, DialogTitle, DialogContentText, DialogActions, Button } from "@material-ui/core";
import { take } from "rxjs/operators";

export function useConfirmDialog():[(header: string, subheader: string) => Promise<boolean>, JSX.Element]{

  const [open, setopen] = useState(false);
  const [header, setheader] = useState("");
  const [subheader, setsubheader] = useState("");
  const stream = useMemo(()=>new Subject<boolean>(),[]);
  const showDialog = useCallback((header:string,subheader:string)=>{
    setheader(header);
    setsubheader(subheader);
    setopen(true);
    return stream.pipe(take(1)).toPromise();
  },[]);
  const respond = useCallback((res:boolean)=>{
    stream.next(res);
    setopen(false);
  },[]);

  const dialog = (
    <Dialog open={open}>
      <DialogTitle>
        {header}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {subheader}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={e=>respond(false)}>
          Cancel
        </Button>
        <Button onClick={e=>respond(true)}>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );

  return [showDialog,dialog]
}