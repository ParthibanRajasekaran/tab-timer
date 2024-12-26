// Maximum length for the truncated original title
const MAX_TITLE_LENGTH = 30;

// Store the original tab title (trimmed to MAX_TITLE_LENGTH if necessary)
let originalTitle = document.title.length > MAX_TITLE_LENGTH
  ? document.title.substring(0, MAX_TITLE_LENGTH) + "..."
  : document.title;

// Function to update the tab title with the elapsed time
function updateTabTitle(elapsedMs) {
  const formattedTime = formatDuration(elapsedMs);

  // Avoid adding the timer repeatedly by checking if the title already has it
  if (!document.title.includes(formattedTime)) {
    document.title = `${originalTitle} - ${formattedTime}`;
  }
}

// Utility function to format milliseconds into HH:MM:SS
function formatDuration(ms) {
  if (!ms) return "00:00:00";
  let seconds = Math.floor(ms / 1000);
  let minutes = Math.floor(seconds / 60);
  seconds %= 60;
  let hours = Math.floor(minutes / 60);
  minutes %= 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

// Continuously update the title every second
let elapsedMs = 0;
setInterval(() => {
  elapsedMs += 1000;
  updateTabTitle(elapsedMs);
}, 1000);
