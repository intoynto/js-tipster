import {PopupPosition} from "./types";

export const POSITION_TYPES:PopupPosition[]=[
    'top left',
    'top center',
    'top right',
    'right top',
    'right center',
    'right bottom',
    'bottom left',
    'bottom center',
    'bottom right',
    'left top',
    'left center',
    'left bottom',
];

type CoordsType = {
    top:number
    left:number
    transform:string
    arrowLeft:string
    arrowTop:string
}

function getCoordinatesForPosition(
    boundingTrigger:DOMRect,
    boundingContent:DOMRect,
    position:PopupPosition,
    arrow:boolean,
    {offsetX,offsetY}:{offsetX:number,offsetY:number}
):CoordsType
{
    const margin=arrow?8:0;
    const args=position.split(' ');
    // cari step n 1 : center teh popup content => ok
    const CenterTop=boundingTrigger.top + boundingTrigger.height / 2;
    const CenterLeft=boundingTrigger.left + boundingTrigger.width / 2;
    const {height,width}=boundingContent;
    let top=CenterTop - height / 2;
    let left=CenterLeft - width / 2;
    let transform='';
    let arrowTop='0%';
    let arrowLeft='0%';
    //step n 2 : = > ok
    switch(args[0])
    {
        case 'top':{
            top-=height / 2 + boundingTrigger.height / 2 + margin;
            transform=`rotate(180deg) translateX(50%)`;
            arrowTop='100%';
            arrowLeft='50%';
            break;
        }
        case 'bottom':{
            top+=height / 2 + boundingTrigger.height / 2 + margin;
            transform=`rotate(0deg) translateY(-100%) translateX(-50%)`;
            arrowLeft='50%';
            break;            
        }
        case 'left':{
            left-=width / 2 + boundingTrigger.width / 2 + margin;
            transform=`rotate(90deg) translateY(50%) translateX(-25%)`;
            arrowLeft='100%';
            arrowTop='50%';
            break;
        }
        case 'right':{
            left+=width/2 + boundingTrigger.width / 2 + margin;
            transform=`rotate(-90deg) translateY(-150%) translateX(25%)`;
            arrowTop='50%';
            break;
        }
        default :
    }

    switch(args[1])
    {
        case 'top':{
            top=boundingTrigger.top;
            arrowTop=`${boundingTrigger.height/2}px`;
            break;
        }
        case 'bottom':{
            top=boundingTrigger.top - height + boundingTrigger.height;
            arrowTop=`${height - boundingTrigger.height /2}px`;
            break;
        }
        case 'left':{
            left=boundingTrigger.left;
            arrowLeft=`${boundingTrigger.width/2}px`;
            break;
        }
        case 'right':{
            left=boundingTrigger.left - width + boundingTrigger.width;
            arrowLeft=`${width - boundingTrigger.width/2}px`;
            break;
        }
        default:
    }

    top=args[0]==='top'?top - offsetY:top+offsetY;
    left=args[0]==='left'?left - offsetX : left + offsetX;
    return {
        top,
        left,
        transform,
        arrowLeft,
        arrowTop
    };
}


function getTooltipBoundary(keepTooltipInside:string | boolean)
{
    let boundingBox={
        top:0,
        left:0,
        width:window.innerWidth,
        height:window.innerHeight,
    };

    if(typeof keepTooltipInside==="string")
    {
        const selector=document.querySelector(keepTooltipInside);
        if(selector!==null){
            boundingBox=selector?.getBoundingClientRect();
        }
    }
    return boundingBox;
}

function calculatePosition(
    boundingTrigger:DOMRect,
    boundingContent:DOMRect,
    position:PopupPosition | PopupPosition[],
    arrow:boolean,
    {offsetX,offsetY}:{offsetX:number,offsetY:number},
    keepTooltipInside: string | boolean
):CoordsType
{
    let bestCoords: CoordsType={
        arrowLeft: '0%',
        arrowTop: '0%',
        left: 0,
        top: 0,
        transform: 'rotate(135deg)',
    };

    let i = 0;
    const wrapperBox = getTooltipBoundary(keepTooltipInside);
    let positions = Array.isArray(position) ? position : [position];
    
    // keepTooltipInside would be activated if the  keepTooltipInside exist or the position is Array
    if (keepTooltipInside || Array.isArray(position))
    positions = [...positions, ...POSITION_TYPES];
    
    // add viewPort for WarpperBox
    // wrapperBox.top = wrapperBox.top + window.scrollY;
    // wrapperBox.left = wrapperBox.left + window.scrollX;
    while (i < positions.length) 
    {
        bestCoords = getCoordinatesForPosition(
            boundingTrigger,
            boundingContent,
            positions[i],
            arrow,
            { offsetX, offsetY }
        );
        const contentBox = {
            top: bestCoords.top,
            left: bestCoords.left,
            width: boundingContent.width,
            height: boundingContent.height,
        };
        if (
            contentBox.top <= wrapperBox.top ||
            contentBox.left <= wrapperBox.left ||
            contentBox.top + contentBox.height >=wrapperBox.top + wrapperBox.height ||
            contentBox.left + contentBox.width >= wrapperBox.left + wrapperBox.width
            ) 
            {
                i++;
            } 
        else {
            break;
        }
    }// end while
    return bestCoords;
}

export {getTooltipBoundary}
export default calculatePosition;