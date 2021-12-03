export declare function useOnEscape(handler: () => void, active?: boolean): void;
export declare function useRepositionOnResize(handler: () => void, active?: boolean): void;
export declare function useOnClickOutside(ref: RefObject<HTMLElement> | RefObject<HTMLElement>[], handler: () => void, active?: boolean): void;
export declare function useTabbing(contentRef: RefObject<HTMLElement>, active?: boolean): void;
export declare const useIsomorphicLayoutEffect: typeof useLayoutEffect;

export default Tipster;

export declare const Tipster: React.ForwardRefExoticComponent<PopupProps & React.RefAttributes<PopupActions>>;
export default Tipster;

export declare const defaults: {
    classDiv: string;
    classContent: string;
    classArrow: string;
};
export declare type EventType = 'hover' | 'click' | 'focus' | 'right-click';
export declare type PopupPosition = 'top left' | 'top center' | 'top right' | 'right top' | 'right center' | 'right bottom' | 'bottom left' | 'bottom center' | 'bottom right' | 'left top' | 'left center' | 'left bottom' | 'center center';
export declare type PopupActions = {
    open: () => void;
    close: () => void;
    toggle: () => void;
};
export interface PopupProps {
    trigger?: JSX.Element | ((isOpen: boolean) => JSX.Element);
    open?: boolean;
    defaultOpen?: boolean;
    disabled?: boolean;
    nested?: boolean;
    delayMouseEnter?: number;
    delayMouseLeave?: number;
    onOpen?: () => any;
    onClose?: () => any;
    on?: EventType | EventType[];
    modal?: boolean;
    arrow?: boolean;
    offsetX?: number;
    offsetY?: number;
    position?: PopupPosition | PopupPosition[];
    keepTooltipInside?: boolean;
    closeOnEscape?: boolean;
    closeOnDocumentClick?: boolean;
    repositionOnResize?: boolean;
    className?: string;
    classArrow?: string;
    classContent?: string;
    style?: React.CSSProperties;
    styleArrow?: React.CSSProperties;
    children: React.ReactNode;
}

export declare const POSITION_TYPES: PopupPosition[];
export declare type CoordsType = {
    top: number;
    left: number;
    transform: string;
    arrowLeft: string;
    arrowTop: string;
};
export declare function getTooltipBoundary(keepTooltipInside: string | boolean): {
    top: number;
    left: number;
    width: number;
    height: number;
};
export declare function calculatePosition(boundingTrigger: DOMRect, boundingContent: DOMRect, position: PopupPosition | PopupPosition[], arrow: boolean, { offsetX, offsetY }: {
    offsetX: number;
    offsetY: number;
}, keepTooltipInside: string | boolean): CoordsType;
export { getTooltipBoundary };
export default calculatePosition;
