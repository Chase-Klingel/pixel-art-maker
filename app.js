document.addEventListener('DOMContentLoaded', function() {
  /****************************** CAPTURE HTML ELEMENTS ******************************/

  // USER SETUP ELEMENTS
  var body = document.querySelector('body');
  var introContainer = document.getElementById('intro-container');
  var introContent = document.getElementById('intro-content');
  var inputFields = document.getElementsByClassName('input-field');
  // userBackground will be used to capture user's background choice and apply accordingly
  var usersBackground;
  // input will hold a new input element where user can input their chosen background color
  var backgroundInput = document.createElement('input');
  var submitButton = document.createElement('button');


  // CANVAS ELEMENTS
  var canvasContainer = document.getElementById('canvas-container');
  var squares = document.getElementsByClassName('square');

  // PALETTE ELEMENTS
  var paletteContainer = document.getElementById('palette-container');
  var swatch = document.getElementsByClassName('swatch');
  var selectColor = document.getElementById('color-generator');
  var color;
  var eraser = document.getElementById('erase');
  var deleteProject = document.getElementById('delete');
  var newCanvas = document.getElementById('canvas-icon');
  var finalSubmit = false;
  /******************************* GRID SIZE SETUP & BUILD GRID *************************************/

  // waits for user to type something and then calls enlargeFont
  for (var i = 0; i < inputFields.length; i++) {
    inputFields[i].addEventListener('keypress', enlargeFont);
  }

  //when user begins typying, font size grows to 30px
  function enlargeFont() {
    this.style.fontSize = '30px';
  }

  inputFields[1].addEventListener('keypress', displaySubmit);
  function displaySubmit() {
    submitButton.id = 'continue';
    submitButton.style.background = 'green';
    submitButton.textContent = 'submit';
    submitButton.type = 'submit';
    introContent.appendChild(submitButton);
  }

  submitButton.addEventListener('click', selectBackground);
  document.addEventListener('keypress', pressedEnter);

  function pressedEnter(event) {
    if (event.keyCode === 13 && finalSubmit === false && event.target === inputFields[1]) {
      selectBackground();
    } else if (event.keyCode === 13 && finalSubmit === true) {
      buildCanvas();
    }
  }
  // allows user to select background color for canvas
  function selectBackground() {
    var backgroundNotification = document.createElement('h1');
    backgroundNotification.textContent = 'Enter a color in the input field. Your choice will be applied as the background color of your canvas.';
    backgroundNotification.className = 'settings-info background-notification animated fadeInUp';
    backgroundInput.className = 'input-field background-input';
    backgroundInput.type = 'text';
    backgroundInput.name = 'background-color';
    backgroundInput.autofocus = true;
    introContent.appendChild(backgroundNotification);
    introContent.appendChild(backgroundInput);
    backgroundInput.addEventListener('keypress', enlargeFont);
    submitButton.addEventListener('click', buildCanvas);
    finalSubmit = true;
  }

  // if the user provides input for background color, a green submit button will be shown to user
  backgroundInput.addEventListener('keypress', displaySubmit);


  //1. Hides user selection elements
  //2. calculates individual squares' width and height
  //3. builds grid based on users input for width and height
  //4. applies user's background to canvas
  function buildCanvas() {
    usersBackground = inputFields[2].value;
    body.style.background = 'white';
    height = inputFields[0].value;
    width = inputFields[1].value;
    introContainer.style.display = 'none';
    paletteContainer.style.display = 'block';

    for (var i = 0; i < height; i++) {
      for (var j = 0; j < width; j++) {
        var square = document.createElement('div');
        canvasContainer.appendChild(square);
        square.className = 'square';
        square.style.width = (100 / width) + '%';
        // this ensures that the squares stay square-like
        square.style.paddingBottom = square.style.width;
      }
    }

    for (var j = 0; j < squares.length; j++) {
      squares[j].style.background = usersBackground;
    }
  }

  /******************************* SAVE COLOR AND APPLY COLOR *************************************/


  // figure out why removeApply, applyColor, and enteredCanvas work
  function removeApply() {
    for (var i = 0; i < squares.length; i++) {
      squares[i].removeEventListener('click', applyColor);
      squares[i].removeEventListener('mouseenter', applyColor);
    }
  }

  // applies appropriate color as user clicks or clicks and drags mouse
  function applyColor() {
    this.style.backgroundColor = color;
    /*when user goes from erasing to applying a color again, this for loop
      disables ability to click in square and erase until they click the eraser again.
    */
    for (var i = 0; i < squares.length; i++) {
      squares[i].removeEventListener('click', erase);
    }
    canvasContainer.addEventListener('click', removeApply);
  }

  function enteredCanvas() {
    // if user clicks or clicks and drags over a square, the appropriate color will be applied
    for (var i = 0; i < squares.length; i++) {
      squares[i].addEventListener('click', applyColor)
      squares[i].addEventListener('mouseenter', applyColor);
    }
  }

  // when user clicks a color of their choice, the saveColor function will run
  paletteContainer.addEventListener('click', saveColor);
  selectColor.addEventListener('change', saveColor);
  // saves the user's color choice and gives them feedback by adding green border around chosen color
  function saveColor(event) {
    // if user selected eraser, ensures that if they click and drag, the squares will return to the deafult background they set.
    if (event.target.id === 'erase') {
      color = usersBackground;
      console.log(color);
    } else {
      color = event.target.value;
    }
    canvasContainer.addEventListener('mousedown', enteredCanvas);
  }

  /******************************* ERASE, DELETE & CHANGE GRID SIZE *************************************/

  // similar to save color, when user clicks eraser icon, the erase state is saved
  eraser.addEventListener('click', eraserReady);

  // if the user clicks in a square when the eraser is saved, the erase function is called
  function eraserReady() {
    console.log('pass!');
    for (var i = 0; i < squares.length; i++) {
      squares[i].addEventListener('click', erase);
    }
  }

  // background-color of clicked square returns to user's background choice for their canvas
  function erase() {
    console.log('double pass amigo!');
    this.style.backgroundColor = color;
    console.log(this.style.backgroundColor);
  }

  // when user clicks on trash can, they will be asked to confirm if they want to delete
  deleteProject.addEventListener('click', clearCanvas);

  // if user clicks ok on confirm pop-up, the canvas is cleared
  // else, no changes made
  function clearCanvas() {
    var answer = confirm('are you sure you want to delete this project?');
    if (answer) {
      for (var i = 0; i < squares.length; i++) {

        squares[i].style.backgroundColor = usersBackground;
      }
    }
  }

  // if user clicks grid icon, they can change their grid size and the new grid will be built
  newCanvas.addEventListener('click', selectGridSize);

  // refreshes page in order for user to choose a new grid size and background color for their canvas
  function selectGridSize() {
    window.location.reload();
  }
});
