// Define current date, month, and year
let currentDate = new Date();
let displayedMonth = currentDate.getMonth();
let displayedYear = currentDate.getFullYear();
let selectedInputContainer = null; // To keep track of which day the user is editing

// Clear the calendar to refresh the days displayed
function clearCalendar() {
    const calendarBody = document.getElementById('calendar-body');
    calendarBody.innerHTML = '';
}

// Generate the calendar days based on the month and year
function generateCalendar(year, month) {
    clearCalendar();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calendarBody = document.getElementById('calendar-body');
    // Calculate the number of days from the previous month to display
    let prevMonthDisplayDays = firstDayOfMonth;
    // Start from the correct day to fill the calendar
    let day = 1 - prevMonthDisplayDays;

    // Determine the number of rows needed for the month
    let totalDays = prevMonthDisplayDays + daysInMonth;
    let numRows = Math.ceil(totalDays / 7);

    for (let i = 0; i < numRows; i++) {
        let row = document.createElement('tr');
        for (let j = 0; j < 7; j++, day++) {
            let cell = document.createElement('td');
            let dateSpan = document.createElement('span');
            let inputContainer = document.createElement('span');
            inputContainer.classList.add('input-container');

            // Calculate the actual date for this cell
            let cellDate = new Date(year, month, day);
            let formattedDate = cellDate.toISOString().split('T')[0];
            let cellDay = cellDate.getDate();

            // Condition for days of the current month
            if (day > 0 && day <= daysInMonth) {
                dateSpan.textContent = cellDay;
                inputContainer.textContent = loadInput(formattedDate);

                if (day === currentDate.getDate() && month === currentDate.getMonth() && year === currentDate.getFullYear()) {
                    cell.classList.add('selected-day');
                }
            } else {
                // Fill in previous or next month's days
                dateSpan.textContent = cellDay;
                cell.classList.add('not-current-month');
                inputContainer.textContent = loadInput(formattedDate);
                inputContainer.classList.add('carried-over-input');
            }

            cell.appendChild(dateSpan);
            cell.appendChild(inputContainer);

            // Handling double-tap to show confirmation modal
            let lastTapTime = 0;
            cell.addEventListener('click', function(event) {
                let currentTime = new Date().getTime();
                let tapLength = currentTime - lastTapTime;
                if (tapLength < 200 && tapLength > 0) {
                    // Double tap detected
                    showConfirmationModal(inputContainer, formattedDate);
                } else {
                    // Delay to differentiate from double tap
                    setTimeout(function() {
                        if (new Date().getTime() - lastTapTime >= 200) {
                            showModal(dateSpan, inputContainer, formattedDate);
                        }
                    }, 200);
                }
                lastTapTime = currentTime;
            });

            row.appendChild(cell);
        }
        calendarBody.appendChild(row);
    }
}




// Function to show the confirmation modal
function showConfirmationModal(inputContainer, date) {
    let confirmationModal = document.getElementById('confirmation-modal');
    confirmationModal.style.display = "flex";

    document.getElementById('confirm-clear').onclick = function() {
        inputContainer.textContent = '';
        saveInput(date, '');
        confirmationModal.style.display = "none";
    };

    document.getElementById('cancel-clear').onclick = function() {
        confirmationModal.style.display = "none";
    };
}




// Update the calendar header to the current month and year
function updateCalendarHeader(year, month) {
    const monthYearSpan = document.getElementById('month-year');
    monthYearSpan.textContent = new Date(year, month).toLocaleString('default', { month: 'long' }) + ' ' + year;
}

function showModal(dateSpan, inputContainer, date) {
    let modal = document.getElementById('number-input-modal');
    let numberInputSpan = document.getElementById('number-input');
    numberInputSpan.textContent = inputContainer.textContent || '0';
    selectedInputContainer = inputContainer;

    modal.style.display = "flex";

    document.getElementById('done-button').onclick = function() {
        let input = numberInputSpan.textContent;
        selectedInputContainer.textContent = input;
        selectedInputContainer.style.color = 'red';
        selectedInputContainer.style.fontSize = 'larger';
        saveInput(date, input);
        modal.style.display = "none";
    };
}


// Set up event listeners once the DOM content has loaded
document.addEventListener('DOMContentLoaded', function() {
    updateCalendarHeader(displayedYear, displayedMonth);
    generateCalendar(displayedYear, displayedMonth);

    // Event listener for the 'Increase' button
    document.getElementById('increase-number').addEventListener('click', function() {
        let numberInputSpan = document.getElementById('number-input');
        numberInputSpan.textContent = parseInt(numberInputSpan.textContent, 10) + 1;
    });

    // Event listener for the 'Decrease' button
    document.getElementById('decrease-number').addEventListener('click', function() {
        let numberInputSpan = document.getElementById('number-input');
        let currentValue = parseInt(numberInputSpan.textContent, 10);
        if (currentValue > 0) {
            numberInputSpan.textContent = currentValue - 1;
        }
    });

    // Event listener for the 'Cancel' button
    document.getElementById('cancel-button').addEventListener('click', function() {
        document.getElementById('number-input-modal').style.display = "none";
    });

    // Event listener for the 'Done' button
    document.getElementById('done-button').addEventListener('click', function() {
        if (selectedInputContainer) {
            selectedInputContainer.textContent = document.getElementById('number-input').textContent;
            selectedInputContainer.style.color = 'red';
            selectedInputContainer.style.fontSize = 'larger';
        }
        document.getElementById('number-input-modal').style.display = "none";
    });

    // Event listeners for the 'Previous' and 'Next' buttons
    document.getElementById('prev').addEventListener('click', function() {
        displayedMonth--;
        if (displayedMonth < 0) {
            displayedMonth = 11;
            displayedYear--;
        }
        updateCalendarHeader(displayedYear, displayedMonth);
        generateCalendar(displayedYear, displayedMonth);
    });

    document.getElementById('next').addEventListener('click', function() {
        displayedMonth++;
        if (displayedMonth > 11) {
            displayedMonth = 0;
            displayedYear++;
        }
        updateCalendarHeader(displayedYear, displayedMonth);
        generateCalendar(displayedYear, displayedMonth);
    });
});








function loadInput(date) {
    return localStorage.getItem(date) || '';
}

function saveInput(date, input) {
    localStorage.setItem(date, input);
}
