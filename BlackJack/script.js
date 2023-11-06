// I named the individual cards in the cards folder matching the name they are created with when calling the generateDeck(deck) function to be able to respectively display them on screen
// The win and tie variables and the afterGameMoney() function are called from the second script file to handle the money aspect of the game

let deck1 = []
let deck2 = []
let deck3 = []
let deck4 = []
let deck5 = []
let deck6 = []

const allCards = new Map()

allCards.set(0, deck1)
allCards.set(1, deck2)
allCards.set(2, deck3)
allCards.set(3, deck4)
allCards.set(4, deck5)
allCards.set(5, deck6)

generateDeck(deck1)
generateDeck(deck2)
generateDeck(deck3)
generateDeck(deck4)
generateDeck(deck5)
generateDeck(deck6)

/* I was not yet able to find a way to loop through the upper code to auto-assign 
the deck names. I tried creating an array that would be populated by deck[i],
but that would totally mess with the rest of my code. 
Any help would be more than welcome */

let playerHand = []
let dealerHand = []
let dealerScore = scoreCount(dealerHand)
let playerScore = scoreCount(playerHand)
let playerHandContent 
let dealerHandContent 

const playerHandHtml = document.getElementById('player-cards')
const dealerHandHtml = document.getElementById('dealer-cards')
const playerScoreHtml = document.getElementById('player-score')
const dealerScoreHtml = document.getElementById('dealer-score')

// This ensure that the game environment is set as soon as the window loads by calling the reset() function
window.onload = () => {
    reset()
}

function generateDeck(deck) {
    const suits = ['H', 'C', 'D', 'S']
    const cards = [
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        'Jack',
        'Queen',
        'King',
        'Ace',
    ]
    
    for (const suit of suits) {
        for (const card of cards) {
            deck.push({'card': card, 'suit': suit})
        }
    }
}

function drawCard(personHand) {
    let totalCards = deck1.length + deck2.length + deck3.length + 
    deck4.length + deck5.length + deck6.length
    
    /* Here the randomInt function is called twice. The first time to randomly choose and select the key (deck number) of the Map. 
    The second is to select a random card from the array, that is, in itself the value of the previously randomly selected key */
    const getRandomKey = allCards.get(randomInt(allCards.size))
    const getRandomValue = randomInt(getRandomKey.length)
    const randomCard = getRandomKey[getRandomValue]
    
    // console.log(randomCard.suit, randomCard.card, randomCard.suit)

    // This allows to remove the randomly selected card of the the deck
    getRandomKey.splice(getRandomValue, 1)

    // This pushes the randomly selected card to the selected person's hand
    personHand.push(randomCard)

    /* This part was made so that there never is an instance where an undefined card gets drawn. 
    If there are only less than 52 cards remaining amongst the 6 deck or if any deck only has less than 10 cards left, the decksReset() function will be called */
    if (totalCards < 52 || getRandomKey.length < 10) {
        decksReset()
    }
    
}


function scoreCount(personHand) {
    let score = 0
    // the aceCount variable will allow for the total of aces in a given person's hand to help dynamically attribute the value of the ace
    let aceCount = 0
    for (const card of personHand) {
        if (card.card === 'King' || card.card === 'Queen' || 
            card.card === 'Jack') {
                score += 10
                
                // console.log('added 10')
        } else if (card.card === 'Ace') {
            // Any time an ace is encountered in a person's hand, it will increment by 1 the value of aceCount
            aceCount++
            score += 11
            
        } else {
            score += card.card
            
        }    
    }

    /* As aces are initially valued at 11, to make the gameplay more realistic, and allow for a dynamic attribution of the ace value of either 11 or 1, 
    this condition substracts (10 * the number of aces in the person's hand) to effectively change the value of the ace from 11 to 1 if the score goes above 21 */ 
    if (aceCount > 0 && score > 21) {
        score -= 10*aceCount
    }

    return score
}

