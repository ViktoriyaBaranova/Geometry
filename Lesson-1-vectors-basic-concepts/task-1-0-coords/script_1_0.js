"use strict";
const btnCheck = document.querySelector(".check");
const btnReset = document.querySelector(".reset");
const btnBack = document.querySelector(".back");
const condition = document.querySelector(".condition");
const txtArea = document.querySelector('textarea');
var svg = document.getElementById('pic'); 
const btnLine = document.querySelector(".line");
const btnVector = document.querySelector(".vector");
let click = "line was click";
btnLine.style.backgroundColor = "#FFF";
btnLine.style.color = "#000";
let lines = [], vectors = [], coordClickedCircle = [];
var pt = svg.createSVGPoint();

let coordClickedCircles = [], clickedCircles = [];
const numberOfClickCircles = 2;
const sizeSvg = 20;

function draw_svg_line(x1, y1, x2, y2, name, w="1", c="#000") {
    x1 *= 10; y1 *= 10; x2 *= 10; y2 *= 10;
    const path_line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    var s_line = `M ${x1} ${y1} L ${x2} ${y2} `;
    path_line.setAttribute('d', s_line);
    path_line.setAttribute('stroke-linecap', 'round');
    path_line.setAttribute('stroke-linejoin', 'round');
    path_line.setAttribute('stroke-width', w);
    path_line.setAttribute('stroke', c);
    path_line.classList.add(name);
    svg.appendChild(path_line);
}

const draw_svg_circles = (x, y, color)=>{
    x *= 10; y *= 10;
    const circles = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circles.setAttribute("cx",x);
    circles.setAttribute("cy",y);
    circles.setAttribute("r",2.5);
    circles.setAttribute("stroke", color);
    circles.setAttribute("stroke-width", "0.5");
    circles.setAttribute("fill", "#DBE1F9");
    svg.appendChild(circles);
   // <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
    circles.addEventListener('click', (e)=>{
            circles.style.opacity = 1;
            let coordClickedCircles = checkCircles(e);
            if (coordClickedCircles){
                if (click === "vector was click"){
                    drawElem(coordClickedCircles, 'vector', draw_svg_vect);
                    vectors.push(coordClickedCircles);
                } else{
                    drawElem(coordClickedCircles, 'line', draw_svg_line);  
                    lines.push(coordClickedCircles);
                }
            }
        });
    circles.addEventListener('mouseover', (e)=> circles.style.opacity = 0.5);
    circles.addEventListener('mouseout', (e)=>circles.style.opacity = 0);
}

const drawElem =(arrCoords, nameEl, func)=>{
    func(arrCoords[0], arrCoords[1], arrCoords[2], arrCoords[3], nameEl);
    const el = svg.querySelector(".move-"+nameEl);
    svg.removeChild(el);   
}
    
function draw_svg_vect(x1, y1, x2, y2, name) {
    x1 *= 10; y1 *= 10; x2 *= 10; y2 *= 10;
    const path_vect = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    var dx = x2 - x1, dy = y2 - y1;
    var len = Math.sqrt(dx * dx + dy * dy);
    dx /= len; dy /= len;
    var alen = 2.5;
    var ax = x2 - (alen+1) * dx, ay = y2 - (alen) * dy;
    
    var s_vect = `M ${x1} ${y1} L ${x2} ${y2} ` +
        " L " + (ax + dy * alen) + " " + (ay - dx * alen) +
        " M " + x2 + " " + y2 +
        " L " + (ax - dy * alen) + " " + (ay + dx * alen);
    path_vect.setAttribute('d', s_vect);
    path_vect.setAttribute('stroke-linecap', 'round');
    path_vect.setAttribute('stroke-linejoin', 'round');
    path_vect.setAttribute('stroke-width', '1.3');
    path_vect.setAttribute('stroke', '#1683C9');
    path_vect.setAttribute('data-len', len / 10); 
    path_vect.classList.add(name);
    /*path_vect.addEventListener('click', function () {
        path_vect.setAttribute('stroke', cursor.style.backgroundColor);
    });*/
    //svg.appendChild(path_vect);
    svg.insertBefore(path_vect, svg.querySelectorAll('circle')[0]);
}

const draw_svg_grid = () =>{
    for (let i = 0; i < sizeSvg+2; ++i){
        draw_svg_line(i, 0, i, sizeSvg+1, 'line', '0.5', '#dcdcdc');
        draw_svg_line(0, i, sizeSvg+1, i, 'line', '0.5', '#dcdcdc');
    }
    for (let i=1; i<sizeSvg; ++i)
        for (let j=1; j<sizeSvg; ++j)
            draw_svg_circles(i, j, "#224bcf");
    
}

