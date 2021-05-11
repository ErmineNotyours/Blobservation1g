var canvas = document.getElementById('canvas');
// if (canvas.getContext) {}
var ctx = canvas.getContext('2d');
let h = 40; // height
let w = 66; // width
let scale = 15;
let size;
let density = 5;
let generation;
let lowestNumber;
let allowBuild = false;
let allowDiagonals = true;
let reverse = false;
let popupMode = "Pattern"
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
  //var canvas = document.getElementById('ctx');
  var rect = canvas.getBoundingClientRect(); //absolute position of canvas
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
};

var lowestWindow = document.getElementById("lowest");
var generationWindow = document.getElementById("generation");

var heightField = document.getElementById("height");
heightField.value = h;

heightField.addEventListener('input', () =>{
  h = heightField.value;
  if (h < 8){
    h = 8;
    heightField.value = h;
  }
  //Blobservation();
  generate();
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
  generate();
  redraw();
})

var scaleRange = document.getElementById("scale");

scaleRange.addEventListener('input', () =>{
  scale = scaleRange.valueAsNumber
  w = Math.floor(1000/scale);
  h = Math.floor(600/scale);
  heightField.value = h;
  widthField.value = w;
  //console.log({scale, w, h})
  generate();
  redraw();
})

var modePopup = document.getElementById('mode');
var densityDiv = document.getElementById('densityDiv');

densityDiv.addEventListener('change', () =>{
  generate();
  redraw();
})

var patternDiv = document.querySelector('input[name=pattern]:checked');//https://stackoverflow.com/a/15839451
var patternValue;
document.patternDiv.onclick = function(){
  patternValue = document.patternDiv.pattern.value;
  generate();
  redraw();
}

var pattern = document.getElementsByName('pattern')
for(var i = 0; i < pattern.length; i++)
  if(pattern[i].checked)
      patternValue = pattern[i].value;

// patternDiv.addEventListener('change', () =>{
//   console.log('patternDiv event listener', patternDiv.value, {patternValue}); // Only triggered on "Checker"
//   generate();
//   redraw();
// })
var patternHide = document.getElementById('patternHide');

modePopup.addEventListener('change', () =>{
  popupMode = modePopup.value;
  if (popupMode === "Random"){
    densityDiv.hidden = false;
    ctx.fillText("Random mode", 100, 100); // Never prints
    console.log("Random mode"); // Prints;
    generate();
    redraw();
  }
  else{
    densityDiv.hidden = true;
  }
  if (popupMode === "Pattern")
    patternHide.hidden = false;
  else
    patternHide.hidden = true;
  if (popupMode === "Build"){
    densityDiv.hidden = true;
    patternHide.hidden = true;
    allowBuild = true;
  }
  else
    allowBuild = false;

  generate();
  redraw();
})

document.onclick = function(mouse) {

  var pos = getXY();
  var mouseX = pos.x;
  var mouseY = pos.y;

  var hotX = Math.floor(mouseX/scale);
  var hotY = Math.floor(mouseY/scale);

  if (hotX >= 0 && hotX <= w && hotY >= 0 && hotY <= h && allowBuild)
  {
    var value = Number(window.prompt("Blob value"))
    if (!Number.isInteger(value) || value === null)
      value = 0;
    
    blobs[hotY][hotX] = value;
    redraw();
  }

  //console.log('hotX, hotY', hotX, hotY);
};

var densityRange = document.getElementById('density');

densityRange.addEventListener('change', () =>{
  density = densityRange.value;
  generate();
  //redraw();
})

var diagonalsCheckbox = document.querySelector('input[id="diagonals"]');

diagonalsCheckbox.addEventListener('change', () => {
  if(diagonalsCheckbox.checked) {
    allowDiagonals = true;
  } else {
    allowDiagonals = false;
  }
});

var reverseCheckbox = document.getElementById("reverse");

var lowestHighest = document.getElementById("lowestHighest");

reverseCheckbox.addEventListener('change', () => {
  if(reverseCheckbox.checked){
    reverse = true;
    lowestHighest.textContent = "Highest number"
  }
  else{
    reverse = false;
    lowestHighest.textContent = "Lowest number"
  }
});

var smoothAnimation = document.getElementById("smooth")

var smooth = true;

smoothAnimation.addEventListener('change', () =>{
  if (smoothAnimation.checked)
    smooth = true;
  else
    smooth = false;
});

var speed = 300;
var speedRange = document.getElementById("speed");

