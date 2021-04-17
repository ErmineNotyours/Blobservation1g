var canvas = document.getElementById('canvas');
// if (canvas.getContext) {}
var ctx = canvas.getContext('2d');
let h = 40; // height
let w = 60; // width
let scale = 15;
let size;
let allowDiagonals = true;
let blob = [{"x" : this.x,
            "y" : this.y,
            "moveX" : this.moveX,
            "moveY" : this.moveY,
            "size" : this.size}];

  if (h === undefined)
  h = w

  // this.w = w
  // this.h = h

  //console.log({h, w})
ctx.font = scale.toString()+'px serif';

var getXY = function() {
  var canvas = document.getElementById('ctx');
  var rect = canvas.getBoundingClientRect(); //absolute position of canvas
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
};

var heightField = document.getElementById("height");
heightField.value = h;

heightField.addEventListener('input', () =>{
  h = heightField.value;
  if (h < 8){
    h = 8;
    heightField.value = h;
  }
  //Blobservation();
  generateChecker();
  redraw();
})

var widthField = document.getElementById("width");
widthField.value = w;

widthField.addEventListener('input', () =>{
  w = widthField.value;
  if (w < 8){
    w = 8;
    widthField.value = w;
  }
  //Blobservation();
  generateChecker();
  redraw();
})

var modePopup = document.getElementById('mode');
console.log({modePopup})

// write code for modePopup

var diagonalsCheckbox = document.querySelector('input[id="diagonals"]');

diagonalsCheckbox.addEventListener('change', () => {
  if(diagonalsCheckbox.checked) {
    allowDiagonals = true;
  } else {
    allowDiagonals = false;
  }
});

var speed = 250;
var speedRange = document.getElementById("speed");

speedRange.addEventListener('change', () =>{
  speed = 500 - speedRange.valueAsNumber
})

var runMode = false;
var modeButton = document.getElementById('runMode');

modeButton.addEventListener('click', () => {
  runMode = !runMode;
  // toggle height, width & run mode elements between disabled and regular
  if (runMode){
    widthField.disabled = true;
    heightField.disabled = true;
    modePopup.disabled = true; 
    modeButton.textContent = "Pause"
    drawMove();
  }
  else{
    widthField.disabled = false;
    heightField.disabled = false;
    modePopup.disabled = false;
    modeButton.textContent = "Run"
  }
})

function redraw(){
  drawInitial();
  for (var i = 0; i < w; i++)
    for (var j = 0; j < h; j++){
      if (blobs[j][i] !== 0)
        ctx.fillText((blobs[j][i]).toString(), i*scale, (j*scale) + scale);
    }
}

function drawMove(){
  if (blob.length > 0)
    if (runMode)
      setTimeout(function() {
        move();
        redraw();
        drawMove()}, speed);
}

function drawInitial(){
  // draw initial board
  ctx.strokeStyle = 'gray';
  ctx.clearRect(0,0, (1+w)*scale, (1+h)*scale);
  ctx.strokeRect(0,0, w*scale, h*scale);

  for (var i = 1; i < w; i++){
    ctx.beginPath(); // horizontal lines
    ctx.moveTo(i*scale, 0);
    ctx.lineTo(i*scale, h*scale);
    ctx.stroke();
  }
  for (var j = 1; j < h; j++){ // Vertical lines
    ctx.beginPath();
    ctx.moveTo(0, j*scale);
    ctx.lineTo(w*scale, j*scale);
    ctx.closePath();
    ctx.stroke();
  }
  ctx.strokeStyle = 'black';
}

//function Blobservation ()
//{ // Changed class to function.  Removed constructor.

  
  //console.log('Defining blobs')
  let blobs = new Array(h)
  let futureBlobs = new Array(h)
  for (let i = 0; i < h; i++){
    blobs[i] = new Array(w)
    futureBlobs[i] = new Array(w)
  }

  for(i = 0; i < h; i++)
    for(var l = 0; l < w; l++){
      blobs[i][l] = 0; // Populate array with zeros
      futureBlobs[i][l] = 0;
    }
      //console.log({blobs})
//}

// Populate random blobs
var generateBlobs = function() {
  //Random block placement code from Mazebreaker
  drawInitial();
  var count = 1; 
  for (var i = 0; i < w; i++){ // w == 30
    for (var j = 0; j < h; j++){ // h == 20
      if ((Math.floor(Math.random() * 10) < 10)){ // change elements to make more or fewer blobs
        blob.push ({x : i, // pushes first one as index 1.  Leaves index 0 as undefined
                    y : j,
                    size : 1 + Math.floor(Math.random() * 20)});                       
                    blobs[j][i] = blob[count].size; // Put on array.
        ctx.fillText(blobs[j][i].toString(), i*scale, (j*scale) + scale);
        //console.log({i, j}, blobs[j][i])
        count++;
      } // end if
    } // next j
  } // next i
  //console.log('Generation 0',{blobs})
}