// This function is made to display all cards and the scores, including the hidden dealer cards. This is called when the game ends, meaning when the player or dealer loses or if there is a tie
function displayCard() {
    playerHandHtml.innerHTML = ''
    dealerHandHtml.innerHTML = ''
    for (let i = 0; i < playerHand.length; i++) {
        let cardImg = document.createElement('img')
        cardImg.src = `cards/${playerHand[i].card}_of_${playerHand[i].suit}.png`
        playerHandHtml.append(cardImg)
    }

    for (let i = 0; i < dealerHand.length; i++) {
        let cardImg = document.createElement('img')
        cardImg.src = `cards/${dealerHand[i].card}_of_${dealerHand[i].suit}.png`
        dealerHandHtml.append(cardImg)
    }

    playerScoreHtml.innerHTML = playerScore
    dealerScoreHtml.innerHTML = dealerScore
}

/* This function is made to display only the player's cards and score and only one of the dealer's cards and it's score. This is to ensure that even when a player chooses to hit, the dealer's cards dont get displayed. 
This is made to ensure a game process is as close to reality as possible */
function displayCardInit() {
    playerHandHtml.innerHTML = ''
    dealerHandHtml.innerHTML = ''
    
    for (let i = 0; i < playerHand.length; i++) {
        let cardImg = document.createElement('img')
        cardImg.src = `cards/${playerHand[i].card}_of_${playerHand[i].suit}.png`
        playerHandHtml.append(cardImg)
    }

    let cardImg = document.createElement('img')
    cardImg.src = `cards/${dealerHand[0].card}_of_${dealerHand[0].suit}.png`
    let backCardImg = document.createElement('img')
    backCardImg.src = `cards/back.png`
    dealerHandHtml.append(cardImg, backCardImg)
    
    playerScoreHtml.innerHTML = playerScore
    
    if (dealerHand[0].card === 'King' || dealerHand[0].card === 'Queen'
    || dealerHand[0].card === 'Jack') {
        dealerScoreHtml.innerHTML = 10

    } else if (dealerHand[0].card === 'Ace'){
        dealerScoreHtml.innerHTML = 11

    } else {
        dealerScoreHtml.innerHTML = dealerHand[0].card
    }

}

// Function to generate a random number using a max parameter to be called in the drawCard() function
function randomInt(max) {
    return Math.floor(Math.random() * max)
}

// This function is meant to be called by the drawCard() function. It effectively repopulates all the decks in the Map
function decksReset() {
    for (let i = 0; i < 6; i++) {
        const deck = allCards.get(i);
        deck.length = 0;  
        generateDeck(deck);  
    }
}

// Resets all to their initial values and displays two face down cards for both the player and the dealer as to simulate an unknown hand
function reset() {
    playerHand = []
    dealerHand = []
    playerScore = 0
    dealerScore = 0
    playerHandHtml.innerHTML = ''
    playerScoreHtml.innerHTML = 0
    dealerHandHtml.innerHTML = ''
    dealerScoreHtml.innerHTML = 0

    // Displays back of cards to the dealer
    let backCardImg1 = document.createElement('img')
    backCardImg1.src = `cards/back.png`
    let backCardImg2 = document.createElement('img')
    backCardImg2.src = `cards/back.png`
    dealerHandHtml.append(backCardImg1, backCardImg2)

    // Displays back of cards to the player
    let backCardImg3 = document.createElement('img')
    backCardImg3.src = `cards/back.png`
    let backCardImg4 = document.createElement('img')
    backCardImg4.src = `cards/back.png`
    playerHandHtml.append(backCardImg3, backCardImg4)
}

/* This function initializes the game by reseting everything at first. 
The setTimeout() functions are used to make the user experience is more enjoyable and closer to what a real blackjack game experience might feel like */
function initGame() {
    reset()

    // This populates the player's and dealer's hands while taking care of some edge cases as the player having a blackjack, or the player and the dealer having a blackjack 
    setTimeout(() => {
        for (let i = 0; i < 2; i++) {
            drawCard(playerHand)
            drawCard(dealerHand)
            playerScore = scoreCount(playerHand)
            dealerScore = scoreCount(dealerHand)
        }
        displayCardInit()
    
        if (playerScore === 21) {
            setTimeout(() => {
                if (dealerScore !== 21) {
                    checkScore()
                } else {
                    tie = true 
                    afterGameMoney()
                    alert("Dealer and Player have BlackJacks. It's a Tie.")
                }
            }, 1000)
            displayCard()
        }
    
    }, 500)
    
}

