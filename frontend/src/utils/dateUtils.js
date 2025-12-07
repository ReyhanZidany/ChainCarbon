// small date utilities used across the app

export const plural = (n, singular, pluralForm) => (n === 1 ? singular : (pluralForm || `${singular}s`));

export const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return null; // return null to indicate "lifetime" or unknown

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start) || isNaN(end)) return null;

  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const years = Math.floor(diffDays / 365);
  const months = Math.floor((diffDays % 365) / 30);

  if (years > 0 && months > 0) {
    return `${years} ${plural(years, "year")}`;
  }
  if (years > 0) {
    return `${years} ${plural(years, "year")}`;
  }
  if (months > 0) {
    return `${months} ${plural(months, "month")}`;
  }
  return "<1 month";
};