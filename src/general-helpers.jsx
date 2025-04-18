function formatDisplayFromSeconds(totalSeconds) {
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];

  if (days > 0) parts.push(`${days} d`);
  if (hours > 0) parts.push(`${hours} h`);
  if (minutes > 0) parts.push(`${minutes} m`);
  if (seconds > 0 || parts.length === 0)
    parts.push(`${seconds} s`);

  return parts.join(" ");
}

function generateSerial(prefix = "") {
  const getRandomChar = () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26));

  const getRandomNumber = () =>
    Math.floor(Math.random() * 10).toString();

  const getTimestampPart = () => {
    const now = new Date();
    return (
      now.getFullYear().toString().slice(2) + // last 2 digits of year
      (now.getMonth() + 1).toString().padStart(2, "0") + // month
      now.getDate().toString().padStart(2, "0") + // day
      now.getHours().toString().padStart(2, "0") + // hour
      now.getMinutes().toString().padStart(2, "0") + // minutes
      now.getSeconds().toString().padStart(2, "0") // seconds
    );
  };

  if (!prefix) {
    prefix = Array.from({ length: 3 }, getRandomChar).join("");
  } else {
    prefix = prefix.toUpperCase().slice(0, 3).padEnd(3, getRandomChar());
  }

  const timestamp = getTimestampPart();
  const randomChars = Array.from({ length: 3 }, getRandomChar).join("");
  const randomNums = Array.from({ length: 3 }, getRandomNumber).join("");

  const serial = prefix + timestamp + randomChars + randomNums;
  return serial;
}

export { formatDisplayFromSeconds, generateSerial };