// This function when called draws a card for the player and checks for different conditions
function hit() {
    // The first if statement is added to only allow the player to call the hit() function after a new game has been started
    if (playerHand == []) {
        alert('Start a new game first')
    } else {
        drawCard(playerHand)
        playerScore = scoreCount(playerHand)
        if (playerScore <= 21) { // The player didn't bust so shouldn't be able to see the second dealer's card
            displayCardInit()
        } 
        if (playerScore > 21) { // Player busts ==> call checkscore() for outcome
            checkScore()
        }
    }
}

// This allows the player to stand on his current score while the dealer continues to draw cards until specific conditions are met. This time all cards will be displayed, uncluding all of the dealer's cards
function stand() {
    // The first if statement serves the same purpose as in the hit() function
    if (playerHand == []) {
        alert('Start a new game first')
    } else {
        setTimeout(() => {
            while (dealerScore < 17) { // Dealer draws cards until he gets a score higher or equal to 17
                drawCard(dealerHand)
                dealerScore = scoreCount(dealerHand)
                displayCard()
                if (dealerScore > 21) { // Dealer busts ==> call dislayCard() ==> call reset()
                    break
                } else if (dealerScore < 21 && dealerScore >= 17){ // Dealer has score between 21 excluded (score = 21 is another condition) and 17 included
                    break
                }
            }
        }, 500)
        displayCard()
        
        
        setTimeout(() => {
            if (playerScore !== 21 && dealerScore === 21) { // Dealer blackjack player loses
                win = false
                tie = false
                afterGameMoney()
                alert('Dealer has a BlackJack! You Lose!')
            }
        
            if (dealerScore > 21) { // Dealer busts player wins
                win = true 
                tie = false
                afterGameMoney()
                alert(`Dealer Bust\nDealer: ${dealerScore} \nPlayer: ${playerScore}\nYou Win!`)
            }
    
            if (playerScore < 22 && dealerScore < 22) {
                if (playerScore > dealerScore) { // Player better score player wins
                    win = true
                    tie = false
                    afterGameMoney()
                    alert(`Dealer: ${dealerScore} \nPlayer: ${playerScore}\nYou Win`)
                } else if (playerScore === dealerScore) { // Player and dealer same score tie
                    tie = true
                    win = false
                    afterGameMoney()
                    alert(`Dealer: ${dealerScore} \nPlayer: ${playerScore}\nIt's a Tie!`)
                } else if (playerScore < dealerScore) { // Dealer better score players loses
                    win = false
                    tie = false
                    afterGameMoney()
                    alert(`Dealer: ${dealerScore} \nPlayer: ${playerScore}\nYou Lose!`)
                } else { // If any other scenario is encountered call checkscore()
                    checkScore()
                }
            }
        }, 1500)
        
        setTimeout(() => {
            reset()
        }, 4000)
    }
}

// This function is called when specific conditions are met either when hitting or standing to check for the result of the current game. This function call signifies the end of the current hand as the reset() function is called.
function checkScore() {
    setTimeout(() => {
        if (playerScore > 21) { // Player busts and so loses
            displayCard()
            win = false
            tie = false
            afterGameMoney()
            alert('Busted! You Lose.')
            while (dealerScore < 17) {
                drawCard(dealerHand)
                dealerScore = scoreCount(dealerHand)
            } // The dealer keeps on drawing cards to mimic the realistic behavior of a real life blackjack dealer
            alert(`Dealer: ${dealerScore} \nPlayer:${playerScore}`)
    
        } else if (playerScore < 22 && dealerScore < 17) {
            drawCard(dealerHand)
            dealerScore = scoreCount(dealerHand)
            if (dealerScore > 21) { // Dealer busts player wins
                displayCard()
                win = true
                tie = false
                afterGameMoney()
                alert(`Dealer: ${dealerScore} \nPlayer: ${playerScore}\nDealer Bust! You Win!`)
            } 
    
        } else if (playerScore !== 21 && dealerScore === 21) { // Dealer 21 player loses
            displayCard()
            win = false
            tie = false
            afterGameMoney()
            alert('Dealer has a BlaCkJack! You Lose!')
    
        } else if (playerScore === 21) { // Player 21 player wins
            displayCard()
            win = true
            tie = false
            afterGameMoney()
            alert(`You have a BlackJack!\nDealer: ${dealerScore} \nPlayer: ${playerScore}\nYou Win!`)
        }
    }, 500)

    displayCard()

    setTimeout(() => {
        reset()
    }, 5000)
}


