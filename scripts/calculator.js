class Calculator {
    constructor() {
        this.display = document.querySelector('.display');
        this.currentValue = '0';
        this.previousValue = null;
        this.operation = null;
        this.shouldResetDisplay = false;
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Button clicks
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', () => this.handleInput(button.textContent));
        });

        // Keyboard support
        document.addEventListener('keydown', (event) => {
            event.preventDefault();
            const key = event.key;

            // Number keys (0-9) and decimal
            if (/^[0-9.]$/.test(key)) {
                this.handleInput(key);
            }
            // Operators
            else if (['+', '-', '*', '/', '=', 'Enter'].includes(key)) {
                let operator = key;
                if (key === '/') operator = '÷';
                if (key === '*') operator = '×';
                if (key === 'Enter') operator = '=';
                this.handleInput(operator);
            }
            // Clear (Escape key)
            else if (key === 'Escape') {
                this.handleInput('AC');
            }
            // Percentage
            else if (key === '%') {
                this.handleInput('%');
            }
        });
    }

    handleInput(value) {
        if (value >= '0' && value <= '9' || value === '.') {
            this.handleNumber(value);
        } else if (value === 'AC') {
            this.clear();
        } else if (value === '+/-') {
            this.toggleSign();
        } else if (value === '%') {
            this.percentage();
        } else if (value === '=') {
            this.calculate();
        } else {
            this.handleOperation(value);
        }
    }

    handleNumber(number) {
        if (this.shouldResetDisplay) {
            this.currentValue = '0';
            this.shouldResetDisplay = false;
        }

        // Handle decimal point
        if (number === '.' && this.currentValue.includes('.')) {
            return;
        }

        // Handle leading zero
        if (this.currentValue === '0' && number !== '.') {
            this.currentValue = number;
        } else {
            this.currentValue += number;
        }

        this.updateDisplay();
    }

    handleOperation(operator) {
        if (this.operation && !this.shouldResetDisplay) {
            this.calculate();
        }

        this.previousValue = this.currentValue;
        this.operation = operator;
        this.shouldResetDisplay = true;
    }

    calculate() {
        if (!this.operation || !this.previousValue) return;

        const prev = parseFloat(this.previousValue);
        const current = parseFloat(this.currentValue);
        let result;

        switch (this.operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '×':
                result = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    this.currentValue = 'Error';
                    this.updateDisplay();
                    return;
                }
                result = prev / current;
                break;
        }

        // Format the result
        this.currentValue = this.formatNumber(result);
        this.operation = null;
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    formatNumber(number) {
        if (isNaN(number)) return 'Error';
        
        // Handle large numbers
        if (Math.abs(number) > 999999999) {
            return number.toExponential(3);
        }
        
        // Convert to string and limit decimal places
        let str = number.toString();
        if (str.includes('.')) {
            const parts = str.split('.');
            if (parts[1].length > 8) {
                return number.toFixed(8);
            }
        }
        return str;
    }

    clear() {
        this.currentValue = '0';
        this.previousValue = null;
        this.operation = null;
        this.shouldResetDisplay = false;
        this.updateDisplay();
    }

    toggleSign() {
        if (this.currentValue === '0' || this.currentValue === 'Error') return;
        this.currentValue = (parseFloat(this.currentValue) * -1).toString();
        this.updateDisplay();
    }

    percentage() {
        if (this.currentValue === 'Error') return;
        this.currentValue = (parseFloat(this.currentValue) / 100).toString();
        this.updateDisplay();
    }

    updateDisplay() {
        this.display.textContent = this.currentValue;
    }
}

// Initialize calculator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
}); 