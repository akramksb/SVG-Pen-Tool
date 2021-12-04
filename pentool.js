body = document.querySelector("html")
canvas = document.querySelector(".pentoolSVG")

const svgns = "http://www.w3.org/2000/svg";
const curveStyle = "fill: none; stroke: green; stroke-width: 2px;";
const tangentStyle = "fill: none; stroke: rgb(212, 131, 39) ;stroke-width: 1.5px;";
const dotStyle = "fill: rgb(235, 190, 43); stroke: none;";

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
    let dot0 = document.querySelector(".fullTangent-c0")

    if (!dot0) {
        dot0 = document.createElementNS(svgns, "circle");
        dot0.classList.add("fullTangent-c0")
        canvas.appendChild(dot0)
    } else
        tangent.classList.remove("invisible")


    dot0.setAttribute("cx", center[0]);
    dot0.setAttribute("cy", center[1]);
    dot0.setAttribute("r", 3);
    dot0.setAttribute("style", dotStyle);

    //drawing dots

    let dot1 = document.querySelector(".fullTangent-c1")
    let dot2 = document.querySelector(".fullTangent-c2")

    if (!dot1) {
        dot1 = document.createElementNS(svgns, "circle");
        dot1.classList.add("fullTangent-c1")
        canvas.appendChild(dot1)
    } else
        tangent.classList.remove("invisible")

    if (!dot2) {
        dot2 = document.createElementNS(svgns, "circle");
        dot2.classList.add("fullTangent-c2")
        canvas.appendChild(dot2)
    } else
        tangent.classList.remove("invisible")

    dot1.setAttribute("cx", pt1[0]);
    dot1.setAttribute("cy", pt1[1]);
    dot1.setAttribute("r", 3);
    dot1.setAttribute("style", dotStyle);

    dot2.setAttribute("cx", pt2[0]);
    dot2.setAttribute("cy", pt2[1]);
    dot2.setAttribute("r", 3);
    dot2.setAttribute("style", dotStyle);
}

function drawBezierCurve( bezierCurve , save) {
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

    bezier.setAttribute("style", curveStyle);
    bezier.setAttribute("d", bezierPath)
    if (save)
        bezier.classList.remove("currentBezier")
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
    if (!mousePressed)
        return;

    if (started && !finished) {
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
    else if (finished) {
        let dx = e.offsetX - bezierCurve.at(-1).x
        let dy = e.offsetY - bezierCurve.at(-1).y
        // console.log( [ e.offsetX, e.offsetY ],
        //     [ bezierCurve[0].x - dx, bezierCurve[0].y - dy ] );
        let ctrx = bezierCurve.at(-1).x - dx;
        let ctry = bezierCurve.at(-1).y - dy;
        drawFullTangent(
            [bezierCurve.at(-1).x, bezierCurve.at(-1).y],
            [e.offsetX, e.offsetY],
            [ctrx, ctry],
            canvas
        )

        bezierCurve2 = [...bezierCurve];
        bezierCurve2.splice(2,0, { x:ctrx,  y:ctry } )
        drawBezierCurve( bezierCurve2 ,false)
    }

})


canvas.addEventListener('mouseup', e => {
    mousePressed = false;
    // if (started && !isCtr0)
    if (started && !finished) {
        let dx, dy;
        dx = e.offsetX - bezierCurve[0].x
        dy = e.offsetY - bezierCurve[0].y
        bezierCurve.push({
            x: bezierCurve[0].x - dx,
            y: bezierCurve[0].y - dy
        })
        // isCtr0 = true
    }
    else if (finished) {
        let dx, dy;
        dx = e.offsetX - bezierCurve.at(-1).x
        dy = e.offsetY - bezierCurve.at(-1).y
        // insert into index : 2  .splice(2, 0, Obj)
        bezierCurve.splice(2, 0, {
            x: bezierCurve.at(-1).x - dx,
            y: bezierCurve.at(-1).y - dy
        })

        drawBezierCurve(bezierCurve, true)
        started = false
        finished = false
        bezierCurve = []
    }
})
body.addEventListener('mouseup', e => {
    mousePressed = false;
    // console.log( "body up mousePressed: ",mousePressed );
})