let currentDate = new Date();

function clearCalendar() {
    const calendarBody = document.getElementById('calendar-body');
    calendarBody.innerHTML = '';
}

function generateCalendar(year, month) {
    clearCalendar();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calendarBody = document.getElementById('calendar-body');
    let day = 1;
    let dateRunning = false;

    for (let i = 0; i < 6; i++) { // Up to 6 rows to cover all days and start of the week
        let row = document.createElement('tr');
        for (let j = 0; j < 7; j++) {
            let cell = document.createElement('td');
            if (i === 0 && j === firstDayOfMonth) {
                dateRunning = true;
            }
            if (day <= daysInMonth && dateRunning) {
                cell.textContent = day;
                if (day === currentDate.getDate() && year === currentDate.getFullYear() && month === currentDate.getMonth()) {
                    cell.classList.add('selected-day');
                }
                day++;
            } else {
                cell.textContent = '';
            }
            row.appendChild(cell);
        }
        calendarBody.appendChild(row);
    }
}

function updateCalendarHeader() {
    const monthYearSpan = document.getElementById('month-year');
    monthYearSpan.textContent = currentDate.toLocaleString('default', { month: 'long' }) + ' ' + currentDate.getFullYear();
}

document.getElementById('prev').addEventListener('click', function() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
    updateCalendarHeader();
});

document.getElementById('next').addEventListener('click', function() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
    updateCalendarHeader();
});

document.addEventListener('DOMContentLoaded', function() {
    updateCalendarHeader();
    generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
});
