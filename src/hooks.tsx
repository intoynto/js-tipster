import {useEffect,RefObject,useLayoutEffect} from "react";

export function useOnEscape(handler:()=>void,active=true){
    useEffect(()=>{
        if(!active) return;
        const listener=(event:any)=>{
            if(event.key==='Escape') handler();
        };
        document.addEventListener('keyup',listener);
        return ()=>{
            if(!active) return;
            document.removeEventListener('keyup',listener)
        };
    },[handler,active]);
}

export function useRepositionOnResize(handler:()=>void,active=true)
{
    useEffect(()=>{
        if (!active) return;
        const listener=()=>{
            handler();
        };
        window.addEventListener('resize',listener);
        return () => {
            if (!active) return;
            window.removeEventListener('resize',listener);
        };
  },[handler,active]);
}

export function useOnClickOutside(
    ref: RefObject<HTMLElement>|RefObject<HTMLElement>[],
    handler:()=>void,
    active=true)
{
    useEffect(()=>{
        if (!active) return;
        const listener = (event: any) => {
            // Do nothing if clicking ref's element or descendent elements
            const refs = Array.isArray(ref) ? ref : [ref];
            let contains = false;
            refs.forEach(r =>{
                if (!r.current || r.current.contains(event.target)) {
                    contains = true;
                    return;
                }
            });
            event.stopPropagation();
            if (!contains) handler();
        };
        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);
        return ()=>{
            if (!active) return;
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    },[ref, handler, active]);
}

export function useTabbing(
    contentRef: RefObject<HTMLElement>,
    active = true
)
{
    useEffect(() => 
    {
        if (!active) return;
        const listener = (event: any) => {
            // check if key is an Tab
            if (event.keyCode === 9) {
                const els = contentRef?.current?.querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]');
                const focusableEls = Array.prototype.slice.call(els);
                if (focusableEls.length === 1){
                    event.preventDefault();
                    return;
                }
                const firstFocusableEl = focusableEls[0];
                const lastFocusableEl = focusableEls[focusableEls.length - 1];
                if (event.shiftKey && document.activeElement === firstFocusableEl)
                {
                    event.preventDefault();
                    lastFocusableEl.focus();
                } 
                else if (document.activeElement === lastFocusableEl)
                {
                    event.preventDefault();
                    firstFocusableEl.focus();
                }
            }
        };

        document.addEventListener('keydown', listener);
        return () => {
            if (!active) return;
            document.removeEventListener('keydown', listener);
        };
        
    },[contentRef, active]);
}

export const useIsomorphicLayoutEffect=typeof window!==undefined?useLayoutEffect:useEffect;