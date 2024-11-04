const transactionForm = document.querySelector('.transaction-form');
const entryDescription = document.querySelector('.input-description');
const entryAmount = document.querySelector('.input-amount');
const entryCategory = document.querySelector('.select-category');
const entryDate = document.querySelector('.input-date');
const transactionsContainer = document.querySelector('.transactions-container');
const totalBalanceDisplay = document.querySelector('.total-balance');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let isEditing = false;
let editingIndex = -1;

const filterFormElements = {
    minPrice: document.querySelector('.filter-min-price'),
    maxPrice: document.querySelector('.filter-max-price'),
    type: document.querySelector('.filter-type'),
    date: document.querySelector('.filter-date'),
    notes: document.querySelector('.filter-notes')
};

const renderTransactions = (transactionsToDisplay = transactions) => {
    transactionsContainer.innerHTML = '';
    transactionsToDisplay.forEach((transaction, index) => {
        const transactionItem = document.createElement('li');
        transactionItem.classList.add('transaction-item');
        transactionItem.innerHTML = `
            <p>${transaction.description} - ${transaction.date}</p>
            <p>${transaction.category === 'income' ? '+' : '-'}$${transaction.amount.toFixed(2)}</p>
            <button class="edit-btn" onclick="editTransaction(${index})">✏️</button>
            <button class="delete-btn" onclick="deleteTransaction(${index})">&#10060;</button>
        `;
        transactionsContainer.appendChild(transactionItem);
    });
};

const updateTotalBalance = () => {
    const total = transactions.reduce((acc, transaction) => {
        return acc + (transaction.category === 'income' ? transaction.amount : -transaction.amount);
    }, 0);
    totalBalanceDisplay.textContent = `Total Balance: $${total.toFixed(2)}`;
};

const saveTransactions = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
};
const addTransaction = (e) => {
    e.preventDefault();
    const newTransaction = {
        description: entryDescription.value,
        amount: parseFloat(entryAmount.value),
        category: entryCategory.value,
        date: entryDate.value
    };

    if (isEditing) {
        transactions[editingIndex] = newTransaction;
        isEditing = false;
        editingIndex = -1;
    } else {
        transactions.push(newTransaction);
    }

    saveTransactions();
    renderTransactions();
    updateTotalBalance();
    transactionForm.reset();
};
const editTransaction = (index) => {
    const transaction = transactions[index];
    entryDescription.value = transaction.description;
    entryAmount.value = transaction.amount;
    entryCategory.value = transaction.category;
    entryDate.value = transaction.date;

    isEditing = true;
    editingIndex = index;
};
const deleteTransaction = (index) => {
    transactions.splice(index, 1);
    saveTransactions();
    renderTransactions();
    updateTotalBalance();
};

const applyFilters = () => {
    const minPrice = parseFloat(filterFormElements.minPrice.value) || -Infinity;
    const maxPrice = parseFloat(filterFormElements.maxPrice.value) || Infinity;
    const type = filterFormElements.type.value;
    const date = filterFormElements.date.value;
    const notes = filterFormElements.notes.value.toLowerCase();

    const filteredTransactions = transactions.filter(transaction => {
        return (
            transaction.amount >= minPrice &&
            transaction.amount <= maxPrice &&
            (type === '' || transaction.category === type) &&
            (date === '' || transaction.date === date) &&
            (notes === '' || transaction.description.toLowerCase().includes(notes))
        );
    });

    renderTransactions(filteredTransactions);
};

transactionForm.addEventListener('submit', addTransaction);
document.getElementById('apply-filters-btn').addEventListener('click', (e) => {
    e.preventDefault();
    applyFilters();
});
renderTransactions();
updateTotalBalance();