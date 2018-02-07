var can = document.getElementById("can");
var ctx = can.getContext("2d");
var resizing = 0,gt;
function resize() {
    can.width = window.innerWidth;
    can.height = window.innerHeight;
    resizing = 1;
}
resize();
window.onresize = resize;

function tree(options) {
    if (options.circles) {
        ctx.beginPath();
        ctx.fillStyle = "rgba("+~~options.color[0]+","+~~options.color[1]+","+~~options.color[2]+","+options.color[3]+")";
        ctx.arc(options.coord.x, options.coord.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }    
    if (options["initial-len"] < options["threshold-len"]) 
        return;
    var obj = JSON.stringify(options);
    var left = JSON.parse(obj);
    var right = JSON.parse(obj);
        left["initial-angle"] = left["initial-angle"] + left["left-step-angle"];
        right["initial-angle"] = right["initial-angle"] + right["right-step-angle"];

    left["initial-len"] *= left["branch-len"];
    right["initial-len"] *= right["branch-len"];
    var x = options.coord.x + Math.sin(Math.PI / 180 * options["initial-angle"]) * options["initial-len"];
    var y = options.coord.y - Math.cos(Math.PI / 180 * options["initial-angle"]) * options["initial-len"];

    ctx.beginPath();
    ctx.moveTo(options.coord.x, options.coord.y);
    ctx.lineTo(x, y);
    // ctx.closePath();
    ctx.lineWidth = "1"
    ctx.lineCap = 'round';
    ctx.stroke();
    right.coord = left.coord = {
        x: x,
        y: y
    };
    //you can directly call the functions here..
    //but this kinda looks cool.
    //and also
    //it prevents lags
    //or atleast does not have an opportunity to lag.
    if(options.delay)
        gt = setTimeout(() => {
           tree(right);
           tree(left);
        });
    else {
        tree(right);
        tree(left);
    }
    return;
}








var options = {
    "initial-angle": 0,
    "left-step-angle": 75,
    "right-step-angle": -30,
    "branch-len": 0.7,
    "initial-len": 150,
    "threshold-len": 2,
    circles: true,
    delay:true,
    color: [255, 0, 100, 0.07],
    coord: {
        x: can.width / 2,
        y:can.height*0.8
    }
};

function gui() {
    var gui = new dat.GUI();
    gui.add(options, "left-step-angle", -180, 180).step(1);
    gui.add(options, "right-step-angle", -180, 180).step(1);
    gui.add(options, "branch-len", 0.1, 0.9).step(0.1);
    gui.add(options, "initial-len", 1, 200).step(1);
    gui.add(options, "threshold-len", 1, options["initial-len"] - 1).step(1);
    gui.add(options, "delay");
    gui.add(options, "circles");
    gui.addColor(options, "color");
    gui.close();
}
gui();
var prevOption;
function draw() {
    if (JSON.stringify(options) != JSON.stringify(prevOption) || resizing) {
        while (gt)
            clearTimeout(gt--);
        clearTimeout();
        prevOption = Object.assign({}, options);
        ctx.clearRect(0, 0, can.width, can.height);
        tree(options);
        resizing = 0;
    }
    requestAnimationFrame(draw);
}
requestAnimationFrame(draw);