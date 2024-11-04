const transactionForm = document.querySelector('.transaction-form');
const entryDescription = document.querySelector('.description');
const entryAmount = document.querySelector('.amount');
const entryCategory = document.querySelector('.category');
const entryDate = document.querySelector('.date');
const transactionsContainer = document.querySelector('.transactions');
const totalBalanceDisplay = document.querySelector('.total-balance');
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

const updateTotalBalance = () => {
    const totalBalance = transactions.reduce((acc, transaction) => {
        return transaction.category === 'income' ? acc + transaction.amount : acc - transaction.amount;
    }, 0);
    totalBalanceDisplay.textContent = `$${totalBalance.toFixed(2)}`;
};