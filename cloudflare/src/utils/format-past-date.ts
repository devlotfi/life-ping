export function formatPastDate(date: Date): string {
  const now = new Date();

  // Use .getTime() to convert Dates to numbers for arithmetic
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // 1. Format the absolute date: dd/mm/yyyy hh:mm
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Corrected month logic
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const absoluteDate = `${day}/${month}/${year} ${hours}:${minutes}`;

  // 2. Calculate the "time ago" string
  let relativeTime = "";
  if (diffInSeconds < 60) {
    relativeTime = `${diffInSeconds}s ago`;
  } else if (diffInSeconds < 3600) {
    relativeTime = `${Math.floor(diffInSeconds / 60)}m ago`;
  } else if (diffInSeconds < 86400) {
    relativeTime = `${Math.floor(diffInSeconds / 3600)}h ago`;
  } else {
    relativeTime = `${Math.floor(diffInSeconds / 86400)}d ago`;
  }

  return `${absoluteDate} (${relativeTime})`;
}
