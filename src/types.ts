import React from "react";

export const defaults={
    classDiv:'tipster',
    classContent:'tipster-content',
    classArrow:'tipster-arrow',
};

export type EventType='hover'|'click'|'focus'|'right-click';

export type PopupPosition =
  | 'top left'
  | 'top center'
  | 'top right'
  | 'right top'
  | 'right center'
  | 'right bottom'
  | 'bottom left'
  | 'bottom center'
  | 'bottom right'
  | 'left top'
  | 'left center'
  | 'left bottom'
  | 'center center'
;

export type PopupActions = {
    open:()=>void;
    close:()=>void;
    toggle:()=>void
};

export interface PopupProps {
    trigger?:JSX.Element | ((isOpen:boolean)=>JSX.Element);
    open?:boolean;
    defaultOpen?:boolean;
    disabled?:boolean
    nested?:boolean

    delayMouseEnter?:number
    delayMouseLeave?:number

    onOpen?:()=>any
    onClose?:()=>any

    on?:EventType | EventType[]

    modal?:boolean
    arrow?:boolean
    offsetX?:number
    offsetY?:number
    position?:PopupPosition | PopupPosition[]

    keepTooltipInside?:boolean
    closeOnEscape?:boolean
    closeOnDocumentClick?:boolean
    repositionOnResize?:boolean

    className?:string
    classArrow?:string
    classContent?:string

    style?:React.CSSProperties
    styleArrow?:React.CSSProperties

    children:React.ReactNode;
}