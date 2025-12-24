export const formatDate = () => {
  const now = new Date();
  return now.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).replace(/ /g, ' ');
};

export const getYesterdayDate = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).replace(/ /g, ' ');
};