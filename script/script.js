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
const saveTransactions = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
};

const renderTransactions = () => {
    transactionsContainer.innerHTML = '';
    transactions.forEach((transaction, index) => {
        const transactionItem = document.createElement('li');
        transactionItem.classList.add('transaction-item');
        transactionItem.innerHTML = `
            <p>${transaction.description} - ${transaction.date}</p>
            <p>${transaction.category === 'income' ? '+' : '-'}$${transaction.amount.toFixed(2)}</p>
            <button class="delete-btn" onclick="deleteTransaction(${index})">&#10060;</button>
        `;
        transactionsContainer.appendChild(transactionItem);
    });
};

const addTransaction = (e) => {
    e.preventDefault();
    const newTransaction = {
        description: entryDescription.value,
        amount: parseFloat(entryAmount.value),
        category: entryCategory.value,
        date: entryDate.value
    };
    transactions.push(newTransaction);
    saveTransactions();
    renderTransactions();
    updateTotalBalance();
    transactionForm.reset();
};

const deleteTransaction = (index) => {
    transactions.splice(index, 1);
    saveTransactions();
    renderTransactions();
    updateTotalBalance();
};

transactionForm.addEventListener('submit', addTransaction);
renderTransactions();
updateTotalBalance();