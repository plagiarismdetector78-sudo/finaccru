export function formatAmount(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const formatAmountTwoDecimal = (value) => {
    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

export function formatNegativeAmount(value) {
    const number = parseFloat(value) || 0;
    const isNegative = number < 0;
    const formatted = Math.abs(number).toFixed(2);
    return isNegative ? `(${formatted})` : formatted;
}
