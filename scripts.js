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
                    disableModalClose = true;  // Disable closing of modals temporarily

                    showConfirmationModal(inputContainer, formattedDate);

                    // Re-enable closing of modals after a short delay
                    setTimeout(function() {
                        disableModalClose = false;
                    }, 500); // Adjust the delay as needed
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
    if (!canOpenModal) return;
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
    if (!canOpenModal) return;
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
        numberInputSpan.textContent = parseFloat(numberInputSpan.textContent, 10) + 0.5;
    });

    // Event listener for the 'Decrease' button
    document.getElementById('decrease-number').addEventListener('click', function() {
        let numberInputSpan = document.getElementById('number-input');
        let currentValue = parseFloat(numberInputSpan.textContent, 10);
        if (currentValue > 0) {
            numberInputSpan.textContent = currentValue - 0.5;
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






// Event listener for the 'Home' tab
document.getElementById('home-tab').addEventListener('click', function() {
    currentDate = new Date(); // Reset to current date
    displayedMonth = currentDate.getMonth();
    displayedYear = currentDate.getFullYear();
    updateCalendarHeader(displayedYear, displayedMonth);
    generateCalendar(displayedYear, displayedMonth);
});

// Modify the event listener for the 'Sum' tab to call the new function
document.getElementById('sum-tab').addEventListener('click', function() {
    if (!canOpenModal) return;
    calculateWeeklySums(); // Calculate sums when the sum tab is clicked
    document.getElementById('sum-prompt').style.display = "flex"; // Show the prompt
});


function calculateWeeklySums() {
    let weeklySums = document.getElementById('weekly-summaries');
    weeklySums.innerHTML = ''; // Clear existing content

    // Calculate the first and last calendar days displayed for the current month's view
    let calendarStart = new Date(displayedYear, displayedMonth, 1);
    calendarStart.setDate(calendarStart.getDate() - calendarStart.getDay()); // Go back to the start of the week

    let calendarEnd = new Date(displayedYear, displayedMonth + 1, 0); // Last day of the current month
    calendarEnd.setDate(calendarEnd.getDate() + (6 - calendarEnd.getDay())); // Go forward to the end of the week

    let currentDay = new Date(calendarStart);
    let weekSum = 0;
    let weekStartDay = currentDay.getDate();
    let weekStartDate = new Date(currentDay);

    // Loop over each day from the calendar start to the calendar end
    while (currentDay <= calendarEnd) {
        // Sum drinks for the day
        let dateKey = formatDateKey(currentDay);
        weekSum += parseFloat(localStorage.getItem(dateKey) || '0', 10);

        // At the end of the week, post the weekly total
        if (currentDay.getDay() === 6) {
            postWeekTotal(weekStartDate, weekSum, weeklySums);
            weekSum = 0; // Reset for the next week
        }

        // Move to the next day, check if the week or month has ended
        currentDay.setDate(currentDay.getDate() + 1);
        if (currentDay.getDay() === 0) {
            weekStartDate = new Date(currentDay);
        }
    }

    // If the week didn't end on a Saturday, post the remaining days as the final week
    if (weekSum > 0) {
        postWeekTotal(weekStartDate, weekSum, weeklySums);
    }
}

function postWeekTotal(weekStartDate, weekSum, weeklySums) {
    // Adjust week start day for display
    let weekStartDay = weekStartDate.getDate();
    let weekStartDisplay;

    // Check if the week starts in the current month or the previous month
    if (weekStartDate.getMonth() === displayedMonth) {
        weekStartDisplay = weekStartDay; // Use the current date if in the current month
    } else {
        // If the week starts in the previous month, get the last Sunday of that month
        let lastSundayPreviousMonth = new Date(weekStartDate);
        lastSundayPreviousMonth.setDate(lastSundayPreviousMonth.getDate() - lastSundayPreviousMonth.getDay());
        weekStartDisplay = lastSundayPreviousMonth.getDate(); // Use the date of the last Sunday
    }

    let summaryElement = document.createElement('div');
    summaryElement.innerHTML = `Week of the ${weekStartDisplay}${getOrdinalSuffix(weekStartDisplay)}: `;
    let drinksText = document.createElement('span');
    drinksText.classList.add('drinks-number');
    drinksText.textContent = `${weekSum} drinks`;
    summaryElement.appendChild(drinksText);
    weeklySums.appendChild(summaryElement);
}

function formatDateKey(date) {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}




// Function to get the ordinal suffix for a number
function getOrdinalSuffix(number) {
    let j = number % 10, k = number % 100;
    if (j == 1 && k != 11) {
        return "st";
    }
    if (j == 2 && k != 12) {
        return "nd";
    }
    if (j == 3 && k != 13) {
        return "rd";
    }
    return "th";
}



// Function to close the sum prompt
function closeSumPrompt() {
    document.getElementById('sum-prompt').style.display = "none";
}

// Event listener for the close button
document.querySelector('.close-button').addEventListener('click', closeSumPrompt);


let disableModalClose = false;
let canOpenModal = true;
const MODAL_OPEN_TIMEOUT = 200; // Timeout duration in milliseconds, adjust as needed

// Function to close a modal and return true if it was closed
function closeModal(modalId) {
    let modal = document.getElementById(modalId);
    if (modal && modal.style.display !== "none") {
        modal.style.display = "none";
        canOpenModal = false;

        setTimeout(() => {
            canOpenModal = true;
        }, MODAL_OPEN_TIMEOUT);

        console.log(`Modal '${modalId}' closed`);
    }
}

// Event listener for clicking outside the modals
window.addEventListener('click', function(event) {
    let modals = ['number-input-modal', 'confirmation-modal', 'sum-prompt'];
    let modalClosed = false;

    modals.forEach(function(modalId) {
        let modal = document.getElementById(modalId);
        // Check if the modal is displayed
        if (modal && modal.style.display === "flex") {
            let modalContent = modal.querySelector('.modal-content');
            let isClickInsideModalContent = modalContent && modalContent.contains(event.target);

            // Check if the click is on the 'sum-tab' button
            let isSumTabClick = event.target.closest('#sum-tab');

            if (!isClickInsideModalContent && !isSumTabClick && !disableModalClose) {
                if (closeModal(modalId)) {
                    modalClosed = true;
                }
            }
        }
    });

    if (modalClosed) {
        event.stopPropagation(); // Stop the propagation if a modal was closed
    }
});
