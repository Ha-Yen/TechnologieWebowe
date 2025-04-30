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
const waterButton = document.querySelector(".buttons button:nth-child(2)");
const lastWateredText = document.querySelector(".progress-text p:nth-child(1)");
const lastWateredTimeText = document.querySelector(
  ".progress-text p:nth-child(2)"
);
const progressBarFill = document.querySelector(".progress-bar-fill");

let currentDate = new Date();
let lastWateringDate;
let timerInterval; // To hold the interval for the count-up timer

function saveLastWateringDate(date) {
  localStorage.setItem("lastWateringDate", date.toISOString());
}

function getSavedLastWateringDate() {
  const savedDate = localStorage.getItem("lastWateringDate");
  return savedDate ? new Date(savedDate) : null;
}

function updateLastWateredDisplay() {
  lastWateredText.textContent = "Ostatnie podlanie";
  if (lastWateringDate) {
    // The actual time elapsed will be updated by the timer
  } else {
    lastWateredTimeText.textContent = "Nigdy";
  }
}

function updateProgressBar() {
  if (lastWateringDate) {
    const now = new Date();
    const timeSinceWatering = now.getTime() - lastWateringDate.getTime();
    const sevenDaysInMillis = 7 * 24 * 60 * 60 * 1000;
    const progress = Math.min(1, timeSinceWatering / sevenDaysInMillis);
    progressBarFill.style.width = `${progress * 100}%`;
  } else {
    progressBarFill.style.width = "0%";
  }
}

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  currentMonthElement.textContent = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(currentDate);
  calendarDaysElement.innerHTML = "";

  for (let i = 0; i < firstDayOfMonth; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.classList.add("empty");
    calendarDaysElement.appendChild(emptyCell);
  }

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

    if (lastWateringDate) {
      const wateredYear = lastWateringDate.getFullYear();
      const wateredMonth = lastWateringDate.getMonth();
      const wateredDay = lastWateringDate.getDate();

      if (
        year === wateredYear &&
        month === wateredMonth &&
        day === wateredDay
      ) {
        dayCell.classList.add("watered");
      }
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

function updateElapsedTime() {
  if (lastWateringDate) {
    const now = new Date();
    const timeDifference = now.getTime() - lastWateringDate.getTime();

    const seconds = Math.floor((timeDifference / 1000) % 60);
    const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
    const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    const formattedTime = `${days} D, ${hours} H, ${minutes} M, ${seconds} S`;
    lastWateredTimeText.textContent = formattedTime;
  }
}

waterButton.addEventListener("click", () => {
  lastWateringDate = new Date();
  saveLastWateringDate(lastWateringDate);
  updateLastWateredDisplay();
  updateProgressBar();
  renderCalendar();

  // Clear any existing timer and start a new one
  clearInterval(timerInterval);
  timerInterval = setInterval(updateElapsedTime, 1000);
});

document.addEventListener("DOMContentLoaded", () => {
  const savedDate = getSavedLastWateringDate();
  if (savedDate) {
    lastWateringDate = savedDate;
    updateLastWateredDisplay();
    updateProgressBar();
    // Start the timer immediately on load if there's a saved date
    timerInterval = setInterval(updateElapsedTime, 1000);
  } else {
    updateLastWateredDisplay();
    updateProgressBar();
  }
  renderCalendar();
  setInterval(updateProgressBar, 1000); // Keep updating the progress bar
});

prevMonthButton.addEventListener("click", goToPreviousMonth);
nextMonthButton.addEventListener("click", goToNextMonth);
