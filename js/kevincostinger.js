"use strict";
/*******************************************************
 *     kevincostinger.js - 100p.
 *
 *     This is Kevin. Kevin keeps track of your expenses
 *     and costs. To add an expense, pick a date, declare
 *     the amount and add a short description.
 *
 *     When you submit the form, all fields are validated.
 *     If Kevin is not happy with your inputs, the least
 *     he will do is, bring you back to the field where
 *     you made a mistake. But who knows? Maybe he can
 *     even provide some excellent User experience?
 *     (+5 Bonus points available)
 *
 *     These are the rules for the form validation:
 *      - Date is valid, if it's not empty.
 *      - Amount is valid, if it's at least 0.01.
 *      - Text is valid, if it's at least 3 letters long.
 *
 *     If everything is okay, Kevin adds a new table row,
 *     containing the expense. The table row also contains
 *     a button, which deletes the expense, once you click
 *     it. After adding a table row, the form is reset and
 *     ready for the next input.
 *
 *     At the bottom of the expense tracker, you can see
 *     a small number. It represents the sum of all expenses,
 *     which are currently tracked. It is always accurate!
 *
 *     Have a look at the pictures provided. They demonstrate
 *     how the software looks like. Notice the details, like
 *     the perfectly formatted currency! Isn't that great?
 *
 *     By the way...
 *     Kevin is a clean guy. He is free of code duplications.
 *     Kevin defines his quality by using functions and
 *     events, to keep his sourcecode clean af. He understands
 *     the scope of his variables and of course, makes use of
 *     event delegation, to keep his event listeners tidied up!
 *
 *     Elias - 2026-03-25
 *******************************************************/
let sumExpenses = 0; //Use this variable to keep the sum up to date.

const form = document.querySelector("form");
const dateInput = document.getElementById("date");
const amountInput = document.getElementById("amount");
const expenseInput = document.getElementById("expense");
const expensesTableBody = document.querySelector("#expenses tbody");
const expenseSum = document.getElementById("expenseSum");


function submitForm(e){
    //TODO: Prevent the default behavior of the submit button.
    e.preventDefault();

    //TODO: Validate the form. If everything is fine, add the expense to the tracker and reset the form.
    if (!validateForm()) {
        return;
    }

    const dateValue = dateInput.value;
    const amountValue = Number(amountInput.value);
    const expenseValue = expenseInput.value.trim();

    addExpense(dateValue, amountValue, expenseValue);

    form.reset(); // danach zurücksetzen
    dateInput.focus(); // für die Benutzerfreundlichkeit --> Benutzer kann gleich wieder Datum eingeben

}



function validateForm(){
    const dateValue = dateInput.value;
    const amountValue = Number(amountInput.value); // Number da er mir einen String sonst liefert
    const expenseValue = expenseInput.value.trim(); // Trim ist nur für die darstellung damit die eingaben von leerzeichen vorn und hinten egal sind

    clearAllFieldErrors();

    if (isEmpty(dateValue)) {
        showFieldError(dateInput, "Please select a date.");
        return false;
    }

    if (isNaN(amountValue) || amountValue < 0.01) {
        showFieldError(amountInput, "Please enter an amount of at least 0.01.");
        return false;
    }

    if (expenseValue.length < 3) {
        showFieldError(expenseInput, "Please enter at least 3 numbers or letters.");
        return false;
    }

    return true;
}


function addExpense(date, amount, expenseText) {
    const newRow = document.createElement("tr"); //neues HTML Element das wir danach befüllt durch inner.html

    newRow.innerHTML = `
        <td>${date}</td>
        <td>${formatEuro(amount)}</td>
        <td>${expenseText}</td>
        <td><button type="button">X</button></td>
    `;

    expensesTableBody.appendChild(newRow); // damit die neue Zeile unten an die tabelle angehängt werden

    sumExpenses += amount;
    updateExpenseSum();
}

function updateExpenseSum() {
    expenseSum.textContent = formatEuro(sumExpenses);
}

function handleDeleteClick(e) {
    if (e.target.tagName !== "BUTTON") {
        return;
    }

    const row = e.target.closest("tr");//Da der Button in einer <td> steckt und diese <td> in einer <tr>, bekommen wir so genau die Zeile, die gelöscht werden soll.
                                                                    //Hab mir das erklären lassen von der KI
    const amountText = row.children[1].textContent; //um die richtige Zeile zu erreichen (0=Date 1=Amount 2=Expense 3=Delete)
    const amountValue = parseEuroToNumber(amountText);

    sumExpenses -= amountValue;
    updateExpenseSum();

    row.remove();
}

//Diese Funktion mithilfe von KI gelöst um meinen Bug zu fixen
function parseEuroToNumber(euroString) {
    return Number(
        euroString
            .replace(/\./g, "")
            .replace(",", ".")
            .replace(/[^\d.-]/g, "")
    );
}


form.addEventListener("submit", submitForm);


expensesTableBody.addEventListener("click", handleDeleteClick);

//Bonus für die UX


function showFieldError(input, message) {
    input.style.borderColor = "red";
    input.setCustomValidity(message);
    input.reportValidity();
    input.focus();
}

function clearFieldError(input) {
    input.style.borderColor = "";
    input.setCustomValidity("");
}

function clearAllFieldErrors() {
    clearFieldError(dateInput);
    clearFieldError(amountInput);
    clearFieldError(expenseInput);
}


dateInput.addEventListener("input", function() {
    clearFieldError(dateInput);
});

amountInput.addEventListener("input", function() {
    clearFieldError(amountInput);
});

expenseInput.addEventListener("input", function() {
    clearFieldError(expenseInput);
});










/*****************************
 * DO NOT CHANGE CODE BELOW.
 * USE IT.
 ****************************/


/*******************************************************
 *     Checks if variable is empty
 *     @param {any} variable - Variable which you want to check.
 *     @return {Boolean} Empty or not.
 ******************************************************/
let isEmpty = function(variable) {
    if(Array.isArray(variable))
        return (variable.length === 0);
    else if(typeof variable === "object")
        return (Object.entries(variable).length === 0);
    else
        return (typeof variable === "undefined" || variable == null || variable === "");
};

/*******************************************************
 *     Converts number into currency string.
 *     @param {Number} number - Any numeric value.
 *     @return {String} Well formatted currency string.
 ******************************************************/
function formatEuro(number) {
    return number.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
}