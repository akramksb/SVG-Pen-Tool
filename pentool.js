body = document.querySelector("html")
canvas = document.querySelector(".pentoolSVG")

const svgns = "http://www.w3.org/2000/svg";
const curveStyle = "fill: none; stroke: green; stroke-width: 2px;";
const curveStylePreview = "fill: none; stroke: #1a7d1a96; stroke-width: 1px;";
const tangentStyle = "fill: none; stroke: rgb(221 163 97) ;stroke-width: 1.3px;";
const dotStyle = "fill: rgb(221 163 97); stroke: none;";

let bezierCurve = [];
let started = false;
let finished = false;
// let isCtr0 = false;
// let isCtr1 = false;

let mousePressed = false;


function getCubicPath(start, ctr0, ctr1, dest) {

    let path = `M ${start[0]},${start[1]} \
    C ${ctr0[0]},${ctr0[1]} ${ctr1[0]},${ctr1[1]} \
    ${dest[0]},${dest[1]}`;

    return path;
}

function drawDot(canvas, className, pt, isSquare = false)
{
    let dot = document.querySelector(`.${className}`)

    if (!dot) {
        dot = document.createElementNS(svgns, isSquare?"rect":"circle");
        dot.classList.add(className)
        canvas.appendChild(dot)
    } else
        dot.classList.remove("invisible")

    if(isSquare){
        dot.setAttribute("x", pt[0]-3); dot.setAttribute("y", pt[1]-3);
        dot.setAttribute("width",6); dot.setAttribute("height",6);
    }
    else{
        dot.setAttribute("cx", pt[0]); dot.setAttribute("cy", pt[1]);
        dot.setAttribute("r", 3);
        
    }
    dot.setAttribute("style", dotStyle);
}

function drawFullTangent(center, pt1, pt2, canvas) {
    let tangent = document.querySelector(".fullTangent-l")
    if (!tangent) {
        tangent = document.createElementNS(svgns, "path");
        tangent.classList.add("fullTangent-l")
        canvas.appendChild(tangent)
    }
    else
        tangent.classList.remove("invisible")

    let linePath = `M ${pt1[0]},${pt1[1]} L ${pt2[0]},${pt2[1]}`

    tangent.setAttribute("style", tangentStyle);
    tangent.setAttribute("d", linePath)

    //drawing center point
    drawDot( canvas, "fullTangent-c0", center, true)

    //drawing dots
    drawDot( canvas, "fullTangent-c1", pt1 );
    drawDot( canvas, "fullTangent-c2", pt2 );
}

function drawBezierCurve( bezierCurve , save = false, preview = false) {
    let bezier = document.querySelector(".currentBezier")
    if (!bezier) {
        bezier = document.createElementNS(svgns, "path");
        bezier.classList.add("currentBezier")
        canvas.appendChild(bezier)
    }
    else
        bezier.classList.remove("invisible")

    let bezierPath = `M ${bezierCurve[0].x},${bezierCurve[0].y} \
    C ${bezierCurve[1].x},${bezierCurve[1].y} \
    ${bezierCurve[2].x},${bezierCurve[2].y} \
    ${bezierCurve[3].x},${bezierCurve[3].y}`;

    bezier.setAttribute("style", preview? curveStylePreview : curveStyle);
    bezier.setAttribute("d", bezierPath)
    if (save)
        bezier.classList.remove("currentBezier")
}

function drawFirstHalfTangent( bezierCurve, canvas)
{
    let tangent = document.querySelector(".firstHalfTangent")
    if (!tangent) {
        tangent = document.createElementNS(svgns, "path");
        tangent.classList.add("firstHalfTangent")
        canvas.appendChild(tangent)
    }
    else
        tangent.classList.remove("invisible")

    let linePath = `M ${bezierCurve[0].x},${bezierCurve[0].y}\
    L ${bezierCurve[1].x},${bezierCurve[1].y}`

    tangent.setAttribute("style", tangentStyle);
    tangent.setAttribute("d", linePath)

    let dot0 = document.querySelector(".firstHalfTangent-c0")

    if (!dot0) {
        dot0 = document.createElementNS(svgns, "circle");
        dot0.classList.add("firstHalfTangent-c0")
        canvas.appendChild(dot0)
    } else
        dot0.classList.remove("invisible")

    dot0.setAttribute("cx", bezierCurve[1].x);
    dot0.setAttribute("cy", bezierCurve[1].y);
    dot0.setAttribute("r", 3);
    dot0.setAttribute("style", dotStyle);
}

