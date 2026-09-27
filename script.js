let expression = "";
let justCalculated = false;

let result = document.getElementById("result");
let expressionDisplay = document.getElementById("expression");


// Add value to calculator
function appendValue(value) {

    // If result was already calculated
    if (justCalculated) {
        expression = "";
        expressionDisplay.innerText = "";
        justCalculated = false;
    }

    // Prevent multiple decimal points
    if (
        value === "." &&
        /(?:^|[+\-*/])[^+\-*/]*\.$/.test(expression)
    ) {
        return;
    }

    // Prevent operator at beginning
    if (
        ["+", "-", "*", "/"].includes(value) &&
        expression === ""
    ) {
        return;
    }

    // Replace previous operator
    if (
        ["+", "-", "*", "/"].includes(value) &&
        /[+\-*/]$/.test(expression)
    ) {
        expression = expression.slice(0, -1);
    }

    expression += value;

    result.innerText = expression;
}


// Clear calculator
function clearDisplay() {

    expression = "";

    result.innerText = "0";

    expressionDisplay.innerText = "";

    justCalculated = false;
}


// Delete last character
function deleteLast() {

    if (justCalculated) {
        clearDisplay();
        return;
    }

    expression = expression.slice(0, -1);

    result.innerText = expression || "0";
}


// Calculate result
function calculate() {

    if (expression === "") {
        return;
    }

    try {

        // Don't calculate if expression ends with operator
        if (/[+\-*/.]$/.test(expression)) {
            return;
        }

        let calculation = expression;

        // Percentage
        calculation = calculation.replace(
            /(\d+(?:\.\d+)?)%/g,
            "($1/100)"
        );

        // Check valid characters
        if (!/^[0-9+\-*/().%\s]+$/.test(calculation)) {
            throw new Error();
        }

        let answer = Function(
            '"use strict"; return (' + calculation + ')'
        )();

        if (!Number.isFinite(answer)) {
            throw new Error();
        }

        expressionDisplay.innerText = expression + " =";

        answer = Number(answer.toFixed(10));

        expression = answer.toString();

        result.innerText = expression;

        justCalculated = true;

    } catch (error) {

        expressionDisplay.innerText = "Invalid calculation";

        result.innerText = "Error";

        expression = "";

        justCalculated = true;
    }
}


// Keyboard support
document.addEventListener("keydown", function(event) {

    let key = event.key;

    // Numbers
    if (key >= "0" && key <= "9") {
        appendValue(key);
    }

    // Decimal
    else if (key === ".") {
        appendValue(".");
    }

    // Operators
    else if (
        key === "+" ||
        key === "-" ||
        key === "*" ||
        key === "/"
    ) {
        appendValue(key);
    }

    // Enter
    else if (key === "Enter" || key === "=") {
        calculate();
    }

    // Backspace
    else if (key === "Backspace") {
        deleteLast();
    }

    // Escape
    else if (key === "Escape") {
        clearDisplay();
    }

});