var generateChecker = function() {
//Checkerboard alternating 1 & 2 block placement
drawInitial();
var count = 1; 
for (var i = 0; i < w; i++){ // w == 30
  for (var j = 0; j < h; j++){ // h == 20
    blob.push ({x : i, // pushes first one as index 1.  Leaves index 0 as undefined
                y : j,
                size : 1 + Math.floor(Math.floor(1+(i+j)/2)-((i+j)/2))});
                //size : 1 + Math.floor((1+(i+j)/3)-((i+j)/3))}); // Makes majority 2s with fewer 1s.  Minimum 3 for the divisor.
                //size : 1 + Math.floor((1+(i)/3)-((i)/3))}); // creates columns of 1s (i) or rows of 1s (j).
                blobs[j][i] = blob[count].size; // Put on array.
    ctx.fillText(blobs[j][i].toString(), i*scale, (j*scale) + scale);
    //console.log({i, j}, blobs[j][i])
    count++;
  } // next j
} // next i
//console.log('Generation 0',{blobs})
//blobs[h/2][w/2] = 1
};
  generateChecker();
  //generateBlobs();
  //console.log('Generation 0',{blobs})
  // this.populate = function(generation0){
  //   console.log({generation0})
    
  // for (let l = 0; l<= generation0.length -1; l++){
  //   // Test for invalid input
  //   if (!Number.isInteger(generation0[l].size) || (generation0[l].size > 20) || (generation0[l].size < 1))
  //     throw 'Invalid input'
  //   blobs[generation0[l].y][generation0[l].x] += generation0[l].size;
  // }
  
  // console.log({blobs})
    
  // }
  //return blobs
    
//} // Blobservation
    function move(moves){
      
      function compareNumbers(a, b) { //https://stackoverflow.com/questions/17708608/sort-object-then-subsort-further-javascript
        if (a.distance > b.distance)
          return 1
        else if (a.distance < b.distance)
          return -1
        else 
          if (a.size < b.size)
            return 1
          else if (a.size > b.size)
            return -1
          else
            return a.angle - b.angle //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
      }

      if (moves < 0)
        throw 'Invalid input'
      if (moves === undefined)
        moves = 1
      //console.log({moves, blobs})
      let j, angle, y2, x2, distance, size, moveX, moveY
      let candidates = [{"distance" : this.distance,
                         "x2" : this.x2,
                         "y2" : this.y2,
                         "moveX" : this.moveX,
                         "moveY" : this.moveY,
                         "angle" : this.angle,
                         "size" : this.size}]
      let angleCalc = [[7, 0, 1], // Clockwise rotation straight up translation for moveY, moveX
                       [6, 0, 2], // Center position is x1's own location.  Not used; 0 is there for spacing
                       [5, 4, 3]] // Assuming angleCalc[MoveY+1][moveX+1] order
      blob = [];

      for (let moveCounter = 1; moveCounter <= moves; moveCounter++){
        for (let y1 = 0; y1 < h; y1++)
          for (let x1 = 0; x1 < w; x1++){
            candidates = []
            //console.log({x1, y1, blobs})
            if (blobs[y1][x1] != 0){ // Skip blank blobs
              for (let y2 = 0; y2 < h; y2++)
                for (let x2 = 0; x2 < w; x2++){
                  //console.log('Inside x2, y2', {x1, y1, x2, y2}, blobs[y2][x2], blobs[y1][x1])
                  if (blobs[y2][x2] != 0 && blobs[y2][x2] < blobs[y1][x1]){ // Look for blobs of a lesser value
                    //console.log('Before assignment',{x1, y1, x2, y2}) 
                    distance = Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2)) // distance in steps to get there. Chebyshev distance.
                    if (Math.abs(x1 - x2) === Math.abs(y1 - y2))
                      if (allowDiagonals)
                        distance -= 0.5 // Give edge to diagonals.
                    size = blobs[y2][x2]
                    if (x1 < x2)
                      moveX = 1
                    if (x1 === x2)
                      moveX = 0
                    if (x1 > x2)
                      moveX = -1
                    if (y1 < y2)
                      moveY = 1
                    if (y1 === y2)
                      moveY = 0
                    if (y1 > y2)
                      moveY = -1
                    
                    angle = angleCalc[moveY + 1][moveX + 1]
                    
                    candidates.push ({distance: distance,
                                    x2 : x2, 
                                    y2 : y2,
                                    moveX : moveX,
                                    moveY : moveY,
                                    angle : angle,
                                    size : size})
                      // console.log('After assignemnt', {x1, y1, candidates})
                    } // end if look for lesser value
                  } // next x2
                //console.log('After x2, y2 loops', {x1, y1, candidates}, blobs[y1][x1])
                //console.log('candidates,entries()',candidates.entries())
                if (candidates.length > 0){
                  candidates.sort(compareNumbers)
                  //console.log('After sort',{candidates})
                  futureBlobs[y1 + candidates[0].moveY][x1 + candidates[0].moveX] += blobs[y1][x1]
                  blob.push ({x : x1,
                              y : y1,
                              moveX : candidates[0].moveX,
                              moveY : candidates[0].moveY,
                              size : candidates[0].size});
                  //console.log({futureBlobs})
                }
                else // If no candidates, the blob under x1, y1 is among the lowest value blobs, and will be stationary
                  futureBlobs[y1][x1] += blobs[y1][x1]
                               
            } // end if blobs != 0
      } // next x1
      //console.log('Copy over futureBlobs to blobs', {moveCounter})
      for(i = 0; i < h; i++) 
        for(l = 0; l < w; l++){
          blobs[i][l] = futureBlobs[i][l];
          futureBlobs[i][l] = 0;
        }
      } // next moveCounter
      //console.log('Final', {blobs, blob})
  } // move
    
    this.print_state = function(){
      let result = new Array()
      let counter = 0
      for (let l = 0; l < w; l++){
        for (let i = 0; i < h; i++){
          if (blobs[i][l] !== 0){
            result[counter] = [l, i, blobs[i][l]]
            counter++
          }  
        }
      }
      return result
    }
    
  //} // Blobservation (w, h)
//}


// function animate(){
//   ctx.globalCompositeOperation = xor;
//   for (i = 1; i < length.blob; i++){
//     ctx.fillText(blob[i].size.toString(), blob[i].x*scale, (blob[i].y*scale) + scale);

//   }
// }
// animate it
// check for existence of blobs of at least two sizes
//    if yes, call Blobservation again.
// And so on.