speedRange.addEventListener('change', () =>{
  speed = 600 - speedRange.valueAsNumber
})

var runMode = false;
var modeButton = document.getElementById('runMode');

modeButton.addEventListener('click',() => {
  runMode = !runMode;
  // toggle height, width & run mode elements between disabled and regular
  if (runMode){
    scaleRange.disabled = true;
    widthField.disabled = true;
    heightField.disabled = true;
    modePopup.disabled = true; 
    stepButton.disabled = true;
    modeButton.textContent = "Pause"
    for(var i = 0; i < pattern.length; i++)
      pattern[i].disabled = true
    drawMove();
  }
  else{
    scaleRange.disabled = false;
    widthField.disabled = false;
    heightField.disabled = false;
    modePopup.disabled = false;
    stepButton.disabled = false;
    for(var i = 0; i < pattern.length; i++)
      pattern[i].disabled = false;
    modeButton.textContent = "Run"
  }
});

var stepButton = document.getElementById('step');

stepButton.addEventListener('click', ()=>{
  move();
  if (smooth)
    animate();
  else
    redraw();
  generation++;
  generationWindow.textContent = generation;
})

function redraw(){
  ctx.font = scale.toString()+'px serif';
  drawInitial();
  for (var i = 0; i < w; i++)
    for (var j = 0; j < h; j++){
      if (blobs[j][i] !== 0)
        ctx.fillText((blobs[j][i]).toString(), i*scale, (j*scale) + scale);
    }
}

function drawMove(){
  if (blob.length > 0){
    if (runMode)
      setTimeout(function() {
        move();
        if (smooth)
          animate();
        else
          redraw();
        generation++;
        generationWindow.textContent = generation;
        drawMove() // Recursive setTimeout keeps response to speed slider dynamic
      }, speed);
  } else { // that is, if (!(blob.length > 0))
    modeButton.click(); // https://stackoverflow.com/a/25806894
  }
}

function animate(){
  let mySpeed;
  let myScale = scale/5;
  let i = 0;
  if (runMode)
    mySpeed = speed - 100;
  else
    mySpeed = 900;

  setTimeout(function innerAnimate() {

    for (let j = 0; j < blob.length; j++){
      ctx.globalCompositeOperation = 'xor';
      ctx.fillStyle = 'grey';
      ctx.fillText((blob[j].size).toString(), (blob[j].x*scale+(i*blob[j].moveX)), ((blob[j].y*scale+(i*blob[j].moveY))) + scale);
      ctx.fillText((blob[j].size).toString(), (blob[j].x*scale+((myScale+i)*blob[j].moveX)), ((blob[j].y*scale+((myScale+i)*blob[j].moveY))) + scale);
    }
    ctx.globalCompositeOperation = 'source-over'
    ctx.fillStyle = 'black';
    i += myScale
    if (i >= scale) {
      clearTimeout(kill); //ReferenceError: Cannot access 'kill' before initialization at innerAnimate (Blobservation1g.js:308) [Seems to work fine]
    }
    let kill = setTimeout(innerAnimate, Math.floor(mySpeed/8));
  }, Math.floor(mySpeed/8))
  setTimeout(redraw, mySpeed);
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
    blobs[i] = new Array(w+1)
    futureBlobs[i] = new Array(w+1)
  }

  for(i = 0; i < h; i++)
    for(var l = 0; l < w; l++){
      blobs[i][l] = 0; // Populate array with zeros
      futureBlobs[i][l] = 0;
    }
      //console.log({blobs})
//}

// Populate blobs
generate = function (){
  switch (popupMode){
    case 'Pattern':
      generateChecker();
      break

    case 'Build':
      erase();
      break

    case 'Random':
      generateBlobs();
      break

  }
}

function erase(){
  generation = 0;
  generationWindow.textContent = generation;
  drawInitial();
  var count = 1; 
  for (var i = 0; i < w; i++){ // w == 66
    for (var j = 0; j < h; j++){ // h == 40
      //console.log({i, j, count})
      blobs[j][i] = 0
      ctx.fillText(blobs[j][i].toString(), i*scale, (j*scale) + scale);
    }
  }
}

