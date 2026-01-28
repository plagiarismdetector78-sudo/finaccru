const calculateTotalAmounts = (
    line_items,
    setSubTotal,
    setDiscount,
    setTax,
    setTotal,
    setItemTax,
    taxRates
) => {
    let subTotalAmount = 0;
    let discountAmount = 0;
    let taxAmount = 0;

    const calculatedTax = [];

    const calculateFinalAmount = line_items?.map((item) => {
        const { qty, rate, discount, is_percentage_discount, tax_id } = item;
        let finalRate = 0;
        let overAllRate = 0;
        if (is_percentage_discount) {
            finalRate = rate - (rate * discount) / 100;
            overAllRate = finalRate * qty;
            discountAmount += (rate - finalRate) * qty;
        } else {
            discountAmount += +discount * qty;
            overAllRate = (rate - discount) * qty;
        }
        subTotalAmount += rate * qty;
        let tax = 0;
        const taxItem = taxRates?.find((tax) => tax.tax_rate_id === tax_id);
        if (taxItem?.tax_percentage !== 0) {
            tax = overAllRate * (taxItem?.tax_percentage / 100);
            taxAmount += tax;
        }
        calculatedTax.push(parseFloat(tax.toFixed(2)));

        const finalAmount = parseFloat((overAllRate + tax).toFixed(2));
        return finalAmount;
    });

    setSubTotal(parseFloat(subTotalAmount.toFixed(2)));
    setDiscount(parseFloat(discountAmount.toFixed(2)));
    setTax(parseFloat(taxAmount.toFixed(2)));
    setTotal(
        parseFloat((subTotalAmount - discountAmount + taxAmount).toFixed(2))
    );
    setItemTax(calculatedTax);

    return calculateFinalAmount;
};

export default calculateTotalAmounts;
