/*-------------------------------------------
                              EVENT LISTENERS
Window was resized, or keys were pressed.
Do something about it.
-------------------------------------------*/

window.addEventListener("resize", function () {
  width = window.innerWidth;
  height = window.innerHeight;
  if(width > 1920) {
    background.width = width;
  } else {
    background.width = 1920;
  }
  if(height > 1080) {
    background.height = height;
  } else {
    background.height = 1080;
  }

  //radius = height/6; //Roughly.......

  renderer.resize(width, height);
});

window.addEventListener("keydown", function(e) {
  if(e.keyCode == 37) key["left"] = true;
  if(e.keyCode == 39) key["right"] = true;
  if(e.keyCode == 38) key["up"] = true;
  if(e.keyCode == 40) key["down"] = true;
  if(e.keyCode == 32) key["space"] = true;
  if(e.keyCode == 69) key["e"] = true;
  if(e.keyCode == 80) key["p"] = true;
  if(e.keyCode == 27) key["esc"] = true;
});

window.addEventListener("keyup", function(e) {
  if(e.keyCode == 37) key["left"] = false;
  if(e.keyCode == 39) key["right"] = false;
  if(e.keyCode == 38) key["up"] = false;
  if(e.keyCode == 40) key["down"] = false;
  if(e.keyCode == 32) key["space"] = false;
  if(e.keyCode == 69) key["e"] = false;
  if(e.keyCode == 80) key["p"] = false;
  if(e.keyCode == 27) key["esc"] = false;
});
