let playerMoney = 0
let totalBet = 0
let win = true
let tie = false
const betHtml = document.getElementById('bet-total')
const currentBalanceText = document.getElementById('current-balance')

function addBet(value) {
    if (playerMoney >= value && value >= 5) {
        totalBet += value
        playerMoney -= value
    } else if (totalBet < 0){
        alert(`Minimum Bet Value is $5...`)
    } else if (playerMoney < value) {
        alert(`You don't have enough money... Please deposit more money.`)
    }
    betHtml.innerHTML = `Bet: $${totalBet}`
    currentBalanceText.innerText = `Current Balance: $${playerMoney}`
}

function substractBet(value) {
    if (value <= totalBet && totalBet > 0) {
        totalBet -= value
        playerMoney += value
    } else if (value > totalBet) {
        playerMoney += totalBet
        totalBet = 0
    }
    betHtml.innerText = `Bet: $${totalBet}`
    currentBalanceText.innerText = `Current Balance: $${playerMoney}`
}

function depositMoney() {
    const depositAmount = parseInt(document.getElementById('depositAmount').value)
    const depositAmountText = document.getElementById('depositAmount')
    if (depositAmount >= 0) {
        playerMoney += depositAmount
    } else {
        alert('Please enter a valid deposit amount.')
    }
    depositAmountText.value = ''
    currentBalanceText.innerText = `Current Balance: $${playerMoney}`
}

// This function retrieves the boolean value of win and tie and uses it to determine what the player's money should be
function afterGameMoney() {
    if (win === true && tie === false) { // In case of Win
        playerMoney += (totalBet * 2)
        totalBet = 0
        betHtml.innerText = `Bet: $${totalBet}`
        currentBalanceText.innerText = `Current Balance: $${playerMoney}`

    } else if(win === false && tie === false) { // In case of Loss
        totalBet = 0
        betHtml.innerText = `Bet: $${totalBet}`
        currentBalanceText.innerText = `Current Balance: $${playerMoney}`

    } else if (win === false && tie === true) { // In case of Tie
        playerMoney += totalBet
        totalBet = 0
        betHtml.innerText = `Bet: $${totalBet}`
        currentBalanceText.innerText = `Current Balance: $${playerMoney}`
    }
}