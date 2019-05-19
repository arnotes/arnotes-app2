import * as React from 'react';

export interface IDraggableProps {
  children:React.ReactNode;
  className?:string;
  model?:any;
}

export function Draggable (props: IDraggableProps) {
    
    const ref = React.useRef<HTMLSpanElement>();

    React.useEffect(()=>{
      ref && ref.current && (ref.current["model"] = props.model);
    },[props.model])

    React.useEffect(()=>{
      ref && ref.current && $(ref.current).draggable({
        handle:".note-list-item-icon",
        revert: true,
        revertDuration: 0,
        axis: 'y'
      });
    },[ref.current]);

    return (
      <span ref={ref} className={props.className}>
        {props.children}
      </span>
    );
}
