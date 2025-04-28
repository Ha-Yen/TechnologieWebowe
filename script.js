const undraggableImages = document.querySelectorAll(".undraggable");
undraggableImages.forEach((img) => {
  img.addEventListener("dragstart", (event) => {
    event.preventDefault();
  });
});

const currentMonthElement = document.getElementById("currentMonth");
const calendarDaysElement = document.getElementById("calendarDays");
const prevMonthButton = document.getElementById("prevMonth");
const nextMonthButton = document.getElementById("nextMonth");

let currentDate = new Date();

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed (0 for January, 11 for December)
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 for Sunday, 6 for Saturday
  const daysInMonth = new Date(year, month + 1, 0).getDate(); // Get the number of days in the month
  const today = new Date();

  currentMonthElement.textContent = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(currentDate);
  calendarDaysElement.innerHTML = ""; // Clear previous days

  // Add empty cells for the days before the first day
  for (let i = 0; i < firstDayOfMonth; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.classList.add("empty");
    calendarDaysElement.appendChild(emptyCell);
  }

  // Add the days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayCell = document.createElement("div");
    dayCell.textContent = day;

    if (
      year === today.getFullYear() &&
      month === today.getMonth() &&
      day === today.getDate()
    ) {
      dayCell.classList.add("today");
    }

    calendarDaysElement.appendChild(dayCell);
  }
}

function goToPreviousMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
}

function goToNextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
}

prevMonthButton.addEventListener("click", goToPreviousMonth);
nextMonthButton.addEventListener("click", goToNextMonth);

// Initial rendering of the calendar
renderCalendar();
