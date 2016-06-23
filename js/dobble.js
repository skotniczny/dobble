var deck;
var clickCounter;
var isFinish;
var score;
var highScore = localStorage.getItem("high_score") || 0;
var onBoard = new Array(2);

var board = $qs(".board");

function makeDeck(size) {
  var deck = pattern.map(function(card) {
    return card.map(function(icon) {
      return icons[icon];
    });
  });
  while (deck.length > size) {
    deck.splice(Math.floor(Math.random() * pattern.length), 1);
  }
  return deck;
}
 
function dealOut() {
  for (var i = 0; i < onBoard.length; i++) {
    onBoard[i] = deck.splice(Math.floor(Math.random() * deck.length), 1)[0];
  }
}

function updateStatusBar() {
  $qs(".card-in-deck .counter").textContent = deck.length;
  $qs(".score .counter").textContent = score;
  $qs(".high-score .counter").textContent = highScore;
}

function upadteBoard() {
  while (board.firstChild) {
    board.removeChild(board.firstChild);
  }

  onBoard.forEach(function(item) {
    var card = $create("div", "card");
    item.forEach(function(iconName, idx) {
      card.appendChild($create("button", iconName));
    });
    board.appendChild(card);
  });
}

var timer = {
  startTime: 0,
  start: function() {
    this.startTime = Date.now();
  },
  stop: function() {
    return Date.now() - this.startTime;
  }
};

function play() {
  clickCounter = 0;
  dealOut();
  updateStatusBar();
  upadteBoard();
  timer.start();
}

function gameInit() {
  isFinish = false;
  deck = makeDeck(10);
  this.parentNode.parentNode.style.display = "none";
  score = 0;
  play();
}

function finishGame() {
  isFinish = true;
  updateStatusBar();
  var overlay = $qs(".overlay");
  overlay.style.display = "flex";
  $qs(".message", overlay).innerHTML = "Your score: " + score;
  $qs("#play").textContent = "Play Again";
  if(score > highScore) {
    highScore = score;
    localStorage.setItem("high_score", highScore);
    $qs(".message", overlay).innerHTML += "<br>New High Score!";
  }
}

$qs("#play").addEventListener("click", gameInit, false);

board.addEventListener("click", function(event) {
  if (event.target.tagName.toLowerCase() === "button" && !isFinish) {
    clickCounter++;
    var targetClass = event.target.className;
    if (~onBoard[0].indexOf(targetClass) && ~onBoard[1].indexOf(targetClass)) {
      score += Math.ceil(100000/timer.stop()/(clickCounter*clickCounter)) || 1;
      if (deck.length > 0) {
        play();
      } else {
        finishGame();
      }
    }
  }
}, false);

function $qs(selector, scope) {
  return (scope || document).querySelector(selector);
}

function $create(name, className) {
  var elt = document.createElement(name);
  if (className) { elt.className = className; }
  return elt;
}