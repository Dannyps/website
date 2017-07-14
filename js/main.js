var colors = ["#0000e0", "#c200ff", "#0000ff", "#6000ff", "#00baff", "#00008c"];
var layer1ProbOfHidden = 1;
var layer2ProbOfHidden = 5;
var layer3ProbOfHidden = 20;
var RECTANGLE_SCALE = 1 / 6;

var pixeis = new Array();
var ctx;
var rectangleWidth;
var rectangleHeight;
var tableX;
var tableY;

$(document).ready(function () {

    var logo = document.getElementById('logo');
    var canvas = document.getElementById('canvas');

    rectangleWidth = Math.trunc(logo.width * RECTANGLE_SCALE);
    rectangleHeight = Math.trunc((logo.height - Math.tan(Math.PI / 12 /*15º*/ ) * logo.width) * RECTANGLE_SCALE);

    tableX = Math.trunc(canvas.clientWidth / rectangleWidth);
    tableY = Math.trunc(canvas.clientHeight / rectangleHeight);

    if (canvas.getContext) {
        ctx = canvas.getContext('2d');

        ctx.canvas.width = Math.trunc(tableX * rectangleWidth);
        ctx.canvas.height = Math.trunc(tableY * rectangleHeight);

        initCanvas();
    }

    var rand = Math.floor(Math.random() * 750);
    
    setInterval(clearPixel, rand);
    setInterval(paintPixel, rand);
    setInterval(clearPixel, rand + 300);
    setInterval(paintPixel, rand + 300);
    setInterval(clearPixel, rand + 500);
    setInterval(paintPixel, rand + 500);
    setInterval(clearPixel, rand + 700);
    setInterval(paintPixel, rand + 700);
    setInterval(clearPixel, rand + 900);
    setInterval(paintPixel, rand + 900);

});

function clearPixel(){
    var rand = Math.floor(Math.random() * pixeis.length);

    for(var i=100; i>0; i--){
        let x = rectangleWidth * (i/100);
        let y = rectangleHeight * (i/100);
        ctx.clearRect(pixeis[rand][1], pixeis[rand][2], rectangleWidth, rectangleHeight);
    }
    ctx.clearRect(pixeis[rand][1], pixeis[rand][2], rectangleWidth, rectangleWidth);
    pixeis[rand][0] = "none";
}

function paintPixel(){
    
    while(true){
        let randPos = Math.floor(Math.random() * pixeis.length);
        let rand;
        let xPos = pixeis[randPos][1];
        let yPos = pixeis[randPos][2];

        if ((xPos < (tableX / 12) || xPos > (tableX - (tableX / 12))) || (yPos < (tableY / 12) || yPos > (tableY - (tableY / 12))))
            rand = Math.trunc(Math.random() * (colors.length + layer3ProbOfHidden));
        else if (xPos > (3 * tableX / 12) && xPos < (9 * tableX / 12) && yPos > (3 * tableY / 12) && yPos < (9 * tableY / 12))
            rand = Math.trunc(Math.random() * (colors.length + layer1ProbOfHidden));
        else
            rand = Math.trunc(Math.random() * (colors.length + layer2ProbOfHidden));

        if(pixeis[randPos][0] === "none"){
            ctx.fillStyle = colors[rand];
            ctx.fillRect(xPos, yPos, rectangleWidth, rectangleHeight);
            pixeis[colors[rand],xPos, yPos];
            return;
        }
    }
}


function initCanvas() {


    for (let x = 0; x < tableX; x++) {
        for (let y = 0; y < tableY; y++) {
            let xPos = x * rectangleWidth;
            let yPos = y * rectangleHeight;

            var rand;
            if ((x < (tableX / 12) || x > (tableX - (tableX / 12))) || (y < (tableY / 12) || y > (tableY - (tableY / 12))))
                rand = Math.trunc(Math.random() * (colors.length + layer3ProbOfHidden));
            else if (x > (3 * tableX / 12) && x < (9 * tableX / 12) && y > (3 * tableY / 12) && y < (9 * tableY / 12))
                rand = Math.trunc(Math.random() * (colors.length + layer1ProbOfHidden));
            else
                rand = Math.trunc(Math.random() * (colors.length + layer2ProbOfHidden));

            if (rand < colors.length) {
                pixeis.push([colors[rand], xPos, yPos])
                ctx.fillStyle = colors[rand];
                ctx.fillRect(xPos, yPos, rectangleWidth, rectangleHeight);
            }else{
                pixeis.push(["none", xPos, yPos])
            }
        }
    }

}