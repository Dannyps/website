var colors = ["#0000e0", "#c200ff", "#0000ff", "#6000ff", "#00baff", "#00008c"];
var layer1ProbOfHidden = 1;
var layer2ProbOfHidden = 5;
var layer3ProbOfHidden = 20;
var RECTANGLE_SCALE = 1 / 4;

var filledPositions = [];
var unfilledPositions = [];
var rectangleWidth = 0;
var rectangleHeight = 0;
var intervals = [];
var tableX;
var tableY;

function draw() {
    var logo = document.getElementById('logo');
    if (logo === null || document.getElementById('canvas') === null) {
        // Page doesn't have pixel canvas
        return;
    }

    filledPositions = [];
    rectangleWidth = Math.trunc(logo.clientWidth * RECTANGLE_SCALE);
    rectangleHeight = Math.trunc(logo.offsetHeight * RECTANGLE_SCALE);

    var canvas = document.getElementById('canvas');
    tableX = Math.trunc(( canvas.clientWidth) / rectangleWidth);
    tableY = Math.trunc(( canvas.clientHeight) / rectangleHeight);

    var offsetX = Math.round((canvas.clientWidth - logo.clientWidth) / 2) -
        (Math.trunc((canvas.clientWidth - logo.clientWidth) / (2 * rectangleWidth)) * rectangleWidth);

    var offsetY = Math.round((canvas.clientHeight - logo.offsetHeight) / 2) -
        (Math.trunc((canvas.clientHeight - logo.offsetHeight) / (2 * rectangleHeight)) * rectangleHeight);

    var logoXmin = Math.trunc((canvas.clientWidth - rectangleWidth / RECTANGLE_SCALE) / 2) - 1;
    var logoXmax = Math.trunc((canvas.clientWidth + rectangleWidth / RECTANGLE_SCALE) / 2) - 1;
    var logoYmin = Math.trunc((canvas.clientHeight - rectangleHeight / RECTANGLE_SCALE) / 2) - 1;
    var logoYmax = Math.trunc((canvas.clientHeight + rectangleHeight / RECTANGLE_SCALE) / 2) - 1;

    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');

        ctx.canvas.width = canvas.clientWidth;
        ctx.canvas.height = canvas.clientHeight;

        for (let x = 0; x < tableX; x++) {
            for (let y = 0; y < tableY; y++) {
                let xPos = x * rectangleWidth + offsetX;
                let yPos = y * rectangleHeight + offsetY;

                if (xPos >= logoXmin && xPos < logoXmax && yPos >= logoYmin && yPos < logoYmax)
                    continue;

                var rand;
                if ((x < (tableX / 12) || x > (tableX - (tableX / 12))) || (y < (tableY / 12) || y > (tableY - (tableY / 12))))
                    rand = Math.trunc(Math.random() * (colors.length + layer3ProbOfHidden));
                else if (x > (3 * tableX / 12) && x < (9 * tableX / 12) && y > (3 * tableY / 12) && y < (9 * tableY / 12))
                    rand = Math.trunc(Math.random() * (colors.length + layer1ProbOfHidden));
                else
                    rand = Math.trunc(Math.random() * (colors.length + layer2ProbOfHidden));

                if (rand < colors.length) {
                    ctx.fillStyle = colors[rand];
                    ctx.fillRect(xPos, yPos, rectangleWidth, rectangleHeight);
                    filledPositions.push([xPos, yPos]);
                }else{
                    unfilledPositions.push([xPos, yPos]);
                }
            }
        }
    }

    setupIntervalChanges();
}

function setupIntervalChanges() {
    for (var i = 0; i < intervals.length; ++i) {
        clearInterval(intervals[i]);
    }

    var numIntervals = Math.floor(filledPositions.length * 0.1);
    for (var i = 0; i < numIntervals; ++i) {
        intervals.push(setInterval(changeRandomRectangle, Math.floor(Math.random() * 1000) + 300));
    }
}


function changeRandomRectangle() {
    let posIndex = Math.floor(Math.random() * (filledPositions.length - 1));
    let newPosIndex = Math.floor(Math.random() * (unfilledPositions.length - 1));
    let colorIndex = Math.floor(Math.random() * (colors.length - 1));
    let ctx = canvas.getContext('2d');
    let tempX = filledPositions[posIndex][0];
    let tempY = filledPositions[posIndex][1];
    let newX = unfilledPositions[newPosIndex][0];
    let newY = unfilledPositions[newPosIndex][1]; 
    
    //Use the same probability when selecting new pixel to paint
    let rand;
    if ((newX < (tableX / 12) || newX > (tableX - (tableX / 12))) || (newY < (tableY / 12) || newY > (tableY - (tableY / 12))))
        rand = Math.trunc(Math.random() * (colors.length + layer3ProbOfHidden));
    else if (newX > (3 * tableX / 12) && newX < (9 * tableX / 12) && newY > (3 * tableY / 12) && newY < (9 * tableY / 12))
        rand = Math.trunc(Math.random() * (colors.length + layer1ProbOfHidden));
    else
        rand = Math.trunc(Math.random() * (colors.length + layer2ProbOfHidden));

    if (rand < colors.length) {
        ctx.fillStyle = colors[rand];
        //Remove pixel
        ctx.clearRect(tempX, tempY, rectangleWidth, rectangleHeight);
        filledPositions.splice(posIndex,1);
        ctx.fillRect(unfilledPositions[newPosIndex][0], unfilledPositions[newPosIndex][1], rectangleWidth, rectangleHeight);
    
        //Add new pixel to filled list, remove new pixel from unfilled list and add removed pixel to the unfilled list
        filledPositions.push([unfilledPositions[newPosIndex][0], unfilledPositions[newPosIndex][1]]);
        unfilledPositions.splice(newPosIndex,1);
        unfilledPositions.push([tempX,tempY]);
    }    
}