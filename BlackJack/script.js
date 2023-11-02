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
    
    const getRandomKey = allCards.get(randomInt(allCards.size))
    const getRandomValue = randomInt(getRandomKey.length)
    const randomCard = getRandomKey[getRandomValue]
    
    // console.log(randomCard.suit, randomCard.card, randomCard.suit)
    
    getRandomKey.splice(getRandomValue, 1)
    
    personHand.push(randomCard)
    
    if (totalCards < 52 || getRandomKey.length < 10) {
        decksReset()
    }
    
}


function scoreCount(personHand) {
    let score = 0
    let aceCount = 0
    for (const card of personHand) {
        if (card.card === 'King' || card.card === 'Queen' || 
            card.card === 'Jack') {
                score += 10
                
                // console.log('added 10')
        } else if (card.card === 'Ace') {
            aceCount++
            score += 11
            
        } else {
            score += card.card
            
        }    
    }

    if (aceCount > 0 && score > 21) {
        score -= 10*aceCount
    }

    return score
}


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

function randomInt(max) {
    return Math.floor(Math.random() * max)
}

function decksReset() {
    for (let i = 0; i < 6; i++) {
        const deck = allCards.get(i);
        deck.length = 0;  
        generateDeck(deck);  
    }
}

function reset() {
    playerHand = []
    dealerHand = []
    playerScore = 0
    dealerScore = 0
    playerHandHtml.innerHTML = ''
    playerScoreHtml.innerHTML = 0
    dealerHandHtml.innerHTML = ''
    dealerScoreHtml.innerHTML = 0

    let backCardImg1 = document.createElement('img')
    backCardImg1.src = `cards/back.png`
    let backCardImg2 = document.createElement('img')
    backCardImg2.src = `cards/back.png`
    dealerHandHtml.append(backCardImg1, backCardImg2)
    
    let backCardImg3 = document.createElement('img')
    backCardImg3.src = `cards/back.png`
    let backCardImg4 = document.createElement('img')
    backCardImg4.src = `cards/back.png`
    playerHandHtml.append(backCardImg3, backCardImg4)
}

function initGame() {
    reset()
    
    setTimeout(() => {
        for (let i = 0; i < 2; i++) {
            drawCard(playerHand)
            drawCard(dealerHand)
            playerScore = scoreCount(playerHand)
            dealerScore = scoreCount(dealerHand)
            setTimeout(1000)    
        }
        // console.log('this is playerscore', playerScore)
        // console.log('this is dealerscore', dealerScore)
        displayCardInit()
    
        if (playerScore === 21) {
            if (dealerScore !== 21) {
                alert("BlackJack! You Win!")
            } else {
                alert("Dealer and Player have BlackJacks. It's a Tie.")
            }
        }
    
    }, 500)
    
}

function hit() {
    drawCard(playerHand)
    playerScore = scoreCount(playerHand)
    if (playerScore <= 21) {
        displayCardInit()
    } 
    if (playerScore > 21) {
        checkScore()
    }
}

function stand() {
    setTimeout(() => {
        while (dealerScore < 17) {
            drawCard(dealerHand)
            dealerScore = scoreCount(dealerHand)
            displayCard()
            if (dealerScore > 21) {
                break
            } else if (dealerScore < 21 && dealerScore >= 17){
                break
            }
        }
    }, 500)
    displayCard()
    
    
    setTimeout(() => {
        if (playerScore !== 21 && dealerScore === 21) {
            // displayCard()
            alert('Dealer has a BlackJack! You Lose!')
        }
    
        if (dealerScore > 21) {
            alert(`Dealer Bust\nDealer: ${dealerScore} \nPlayer: ${playerScore}\nYou Win!`)
        }

        if (playerScore < 22 && dealerScore < 22) {
            if (playerScore > dealerScore) {
                alert(`Dealer: ${dealerScore} \nPlayer: ${playerScore}\nYou Win`)
            } else if (playerScore === dealerScore) {
                alert(`Dealer: ${dealerScore} \nPlayer: ${playerScore}\nIt's a Tie!`)
            } else if (playerScore < dealerScore) {
                alert(`Dealer: ${dealerScore} \nPlayer: ${playerScore}\nYou Lose!`)
            } else {
                checkScore()
            }
        }
    }, 1500)
    
    setTimeout(() => {
        reset()
    }, 5000)
}

function checkScore() {
    setTimeout(() => {
        if (playerScore > 21) {
            displayCard()
            alert('Busted! You Lose.')
            while (dealerScore < 17) {
                drawCard(dealerHand)
                dealerScore = scoreCount(dealerHand)
            }
            alert(`Dealer: ${dealerScore} \nPlayer:${playerScore}`)
            // handReset()
    
        } else if (playerScore < 22 && dealerScore < 17) {
            drawCard(dealerHand)
            dealerScore = scoreCount(dealerHand)
            if (dealerScore > 21) {
                displayCard()
                alert(`Dealer: ${dealerScore} \nPlayer: ${playerScore}\nDealer Bust! You Win!`)
                // handReset()
            } 
    
        } else if (playerScore !== 21 && dealerScore === 21) {
            displayCard()
            alert('Dealer has a BlaCkJack! You Lose!')
    
        } else if (playerScore === 21) {
            displayCard()
            alert(`You have a BlackJack!\nDealer: ${dealerScore} \nPlayer: ${playerScore}\nYou Win!`)
        }
    }, 500)

    displayCard()

    setTimeout(() => {
        reset()
    }, 5000)
}


