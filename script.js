//*********** Variables *****************/
const username = document.getElementById('username');
const day = document.getElementById('day');
const month = document.getElementById('month');
const time = document.getElementById('time');

// Adding Transaction related Variables
const transactionNameInput = document.getElementById('transactionName');
const transactionAmountInput = document.getElementById('transactionAmount');
const transactionTypeInput = document.getElementById('transactionType');
const addTransactionBtn = document.getElementById('addTransaction');

//Balance Sheet variables
const balanceIncome = document.getElementById('balanceIncome');
const balanceExpense = document.getElementById('balanceExpense');
const balanceTotal = document.getElementById('balanceTotal');

//Variables to store long-term balance / expense & income data since we don't have database
let balance = parseFloat(balanceTotal.textContent.trim().replace(/[^0-9.-]/g, ''));
let income = parseFloat(balanceIncome.textContent.trim().replace(/[^0-9.-]/g, ''));
let expense = parseFloat(balanceExpense.textContent.trim().replace(/[^0-9.-]/g, ''));

//History Section Variables
const historyList = document.querySelector('.historyList');
let historyItemIndex = 0;



//*********** Functions *****************/
function getUsername() {
    const userInput = prompt("Please enter your name:");
    if (userInput) {
      username.textContent = userInput;
    }
    else {
        alert('Error! Please enter a valid name');
        getUsername();
    }
}

// Updated Time, Day etc function
function updateTime() {
    const now = new Date();

    //Formatted Date
    const formattedDate = now.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short'
    });
    const newDay = formattedDate.split(' ')[1];
    const newMonth = formattedDate.split(' ')[0];

    const formattedTime = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });

    document.getElementById('day').textContent = newDay+',';
    document.getElementById('month').textContent = newMonth;
    document.getElementById('time').innerHTML = formattedTime;
}

//Function to extract & validate transactions
function addTransaction() {

    const transactionName = transactionNameInput.value.trim();
    const transactionAmount = parseFloat(transactionAmountInput.value);
    const transactionType = transactionTypeInput.value;

    if(!transactionName) {
        alert('Error! Please enter a valid transaction name');
        return;
    }
    if(!transactionAmount || isNaN(transactionAmount)) {
        alert('Error! Please enter a valid transaction amount');
        return;
    }

    if(transactionType == "type") {
        alert('Error! Please select a valid option from the dropdown!');
        return;
    }
    else if(transactionType == "debit") {
       updateDebit(transactionName, transactionAmount, transactionType);
    }
    else if(transactionType == "credit") {
        updateCredit(transactionName, transactionAmount, transactionType);
    }

    //clear input fields
    transactionNameInput.value = "";
    transactionAmountInput.value = "";
    transactionTypeInput.value = "";
}

//Functions to update Balance / Debit / Credit
function updateDebit(debitName, amount, type) {
    balance += amount;
    income += amount;
    updateDebitView();
    updateBalanceView();
    updateTransactionView(debitName, amount, type);
}
function updateCredit(creditName, amount, type) {
    balance -= amount;
    expense += amount;
    updateCreditView();
    updateBalanceView();
    updateTransactionView(creditName, amount, type);
}

// Update balanceSheet Views
function updateDebitView() {
    balanceIncome.textContent ="$"+income;
}
function updateCreditView() {
    balanceExpense.textContent ="$"+expense;
}
function updateBalanceView() {
    balanceTotal.textContent ="$"+balance;
}

function updateTransactionView(transactionName, transactionAmount, transactionType) {
    const newTransaction = createTransactionElement(transactionName, transactionAmount, transactionType);
    historyList.appendChild(newTransaction);
}

//Function to create new Transaction History Item
function createTransactionElement(transactionName, transactionAmount, transactionType) {
    historyItemIndex += 1;

    //create transaction li
    const transaction = document.createElement('li');
    transaction.classList.add('transaction');

    const transactionNumber = document.createElement('p');
    transaction.classList.add('transactionNumber');
    transactionNumber.textContent = `#${historyItemIndex}`;
    transaction.appendChild(transactionNumber);

    const transactionNameEl = document.createElement('p');
    transactionNameEl.classList.add('transactionName');
    transactionNameEl.textContent = capitalizeFirstLetter(transactionName);
    transaction.appendChild(transactionNameEl);

    const transactionAmountEl = document.createElement('p');
    transactionAmountEl.classList.add('transactionValue');
    if(transactionType == "debit") {
        transactionAmountEl.textContent = "+"+transactionAmount;
        transactionAmountEl.style.color = 'green';
    }
    else if(transactionType == "credit") {
        transactionAmountEl.textContent = "-"+transactionAmount;
        transactionAmountEl.style.color = 'red';
    }
    transaction.appendChild(transactionAmountEl);

    const transactionTypeEl = document.createElement('div');
    transactionTypeEl.classList.add('transactionType');
    
    const typeText = document.createElement('p');
    typeText.textContent = capitalizeFirstLetter(transactionType);
    transactionTypeEl.appendChild(typeText);

    const typeTime = document.createElement('p');
    typeTime.classList.add('transactionTypeTime');
    typeTime.textContent = transactionHistoryTime();
    transactionTypeEl.appendChild(typeTime);

    transaction.appendChild(transactionTypeEl);

    return transaction;
}

//Generate transaction time
function transactionHistoryTime() {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0'); // Get day (padded with leading zero)
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Get month (1-indexed, padded)
    const hours = String(currentDate.getHours()).padStart(2, '0'); // Get hours (padded)
    const minutes = String(currentDate.getMinutes()).padStart(2, '0'); // Get minutes (padded)
  
    return `${day}-${month}, ${hours}:${minutes}`;
}

//Capitalize first letter of string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//*********** Function Calls *****************/
updateTime();
setInterval(updateTime, 1000);

//*********** Event Listeners *****************/
username.addEventListener('click', getUsername);
addTransactionBtn.addEventListener('click', addTransaction);