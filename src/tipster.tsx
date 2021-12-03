import React,{useState,useRef,useEffect,forwardRef,useImperativeHandle} from "react";
import {createPortal} from "react-dom";
import {PopupProps,PopupActions,defaults} from "./types";
import {
    useOnEscape,
    useRepositionOnResize,
    useOnClickOutside,
    useTabbing,
    useIsomorphicLayoutEffect
} from "./hooks";

import calculatePosition from "./utils";

function getRootTipster(){
    let tips=document.getElementById('tipster-root');
    if(tips===null)
    {
        tips=document.createElement('div');
        tips.setAttribute('id','tipster-root');
        document.body.appendChild(tips);
    }
    return tips;
}


let tipsterCounterId=0;

const Tipster=forwardRef<PopupActions,PopupProps>((
    {
        trigger=null,

        defaultOpen=false,
        open=undefined,
        disabled=false,
        nested=false,

        delayMouseEnter=100,
        delayMouseLeave=100,

        on=['click'],

        modal=false,
        arrow=true,

        offsetX=0,
        offsetY=0,

        keepTooltipInside=false,
        position='top left',

        closeOnDocumentClick=true,
        repositionOnResize=true,
        closeOnEscape=true,

        onOpen=()=>{},
        onClose=()=>{},

        styleArrow={},

        children,      
        ...props  
    },ref
)=>{

    const [isOpen,setIsOpen]=useState<boolean>(open || defaultOpen);
    const triggerRef=useRef<HTMLElement>(null);
    const contentRef=useRef<HTMLElement>(null);
    const arrowRef=useRef<HTMLElement>(null);
    const focusedBeforeOpen=useRef<Element | null>(null);
    const popupId=useRef<string>(`tipster-${++tipsterCounterId}`);

    const isModal=modal?true:!trigger;
    const timeOut=useRef<any>(0);
    const resizeObserver=new ResizeObserver(entries=>{
        setPosition();
    });

    useIsomorphicLayoutEffect(()=>{
        if(isOpen)
        {                 
            focusedBeforeOpen.current=document.activeElement;
            //setPosition()
            //focusContentOnOpen(); // for akses
            //lockSrcoll(); //
            resizeObserver.observe(contentRef.current as Element);
        }
        else {
            //resetScroll();
        }

        return ()=>{
            clearTimeout(timeOut.current);
        };
    },[isOpen]);

    useEffect(()=>{
        if(typeof open==="boolean")
        {
            if(open) doPopupOpen();
            else doPopupClose();
        }
    },[isOpen,disabled]);

    function doPopupOpen()
    {    
        if(isOpen || disabled) return;
        setIsOpen(true);
        setTimeout(onOpen,0);
    }

    function doPopupClose(){       
        if(!isOpen || disabled) return;
        setIsOpen(false);
        //if ismoda
        setTimeout(onClose,0);
    }

    function togglePopup(event?:React.SyntheticEvent){
        event?.stopPropagation();
        if(!isOpen) doPopupOpen();
        else doPopupClose();
    }

    function onMouseEnter(){        
        clearTimeout(timeOut.current);
        timeOut.current=setTimeout(doPopupOpen,delayMouseEnter);
    }

    function onMouseLeave()
    {        
        clearTimeout(timeOut.current);
        timeOut.current=setTimeout(doPopupClose,delayMouseLeave);
    }

    function onContextMenu(event?:React.SyntheticEvent)
    {
        event?.preventDefault();
        togglePopup();
    }

    function scrollLock()
    {
        //if (isModal && lockScroll)
        //document.getElementsByTagName('body')[0].style.overflow = 'hidden'; // migrate to document.body
    }

    function scrollReset()
    {
        //if (isModal && lockScroll) document.getElementsByTagName('body')[0].style.overflow = 'auto';
    }

    function focusContentOnOpen()
    {
        const focusableEls = contentRef?.current?.querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]');
        const firstEl = Array.prototype.slice.call(focusableEls)[0];
        firstEl?.focus();
    }

    useImperativeHandle(ref,()=>({
        open:()=>{
            doPopupOpen();
        },
        close:()=>{
            doPopupClose();
        },
        toggle:()=>{
            togglePopup();
        }
    }));


    function setPosition()
    {
        if(isModal || !isOpen) return;

        if(!triggerRef?.current || !contentRef.current)
        {
            return; // error ref tidak diketahui
        }

        const trigger=triggerRef.current.getBoundingClientRect();
        const content=contentRef.current.getBoundingClientRect();

        const cords=calculatePosition(
            trigger,
            content,
            position,
            arrow,
            {offsetX,offsetY},
            keepTooltipInside
        );        
        contentRef.current.style.top = `${cords.top + window.scrollY}px`;
        contentRef.current.style.left = `${cords.left + window.scrollX}px`;
        if (arrow && !!arrowRef.current) {
            arrowRef.current.style.transform = cords.transform;
            arrowRef.current.style.setProperty('-ms-transform', cords.transform);
            arrowRef.current.style.setProperty('-webkit-transform',cords.transform);
            arrowRef.current.style.top =styleArrow.top?.toString() || cords.arrowTop;
            arrowRef.current.style.left=styleArrow.left?.toString() || cords.arrowLeft;
        }        
    }
    
    useOnEscape(doPopupClose,closeOnEscape);
    useTabbing(contentRef,isOpen && isModal);
    useRepositionOnResize(setPosition,repositionOnResize);
    useOnClickOutside(
        !!trigger?[contentRef,triggerRef]:[contentRef],
        doPopupClose,
        closeOnDocumentClick && !nested
    );

    

    function renderTrigger()
    {
        const triggerProps:any={
            key:'T',
            ref:triggerRef,
            'aria-describedy':popupId.current,
        };

        const onAsArray=Array.isArray(on)?on:[on];
        for(let i=0, len=onAsArray.length; i<len; i++)
        {
            switch(onAsArray[i])
            {
                case 'click':{
                    triggerProps.onClick=togglePopup;
                    break;
                }
                case 'right-click':{
                    triggerProps.onContextMenu=onContextMenu;
                    break;
                }
                case 'hover':{
                    triggerProps.onMouseEnter=onMouseEnter;
                    triggerProps.onMouseLeave=onMouseLeave;
                    break;
                }
                case 'focus':{
                    triggerProps.onFocus=onMouseEnter;
                    triggerProps.onBlur=onMouseLeave;
                    break;
                }
                default:
            }
        }

        if(typeof trigger==='function')
        {
            const comp=trigger(isOpen);
            return !!trigger && React.cloneElement(comp,triggerProps);
        }

        return !!trigger && React.cloneElement(trigger,triggerProps);
    }

    function addWarperAction()
    {
        //const popupContentStyle=isModal?StyleSheet.popupContent.modal:styles.popupContent.tooltip;
    }

    function renderContent()
    {
        const mProps:any={
            ref:contentRef,
            onClick:(e:MouseEvent)=>{
                e.stopPropagation();
            },
        };
        const idnProps:any={
            ref:arrowRef,
        }
        return (
            <div
                key="C"
                id={popupId.current}
                className={`${defaults.classDiv} ${props.className?" "+props.className:""}`}
                role={isModal?'tipster-dialog':'tipster-tooltip'}

                style={{
                    pointerEvents:"auto",
                    ...props.style
                }}

                {...mProps}
            >
                {arrow && !isModal && 
                <div {...idnProps} className={`${defaults.classArrow}${props.classArrow?" "+props.classArrow:""}`}>
                    <svg
                        data-testid="arrow"
                        viewBox="0 0 32 16"
                    >                      
                        <path d="M16 0l16 16H0z" fill="currentcolor" />
                    </svg>
                </div>
                }
                <div className={`${defaults.classContent}${props.classContent?" "+props.classContent:""}`}>
                    {children && typeof children==="function"
                    ?children(doPopupClose,isOpen)
                    :children
                    }
                </div>
            </div>
        )
    };


    if(!isOpen && contentRef.current)
    {
        resizeObserver.unobserve(contentRef.current as Element);
    }

    const content=[        
        !isModal && renderContent(),
    ];

    return (
        <React.Fragment>
            {renderTrigger()}            
            {isOpen && createPortal(content,getRootTipster())}
        </React.Fragment>
    )
});

export default Tipster