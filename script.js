// Selecting elements
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const addExpenseBtn = document.getElementById("addExpense");
const expenseList = document.getElementById("expenseList");
const totalAmount = document.getElementById("total");
const filterCategory = document.getElementById("filterCategory");
const toggleThemeBtn = document.getElementById("toggleTheme");
const expenseChartCanvas = document.getElementById("expenseChart");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let expenseChart = null;  // ✅ Declare the variable first

updateUI();

// Function to add expense
addExpenseBtn.addEventListener("click", () => {
    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const category = categoryInput.value;

    if (description === "" || isNaN(amount) || amount <= 0) {
        alert("Please enter valid expense details.");
        return;
    }

    const expense = { id: Date.now(), description, amount, category };
    expenses.push(expense);
    saveToLocalStorage();
    updateUI();

    descriptionInput.value = "";
    amountInput.value = "";
});

// Function to remove an expense
function removeExpense(id) {
    expenses = expenses.filter(expense => expense.id !== id);
    saveToLocalStorage();
    updateUI();
}

// Function to update the UI
function updateUI() {
    expenseList.innerHTML = "";
    let total = 0;
    let filteredExpenses = expenses;

    if (filterCategory.value !== "All") {
        filteredExpenses = expenses.filter(expense => expense.category === filterCategory.value);
    }

    filteredExpenses.forEach(expense => {
        total += expense.amount;

        const li = document.createElement("li");
        li.innerHTML = `
            ${expense.description} - ₹${expense.amount} (${expense.category})
            <button class="delete-btn" onclick="removeExpense(${expense.id})">X</button>
        `;
        expenseList.appendChild(li);
    });

    totalAmount.textContent = total;
    updateChart();  // ✅ Call the function after UI update
}

// Save data to localStorage
function saveToLocalStorage() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

// Handle filter category change
filterCategory.addEventListener("change", updateUI);

// Dark Mode Toggle
toggleThemeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    toggleThemeBtn.textContent = document.body.classList.contains("dark-mode") ? "☀️ Light Mode" : "🌙 Dark Mode";
});

// Function to update Chart.js
function updateChart() {
    const categories = ["Food", "Travel", "Shopping", "Other"];
    const categoryTotals = categories.map(cat =>
        expenses.filter(exp => exp.category === cat).reduce((sum, exp) => sum + exp.amount, 0)
    );

    // ✅ Fix: Destroy the previous chart before creating a new one
    if (expenseChart !== null) {
        expenseChart.destroy();
    }

    expenseChart = new Chart(expenseChartCanvas, {
        type: "pie",
        data: {
            labels: categories,
            datasets: [{
                label: "Expenses",
                data: categoryTotals,
                backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#8e5ea2"]
            }]
        }
    });
}