const createSyle = (click, str1, str2, width) =>{
    click.forEach((elem)=>{
        elem.setAttribute('stroke', str1);
        elem.setAttribute('fill', str2);
        elem.setAttribute("stroke-width", width);
    });
}

const checkCircles = (e)=>{
    const clickedCircle = e.target;
    console.log(pt.x, pt.y);
    if (!clickedCircle.classList.contains("clicked")){
        clickedCircle.addEventListener('mouseout', (e)=>clickedCircle.style.opacity = 1);
        clickedCircle.classList.add("clicked");
        coordClickedCircle = [];
        clickedCircles.push(clickedCircle);
        createSyle(clickedCircles, '#224bcf', '#224bcf');
        
        if (clickedCircles.length === numberOfClickCircles){
            let coordClickedCircles = [];
            for (let i=0; i<numberOfClickCircles; i++){
                coordClickedCircles.push(Number(clickedCircles[i].getAttribute("cx"))/10);
                coordClickedCircles.push(Number(clickedCircles[i].getAttribute("cy"))/10);
            }
            clickedCircles.forEach(el=> {
                el.classList.remove("clicked"); 
                el.style.opacity = 0;
                el.addEventListener('mouseout', (e)=>el.style.opacity = 0);
            });
            createSyle(clickedCircles, '#224bcf', '#DBE1F9', '0.5');
            clickedCircles = [];
            return coordClickedCircles;
        }
        coordClickedCircle.push(Number(clickedCircle.getAttribute("cx"))/10);
        coordClickedCircle.push(Number(clickedCircle.getAttribute("cy"))/10);
    }else{
        clickedCircle.classList.remove("clicked");
        createSyle(clickedCircles, '#224bcf', '#DBE1F9', '0.5');
        clickedCircle.addEventListener('mouseout', (e)=> clickedCircle.style.opacity = 0);
        clickedCircles = [];
    }
}

btnLine.addEventListener("click", () => {
    click = "line was click";
    btnLine.style.backgroundColor = "#FFF";
    btnLine.style.color = "#000";
    btnVector.style.backgroundColor = "#414141";
    btnVector.style.color = "#FFF";
});

btnVector.addEventListener("click", () => {
    click = "vector was click";
    btnVector.style.backgroundColor = "#FFF";
    btnVector.style.color = "#000";
    btnLine.style.backgroundColor = "#414141";
    btnLine.style.color = "#FFF";
});

btnCheck.addEventListener("click", () => {
    txtArea.textContent = "lines:[\n"
    lines.forEach(line=>{
        txtArea.textContent +=`[${line[0]}, ${line[1]}, ${line[2]}, ${line[3]}],`+"\n";
    });
    txtArea.textContent += "]\nvectors:[\n"
    vectors.forEach(vect=>{
        txtArea.textContent +=`[${vect[0]}, ${vect[1]}, ${vect[2]}, ${vect[3]}],`+"\n";
    });
    txtArea.textContent +="]";
    txtArea.select();
    document.execCommand("copy");

});

const drawMoveElem = (arr, p, name, func)=>{
    func(arr[0], arr[1], Math.round(p.x)/10, Math.round(p.y)/10, name);
    const el = svg.querySelectorAll("."+name);
    console.log(el);
    for (let i=0; i<el.length-1; i++)
        svg.removeChild(el[i]);
}
svg.addEventListener('mousemove', function(e){
    var ptt = svg.createSVGPoint();
    ptt.x = e.pageX-2;
    ptt.y = e.pageY-2;
    ptt = ptt.matrixTransform(svg.getScreenCTM().inverse()); 
    if(coordClickedCircle.length !== 0) 
        (click === "vector was click") ? 
            drawMoveElem(coordClickedCircle, ptt, 'move-vector', draw_svg_vect) : 
            drawMoveElem(coordClickedCircle, ptt, 'move-line', draw_svg_line);    
}, false);

/*let arr = [];
svg.addEventListener('click', function(e){
    pt = svg.createSVGPoint();
    pt.x = e.pageX;
    pt.y = e.pageY;
    pt = pt.matrixTransform(svg.getScreenCTM().inverse());
    arr.push(Math.round(pt.x)/10), arr.push(Math.round(pt.y)/10);
    if (arr.length === 4) {
        draw_svg_vect(arr[0], arr[1], arr[2], arr[3]);
        arr = [];
    }
    console.log(pt); 
});*/
draw_svg_grid();
