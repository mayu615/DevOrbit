/**
 * Formats a date string into a readable format
 * Example: "2025-08-13T10:45:00Z" => "13 Aug 2025"
 * @param {string|Date} date
 * @returns {string} formatted date
 */
function formatDate(date) {
  if (!date) return "";

  const options = { day: "2-digit", month: "short", year: "numeric" };
  return new Date(date).toLocaleDateString("en-GB", options);
}

export default formatDate;
