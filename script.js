$(document).ready(function(){

var emojis = ["🐶","🦊","🐸","🦁","🐧","🦋","🐶","🦊","🐸","🦁","🐧","🦋"];
var deck = [];
var flipped = [];
var matched = [];
var p1score = 0;
var p2score = 0;
var currentPlayer = 1;
var locked = false;

function shuffle(arr){
  for(var i = arr.length - 1; i > 0; i--){
    var j = Math.floor(Math.random() * (i + 1));
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

function startGame(){
  deck = shuffle(emojis.slice());
  flipped = [];
  matched = [];
  p1score = 0;
  p2score = 0;
  currentPlayer = 1;
  locked = false;

  $("#p1score").text(0);
  $("#p2score").text(0);
  $("#p1box").addClass("active");
  $("#p2box").removeClass("active");
  $("#message").text("Player 1 go first, pick 2 cards!");
  $("#winscreen").removeClass("show");

  $("#grid").empty();

  for(var i = 0; i < deck.length; i++){
    var card = $('<div class="card" data-index="' + i + '"><div class="card-inner"><div class="card-back card-face">?</div><div class="card-front card-face">' + deck[i] + '</div></div></div>');
    $("#grid").append(card);
  }
}

$("#grid").on("click", ".card", function(){
  if(locked) return;

  var card = $(this);
  var index = card.attr("data-index");

  if(card.hasClass("flipped")) return;
  if(card.hasClass("matched")) return;
  if(flipped.length == 2) return;

  card.addClass("flipped");
  flipped.push(index);

  if(flipped.length == 1){
    $("#message").text("Player " + currentPlayer + " pick your second card!");
  }

  if(flipped.length == 2){
    locked = true;

    var first = flipped[0];
    var second = flipped[1];

    if(deck[first] == deck[second]){
      if(currentPlayer == 1){
        p1score++;
        $("#p1score").text(p1score);
      } else {
        p2score++;
        $("#p2score").text(p2score);
      }

      matched.push(first);
      matched.push(second);

      setTimeout(function(){
        $('[data-index="' + first + '"]').addClass("matched");
        $('[data-index="' + second + '"]').addClass("matched");

        flipped = [];
        locked = false;

        if(matched.length == 12){
          endGame();
        } else {
          $("#message").text("Nice match! Player " + currentPlayer + " go again!");
        }
      }, 600);

    } else {
      $("#message").text("No match! Try to remember where they are.");

      setTimeout(function(){
        $('[data-index="' + first + '"]').removeClass("flipped");
        $('[data-index="' + second + '"]').removeClass("flipped");

        flipped = [];
        locked = false;

        if(currentPlayer == 1){
          currentPlayer = 2;
          $("#p1box").removeClass("active");
          $("#p2box").addClass("active");
        } else {
          currentPlayer = 1;
          $("#p2box").removeClass("active");
          $("#p1box").addClass("active");
        }

        $("#message").text("Player " + currentPlayer + " its your turn!");
      }, 1200);
    }
  }
});

function endGame(){
  $("#fp1").text(p1score);
  $("#fp2").text(p2score);

  if(p1score > p2score){
    $("#winmsg").text("Player 1 Wins!");
    $("#wintrophy").text("🏆");
  } else if(p2score > p1score){
    $("#winmsg").text("Player 2 Wins!");
    $("#wintrophy").text("🏆");
  } else {
    $("#winmsg").text("Its a Tie!");
    $("#wintrophy").text("🤝");
  }

  setTimeout(function(){
    $("#winscreen").addClass("show");
  }, 700);
}

$("#newgame").click(function(){
  startGame();
});

$("#playagain").click(function(){
  startGame();
});

document.getElementById("rules").addEventListener("click", function(){
  alert("HOW TO PLAY\n\n- There are 12 cards face down\n- Each player picks 2 cards on their turn\n- If they match you get a point and go again\n- If they dont match the cards flip back, remember where they were!\n- The player with most pairs at the end wins");
});

startGame();

});

