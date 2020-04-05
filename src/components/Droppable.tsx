import * as React from 'react';

export interface IDroppableProps {
  children:any;
  className?:string;
  model?:any;
  onJqDrop?:(item:any,container:any)=>any;
  accept?:any;
}

export function Droppable (props: IDroppableProps) {
    const ref = React.useRef<HTMLDivElement>();

    React.useEffect(()=>{
      ref && ref.current && (ref.current["model"] = props.model);
    },[props.model]);

    React.useEffect(()=>{
      ref && ref.current && $(ref.current).droppable({
        accept: props.accept,
        drop:(event, ui)=>{
          const draggable = ui.draggable[0];
          const droppable = event.target as HTMLElement;
          props.onJqDrop && props.onJqDrop(draggable && draggable["model"] || null, droppable && droppable["model"] || null);
        }
      })
    },[ref.current])

    return (
      <div ref={ref} className={props.className}>
        {props.children}
      </div>
    );
}
