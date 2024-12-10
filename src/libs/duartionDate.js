export default function durationDate(startTime, endTime) {
  const startDate = new Date(startTime);
  const endDate = new Date(endTime);

  // Calculate the difference in milliseconds
  const differenceInMilliseconds = endDate - startDate;

  // Convert milliseconds to total minutes
  const totalMinutes = Math.floor(differenceInMilliseconds / (1000 * 60));

  // Calculate hours and minutes
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  // Create a formatted string based on hours and minutes
  let durationString = '';
  if (hours > 0) {
    durationString += `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  if (minutes > 0) {
    if (durationString) durationString += ' and ';
    durationString += `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }

  // If both hours and minutes are zero, indicate that
  if (!durationString) {
    durationString = '0 minutes';
  }

  return durationString
}
