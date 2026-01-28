import numberToWords from "number-to-words";

const convertNumberToWords = (num) => {
    if (isNaN(num)) {
        return "";
    }

    const [integerPart, decimalPart] = num.toFixed(2).split(".");
    const integerInWords = numberToWords.toWords(parseInt(integerPart, 10));
    const decimalInWords =
        decimalPart && parseInt(decimalPart, 10) > 0
            ? numberToWords.toWords(parseInt(decimalPart, 10))
            : "";

    return decimalInWords
        ? `${integerInWords} Dirhams and ${decimalInWords} Fils`
        : `${integerInWords} Dirhams`;
};

export default convertNumberToWords;
