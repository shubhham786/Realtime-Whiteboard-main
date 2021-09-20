let canvas = document.querySelector("canvas");
canvas.height = window.innerHeight
canvas.width = window.innerWidth;
const tool = canvas.getContext("2d");
tool.fillStyle="white";
tool.fillRect(0,0,canvas.width,canvas.height);
let isMouseDown = false;
let undoStack = [];
let redoStack = [];
function getCoordinates(y){
    let bounds = canvas.getBoundingClientRect();
    return y - bounds.y;
}
let tools = document.querySelectorAll(".tool-image");
for(let i =0; i<tools.length ; i++){
    tools[i].addEventListener("click",function(e){
        let ctool = e.currentTarget;
        let name = ctool.getAttribute("id");
        if(name=="pencil"){
            write();
        }
        else if(name=="sticky"){
            createsticky();
        }
        else if (name == "eraser"){
            erase();
        }
        else if(name=="undo")
        {
            undomaker();
        }
        else if(name=="redo")
        {
            redomaker();
        }
        else if(name=="download")
        {
            downloadBoard();
        }
        else if(name=="upload")
        {
            uploadfile();
        }
    })
}
function write(){
    
    canvas.addEventListener("mousedown",function(e){
        tool.strokeStyle="black"
        console.log("moved");
        tool.beginPath();
        let x = e.clientX ;
        let y = getCoordinates(e.clientY);
        tool.moveTo(e.clientX,getCoordinates(e.clientY));
        isMouseDown = true;
        let pointDesc = {
            x: x,
            y: y,
            desc: "md",
            colorss:"black"
        }
        undoStack.push(pointDesc);
    })
    canvas.addEventListener("mousemove",function(e){
        if(isMouseDown){
            tool.lineTo(e.clientX,getCoordinates(e.clientY));
            tool.stroke();
            let x = e.clientX;
            let y =getCoordinates(e.clientY);
            let pointDesc = {
                x: x,
                y: y,
                desc: "mm",
                colorss:"black" 
            }
            undoStack.push(pointDesc);
        }
        
    })
    canvas.addEventListener("mouseup",function(e){
        isMouseDown = false;
    })
    
}
function erase(){
    canvas.addEventListener("mousedown",function(e){
        tool.strokeStyle="white";
        tool.beginPath();
        let x = e.clientX ;
        let y = getCoordinates(e.clientY);
        tool.moveTo(e.clientX,getCoordinates(e.clientY));
        isMouseDown = true;
        let pointDesc = {
            x: x,
            y: y,
            desc: "md",
            colorss:"white"
        }
        undoStack.push(pointDesc);
    })
    canvas.addEventListener("mousemove",function(e){
        if(isMouseDown){
            tool.lineTo(e.clientX,getCoordinates(e.clientY));
            tool.stroke();
            let x = e.clientX;
            let y =getCoordinates(e.clientY);
            let pointDesc = {
                x: x,
                y: y,
                desc: "mm",
                colorss:"white"
            }
            undoStack.push(pointDesc);
        }
        
    })
    canvas.addEventListener("mouseup",function(e){
        isMouseDown = false;
    })
}
function createBox(){
    let stickyPad = document.createElement("div");
    let navBar = document.createElement("div");
    let close = document.createElement("div");
    let minimize = document.createElement("div");
    let textArea = document.createElement("div");
    stickyPad.setAttribute("class","stickypad");
    navBar.setAttribute("class","navbar");
    close.setAttribute("class","close");
    minimize.setAttribute("class","minimize");
    textArea.setAttribute("class","text-area");
    stickyPad.appendChild(navBar);
    stickyPad.appendChild(textArea);
    navBar.appendChild(minimize);
    navBar.appendChild(close);
    document.body.appendChild(stickyPad);
    let initialX = null;
    let initialY = null;
    let isStickyDown = false;
    let isMinimized = true;

    // sticky code 
    navBar.addEventListener("mousedown", function (e) {
        // initial point
        console.log("clicked");
        initialX = e.clientX
        initialY = e.clientY
        isStickyDown = true;
    })
    canvas.addEventListener("mousemove", function (e) {
        if (isStickyDown == true) {
            // final point 
            let finalX = e.clientX;
            let finalY = e.clientY;
            //  distance
            let dx = finalX - initialX;
            let dy = finalY - initialY;
            //  move sticky
            //original top left
            let { top, left } = stickyPad.getBoundingClientRect()
            // stickyPad.style.top=10+"px";
            stickyPad.style.top = top + dy + "px";
            stickyPad.style.left = left + dx + "px";
            initialX = finalX;
            initialY = finalY;
        }
    })
    window.addEventListener("mouseup", function () {
        isStickyDown = false;
    })
    minimize.addEventListener("click", function () {
        if (isMinimized) {
            textArea.style.display = "none";
        } else {
            textArea.style.display = "block";

        }
        isMinimized = !isMinimized
    })
    close.addEventListener("click", function () {
        stickyPad.remove();
    })
    return textArea;
}
function createsticky() {


    let textArea = createBox();
    let textBox = document.createElement("textarea");
    textBox.setAttribute("class", "textarea");
    // create subtree
    textArea.appendChild(textBox);
    // add subtree to page


}
function undomaker() {
    // clear board
    console.log("undo called");
    tool.clearRect(0, 0, canvas.width, canvas.height);
    // pop last point
    // undoStack.pop();
    while (undoStack.length > 0) {
        let curObj = undoStack[undoStack.length - 1];
        if (curObj.desc == "md") {
            redoStack.push(undoStack.pop());
            break;
        } else if (curObj.desc == "mm") {
            redoStack.push(undoStack.pop());
        }
    }
    // redraw
    redraw();
}
// ************redo*************
function redomaker() {
    tool.clearRect(0, 0, canvas.width, canvas.height);
    while (redoStack.length > 0) {
        let curObj = redoStack[redoStack.length - 1];
        if (curObj.desc == "md") {
            undoStack.push(redoStack.pop());
            break;
        } else if (curObj.desc == "mm") {
            undoStack.push(redoStack.pop());
        }
    }
    redraw();
}
function redraw() {
    for (let i = 0; i < undoStack.length; i++) {
        let { x, y, desc,colorss} = undoStack[i];
        if (desc == "md") {
            tool.strokeStyle = undoStack[i].colorss;
            tool.beginPath();
            tool.moveTo(x, y);
        } else if (desc == "mm") {
            tool.lineTo(x, y);
            tool.stroke();
        }
    }
}
function downloadBoard() {
    //  create an anchor
    // e.preventDefault();
    let a = document.createElement("a");
    //  set filename to it's download attribute
    a.download = "file.png";
    //  convert board to url 
    let url = canvas.toDataURL("image/jpeg;base64");
    //  set as href of anchor
    a.href = url;
    // click the anchor
    a.click();
    // //  reload behaviour does not get triggerd
    // a.remove();
}
let imgInput = document.querySelector("#acceptImg");
function uploadfile(){

        imgInput.click();
        imgInput.addEventListener("change", function () {
        let imgObj = imgInput.files[0];
        let imgLink = URL.createObjectURL(imgObj);
        let textBox = createBox();
        let img = document.createElement("img");
        img.setAttribute("class", "upload-img");
        img.src = imgLink;
        textBox.appendChild(img);
    })
}