function generateBlobs () {
  //Random block placement code from Mazebreaker
  //console.log('generateBlobs (random)')
  generation = 0;
  generationWindow.textContent = generation;
  //drawInitial();
  var count = 1; 
  for (var i = 0; i < w; i++){ // w == 66
    console.log("Random", {i, j}) // Loops completely, even when random board doesn't display
    for (var j = 0; j < h; j++){ // h == 40
      //console.log({i, j, count})
      blobs[j][i] = 0
      if ((Math.floor(Math.random() * 10) < density)){ // change elements to make more or fewer blobs
        blob.push ({x : i, // Seems to push first one as index 1.  Leaves index 0 as undefined
          y : j}); // First generation mostly unused.  Required for rerunning to clear blob.length <= 0

        blobs[j][i] = 1 + Math.floor(Math.random() * 20);
        //ctx.fillText(blobs[j][i].toString(), i*scale, (j*scale) + scale);
        console.log({i, j}, blobs[j][i]); // Does not display when Random is first chosen, but it does after density is changed
        count++;
      } // end if
    } // next j
  } // next i
  //redraw();
  //console.log('Generation 0',{blobs})
}


generateChecker = function() {
  drawInitial();
  generation = 0;
  generationWindow.textContent = generation;
  var count = 1; 
  for (var i = 0; i < w; i++){
    for (var j = 0; j < h; j++){
      if (patternValue === "checker")
        size = 1 + Math.floor(Math.floor(1+(i+j)/2)-((i+j)/2));
      else if (patternValue === "vertical")
        size = 1 + Math.floor((1+(i)/3)-((i)/3)); 
      else if (patternValue === "horizontal")
        size = 1 + Math.floor((1+(j)/3)-((j)/3)); 
      else if (patternValue === "center")
        size = 2;

        blob.push ({x : i, // pushes first one as index 1.  Leaves index 0 as undefined
          y : j}); // Required for rerunning to clear blob.length <= 0

      blobs[j][i] = size;
      ctx.fillText(blobs[j][i].toString(), i*scale, (j*scale) + scale);
      //console.log({i, j, count}, blobs[j][i])
      count++;
    } // next j
  } // next i
  if (patternValue === "center"){
    blobs[Math.floor(h/2)][Math.floor(w/2)] = 1
    ctx.fillText("1", Math.floor(w/2)*scale, (Math.floor(h/2)*scale) + scale);
  }
//console.log('Generation 0',{blobs})
//blobs[h/2][w/2] = 1
};
  generate();
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
            if (allowDiagonals)
              return b.angle - a.angle
            else return a.angle - b.angle //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
            // *** the refactoring favors a counterclockwise tie-breaking sort of angles, which is against the stated rules! ***

            // else
            //   return b.zigZag - a.zigZag 
            // It turns out refactoring the angle sort as above instead of "return a.angle - b.angle" passed the tests.
          // zigZag had nothing to do with it.
      }

      if (moves < 0)
        throw 'Invalid input'
      if (moves === undefined)
        moves = 1
      //console.log({moves, blobs})
      let j, angle, y2, x2, distance, size, moveX, moveY, zigZag
      let candidates = [{"distance" : this.distance,
                         "x2" : this.x2,
                         "y2" : this.y2,
                         "moveX" : this.moveX,
                         "moveY" : this.moveY,
                         "angle" : this.angle,
                         "size" : this.size,
                         "zigZag" : this.zigZag}] // Give priority to targets that are not a zigzag away (Not used)
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
                  if (blobs[y2][x2] != 0 && (!reverse && blobs[y2][x2] < blobs[y1][x1]) || (reverse && blobs[y2][x2] > blobs[y1][x1])){
                    // Look for blobs of a lesser or greater value
                    zigZag = 0;
                    //console.log('Before assignment',{x1, y1, x2, y2}) // x2, y2 undefined
                    distance = Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2)) // distance in steps to get there. Chebyshev distance.
                    //if (allowDiagonals){
                      // if (Math.abs(x1 - x2) === Math.abs(y1 - y2))                   
                      //   zigZag = 1 // Straight diagonal
                      // if ((x1 === x2) || (y1 === y2))
                      //   zigZag = 1 // Orthogonical move
                     // }
                    size = blobs[y2][x2] // The size of pursued blob.
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
                                    size : size,
                                    zigZag : zigZag})
                      // console.log('After assignment', {x1, y1, candidates})
                      }                  
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
                              size : blobs[y1][x1]});
                  //console.log({futureBlobs})
                }
                else {// If no candidates, the blob under x1, y1 is among the lowest value blobs, and will be stationary
                  futureBlobs[y1][x1] += blobs[y1][x1]
                  lowestWindow.textContent = blobs[y1][x1]; // Often, the lowest number blob will get consumed and won't appear on screen, making the indicator one generation behind.
                }
                               
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