canvas.addEventListener('mousedown', e => {
    mousePressed = true;
    if (!started) {
        started = true;
        bezierCurve = []
        bezierCurve.push({ x: e.offsetX, y: e.offsetY })
        console.log("started: ", { x: e.offsetX, y: e.offsetY });
        return;
    }
    if (!finished) {
        finished = true;
        bezierCurve.push({ x: e.offsetX, y: e.offsetY })
        return;
    }



    // console.log("tangent");
    // let dx = e.offsetX - bezierCurve[0].x
    // let dy = e.offsetY - bezierCurve[0].y
    // drawFullTangent( 
    //     [ e.offsetX, e.offsetX ],
    //     [ bezierCurve[0].x - dx, bezierCurve[0].y - dy ],
    //     canvas
    //  )

    // console.log(e);
})
body.addEventListener('mousedown', e => {
    mousePressed = true;
    // console.log( "body down mousePressed: ",mousePressed )
})

canvas.addEventListener('mousemove', e => {

    // adjusting the first tangent
    if (mousePressed && started && !finished) {
        let dx = e.offsetX - bezierCurve[0].x
        let dy = e.offsetY - bezierCurve[0].y
        // console.log( [ e.offsetX, e.offsetY ],
        //     [ bezierCurve[0].x - dx, bezierCurve[0].y - dy ] );
        drawFullTangent(
            [bezierCurve[0].x, bezierCurve[0].y],
            [e.offsetX, e.offsetY],
            [bezierCurve[0].x - dx, bezierCurve[0].y - dy],
            canvas
        )
    }
    // preview of the result before adjusting the last tangent
    else if (!mousePressed && started)
    {
        let ctrx = e.offsetX ;
        let ctry = e.offsetY ;

        bezierCurve2 = [...bezierCurve];
        bezierCurve2.splice(2,0, { x:ctrx,  y:ctry }, { x:ctrx,  y:ctry })
        drawBezierCurve( bezierCurve2, false, true)
    }
    // adjusting the last tangent
    else if (mousePressed && finished) {
        let dx = e.offsetX - bezierCurve.at(-1).x
        let dy = e.offsetY - bezierCurve.at(-1).y
        // console.log( [ e.offsetX, e.offsetY ],
        //     [ bezierCurve[0].x - dx, bezierCurve[0].y - dy ] );
        let ctrx = bezierCurve.at(-1).x - dx;
        let ctry = bezierCurve.at(-1).y - dy;
        
        bezierCurve2 = [...bezierCurve];
        bezierCurve2.splice(2,0, { x:ctrx,  y:ctry } )
        drawBezierCurve( bezierCurve2 )

        drawFirstHalfTangent( bezierCurve, canvas )
        drawFullTangent(
            [bezierCurve.at(-1).x, bezierCurve.at(-1).y],
            [e.offsetX, e.offsetY],
            [ctrx, ctry],
            canvas
        )
    }

})


canvas.addEventListener('mouseup', e => {
    mousePressed = false;
    // if (started && !isCtr0)
    if (started && !finished) {
        bezierCurve.push({
            x: e.offsetX,
            y: e.offsetY
        })
        // isCtr0 = true
    }
    else if (finished) {
        let dx, dy, pt2;
        pt2 = bezierCurve.at(-1);
        dx = e.offsetX - pt2.x
        dy = e.offsetY - pt2.y
        // insert into index : 2  .splice(2, 0, Obj)
        bezierCurve.splice(2, 0, {
            x: pt2.x - dx,
            y: pt2.y - dy
        })

        drawBezierCurve(bezierCurve, true)
        started = true
        finished = false
        bezierCurve = []
        bezierCurve.push( {
            x: pt2.x,
            y: pt2.y
        },
        {
            x: e.offsetX,
            y: e.offsetY
        } )
        console.log( bezierCurve )
        
    }
})
body.addEventListener('mouseup', e => {
    mousePressed = false;
    // console.log( "body up mousePressed: ",mousePressed );
})