const monthYear = document.getElementById("month-year");
const calendar = document.getElementById("calendar");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const modal = document.getElementById("note-modal");
const closeModal = document.getElementById("close-modal");
const modalDate = document.getElementById("modal-date");
const noteText = document.getElementById("note-text");
const saveNote = document.getElementById("save-note");

let currentDate = new Date();
let selectedDate = null;

function getNotes() {
  return JSON.parse(localStorage.getItem("calendar-notes") || "{}");
}

function saveNoteToStorage(dateStr, text) {
  const notes = getNotes();
  notes[dateStr] = text;
  localStorage.setItem("calendar-notes", JSON.stringify(notes));
}

function generateCalendar() {
  calendar.innerHTML = "";

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay();
  const totalDays = lastDay.getDate();

  monthYear.textContent = firstDay.toLocaleString("es-ES", {
    month: "long",
    year: "numeric"
  });

  const notes = getNotes();

  for (let i = 0; i < startDay; i++) {
    const empty = document.createElement("div");
    calendar.appendChild(empty);
  }

  for (let day = 1; day <= totalDays; day++) {
    const cell = document.createElement("div");

    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    cell.innerHTML = `<strong>${day}</strong>`;

    if (notes[dateStr]) {
      const noteDiv = document.createElement("div");
      noteDiv.classList.add("note-preview");
      noteDiv.textContent = notes[dateStr].slice(0, 40);
      cell.appendChild(noteDiv);
    }

    cell.addEventListener("click", () => {
      selectedDate = dateStr;
      modalDate.textContent = `Nota para ${day}/${month + 1}/${year}`;
      noteText.value = notes[dateStr] || "";
      modal.classList.remove("hidden");
    });

    calendar.appendChild(cell);
  }
}

prevBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  generateCalendar();
});

nextBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  generateCalendar();
});

closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

saveNote.addEventListener("click", () => {
  const note = noteText.value.trim();
  if (note) {
    saveNoteToStorage(selectedDate, note);
  }
  modal.classList.add("hidden");
  generateCalendar();
});

generateCalendar();
