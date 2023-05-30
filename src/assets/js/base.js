var text = "asdfghjkl;";  // Home row (---asdfghjkl;----)
var currentIndex = -1;

function getRandomIndex() {
  var newIndex;
  do {
    newIndex = Math.floor(Math.random() * text.length);
  } while (newIndex === currentIndex); // Ensure the new index is different from the current index
  currentIndex = newIndex;
  return currentIndex;
}

function displayRandomText(event) {
  var inputChar = String.fromCharCode(event.keyCode);
  if (inputChar === text.charAt(currentIndex)) {
    var randomIndex = getRandomIndex();
    var randomChar = text.charAt(randomIndex);
    document.getElementById("randomText").textContent = randomChar;
  }
}

window.onload = function() {
  var randomIndex = getRandomIndex();
  var randomChar = text.charAt(randomIndex);
  document.getElementById("randomText").textContent = randomChar;

  document.onkeypress = displayRandomText;
};