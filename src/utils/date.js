export function getDate() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    return `${year}-${month}-${date}`;
}

const formatDate = (date, isReversed = false) => {
    if (!date) return "";

    const d = new Date(date);
    if (isNaN(d)) return ""; // Handle invalid date

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = d.getFullYear();

    return isReversed ? `${year}-${month}-${day}` : `${day}-${month}-${year}`;
};

export { formatDate };
