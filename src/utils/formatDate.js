function formatDate(date) {
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  };
  return new Intl.DateTimeFormat("fr-FR", options).format(date);
}

export default formatDate;