let allCards = [];
let deck = [];
generateDeck(deck);

for (let i = 0; i < 6; i++) {
  allCards = allCards.concat(deck);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

let playerHand = [];
let dealerHand = [];
let dealerScore = scoreCount(dealerHand);
let playerScore = scoreCount(playerHand);
let playerHandContent;
let dealerHandContent;

const playerHandHtml = document.getElementById("player-cards");
const dealerHandHtml = document.getElementById("dealer-cards");
const playerScoreHtml = document.getElementById("player-score");
const dealerScoreHtml = document.getElementById("dealer-score");

window.onload = () => {
  reset();
};

function generateDeck(deck) {
  const suits = ["H", "C", "D", "S"];
  const cards = [2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King", "Ace"];

  for (const suit of suits) {
    for (const card of cards) {
      deck.push({ card: card, suit: suit });
    }
  }
  shuffleArray(deck);
}

function drawCard(personHand) {
  if (allCards.length < 1) {
    decksReset();
  }
  personHand.push(allCards[allCards.length - 1]);
  allCards.pop();
}

function scoreCount(personHand) {
  let score = 0;
  let aceCount = 0;
  for (const card of personHand) {
    if (card.card === "King" || card.card === "Queen" || card.card === "Jack") {
      score += 10;
    } else if (card.card === "Ace") {
      aceCount++;
      score += 11;
    } else {
      score += card.card;
    }
  }

  if (aceCount > 0 && score > 21) {
    score -= 10 * aceCount;
  }

  return score;
}

function displayCard(personHand, personHandHtml, personScore, personScoreHtml) {
  personHandHtml.innerHTML = "";
  for (let i = 0; i < personHand.length; i++) {
    let cardImg = document.createElement("img");
    cardImg.src = `cards/${personHand[i].card}_of_${personHand[i].suit}.png`;
    personHandHtml.append(cardImg);
  }
  personScoreHtml.innerHTML = personScore;
}

function displayCardInit() {
  displayCard(playerHand, playerHandHtml, playerScore, playerScoreHtml);

  dealerHandHtml.innerHTML = "";
  let cardImg = document.createElement("img");
  cardImg.src = `cards/${dealerHand[0].card}_of_${dealerHand[0].suit}.png`;
  let backCardImg = document.createElement("img");
  backCardImg.src = `cards/back.png`;
  dealerHandHtml.append(cardImg, backCardImg);

  switch (dealerHand[0].card) {
    case "King":
    case "Queen":
    case "Jack":
      dealerScoreHtml.innerHTML = 10;
      break;
    case "Ace":
      dealerScoreHtml.innerHTML = 11;
      break;
    default:
      dealerScoreHtml.innerHTML = dealerHand[0].card;
      break;
  }
}

function randomInt(max) {
  return Math.floor(Math.random() * max);
}

function decksReset() {
  deck.length = 0;
  generateDeck(deck);
}

function reset() {
  playerHand = [];
  dealerHand = [];
  playerScore = 0;
  dealerScore = 0;
  playerHandHtml.innerHTML = "";
  playerScoreHtml.innerHTML = 0;
  dealerHandHtml.innerHTML = "";
  dealerScoreHtml.innerHTML = 0;

  for (let i = 0; i < 4; i++) {
    let backCardImg = document.createElement("img");
    backCardImg.src = `cards/back.png`;
    if (i < 2) {
      dealerHandHtml.append(backCardImg);
    } else {
      playerHandHtml.append(backCardImg);
    }
  }
}

function initGame() {
  reset();
  if (totalBet <= 0) {
    alert(`Place a Bet first.`);
  } else {
    setTimeout(() => {
      for (let i = 0; i < 2; i++) {
        drawCard(playerHand);
        drawCard(dealerHand);
        playerScore = scoreCount(playerHand);
        dealerScore = scoreCount(dealerHand);
      }
      displayCardInit();

      switch (playerScore) {
        case 21:
          setTimeout(() => {
            switch (dealerScore) {
              case !21:
                checkScore();
              default:
                tie = true;
                afterGameMoney();
                alert("Dealer and Player have BlackJacks. It's a Tie.");
            }
          }, 1000);
          displayCard(playerHand, playerHandHtml, playerScore, playerScoreHtml);
          displayCard(dealerHand, dealerHandHtml, dealerScore, dealerScoreHtml);
      }
    }, 500);
  }
}

function hit() {
  if (playerHand.length == 0) {
    alert("Start a new game first");
  } else {
    drawCard(playerHand);
    playerScore = scoreCount(playerHand);
    displayCard(playerHand, playerHandHtml, playerScore, playerScoreHtml);
    if (playerScore >= 21) {
      checkScore();
    }
  }
}

function stand() {
  if (playerHand.length == 0) {
    alert("Start a new game first");
  } else {
    checkScore();
  }
}

function checkScore() {
  while (dealerScore < 17) {
    drawCard(dealerHand);
    dealerScore = scoreCount(dealerHand);
    displayCard(dealerHand, dealerHandHtml, dealerScore, dealerScoreHtml);
  }
  setTimeout(() => {
    if (playerScore > 21 || (playerScore < dealerScore && dealerScore < 22)) {
      // BUST OR LOSE
      lost();
    } else if (
      dealerScore > 21 ||
      (dealerScore < playerScore && playerScore < 22)
    ) {
      // DEALER BUST OR WIN
      won();
    } else if (playerScore === dealerScore && playerScore < 22) {
      tied();
    }
  }, 1500);

  setTimeout(() => {
    reset();
  }, 5000);
}

function won() {
  displayCard(dealerHand, dealerHandHtml, dealerScore, dealerScoreHtml);
  displayCard(playerHand, playerHandHtml, playerScore, playerScoreHtml);
  win = true;
  tie = false;
  afterGameMoney();
  if (dealerScore > 21) {
    alert(
      `Dealer: ${dealerScore} \nPlayer: ${playerScore}\nDealer Bust! You Win!`
    );
  } else if (playerScore === 21) {
    alert(
      `You have a BlackJack!\nDealer: ${dealerScore} \nPlayer: ${playerScore}\nYou Win!`
    );
  }
}

function lost() {
  displayCard(dealerHand, dealerHandHtml, dealerScore, dealerScoreHtml);
  displayCard(playerHand, playerHandHtml, playerScore, playerScoreHtml);
  win = false;
  tie = false;
  afterGameMoney();
  if (dealerScore === 21) {
    alert(
      `Dealer has a BlackJack! You Lose:\n Dealer: ${dealerScore} \nPlayer: ${playerScore}`
    );
  } else if (dealerScore !== 21 && playerScore > 21) {
    alert(`Busted! You lose: \nDealer: ${dealerScore} \nPlayer:${playerScore}`);
  } else {
    alert(`You lose: \nDealer: ${dealerScore} \nPlayer:${playerScore}`);
  }
}

function tied() {
  displayCard(dealerHand, dealerHandHtml, dealerScore, dealerScoreHtml);
  displayCard(playerHand, playerHandHtml, playerScore, playerScoreHtml);
  win = false;
  tie = true;
  afterGameMoney();
  alert(`Dealer: ${dealerScore} \nPlayer: ${playerScore}\nIt's a Tie!`);
}
