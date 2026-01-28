export const calculateItemTaxes = (items, taxRates, showTax = true) => {
    // Initialize result objects
    const result = {
        // Grouped tax information
        groupedItems: [],
        // Individual item calculations
        itemTotals: [],
        itemTaxes: [],
        // Summary amounts
        subtotal: 0,
        discountTotal: 0,
        taxTotal: 0,
        grandTotal: 0,
    };

    // Early exit if no items
    if (!items || !items.length || !taxRates) {
        return result;
    }

    // Tax grouping for reporting
    const taxGroups = {};

    // Process each line item
    items.forEach((item, index) => {
        // Skip invalid items
        if (!item) {
            return;
        }

        // Extract item properties with proper type conversion
        const qty = parseFloat(item.qty) || 0;
        const rate = parseFloat(item.rate) || 0;
        const discount = parseFloat(item.discount) || 0;
        const {
            is_percentage_discount = false,
            tax_id = null,
            is_inclusive = false,
        } = item;

        // Find the applicable tax rate
        const taxItem = taxRates.find((tr) => tr.tax_rate_id === tax_id);
        const taxPercentage = taxItem?.tax_percentage || 0;
        const taxRateDecimal = taxPercentage / 100;
        const taxRateName = taxItem?.tax_rate_name || "No Tax";

        // Calculate line item amount before discount
        const lineAmountBeforeDiscount = Number((rate * qty).toFixed(2));

        // Calculate discount amount
        let lineDiscountAmount = 0;
        if (is_percentage_discount) {
            lineDiscountAmount = Number(
                ((lineAmountBeforeDiscount * discount) / 100).toFixed(2)
            );
        } else {
            lineDiscountAmount = Number((discount * qty).toFixed(2));
        }

        // Amount after discount (before tax)
        const amountAfterDiscount = Number(
            (lineAmountBeforeDiscount - lineDiscountAmount).toFixed(2)
        );

        // Tax calculation variables
        let taxableAmount = 0;
        let taxAmount = 0;
        let finalAmount = 0;

        // Determine tax based on inclusive/exclusive setting
        if (taxPercentage !== 0 && showTax) {
            if (is_inclusive) {
                // TAX INCLUSIVE: Price already includes tax
                // Extract pre-tax amount: price_with_tax / (1 + tax_rate)
                taxableAmount = Number(
                    (amountAfterDiscount / (1 + taxRateDecimal)).toFixed(2)
                );
                taxAmount = Number(
                    (amountAfterDiscount - taxableAmount).toFixed(2)
                );
                finalAmount = amountAfterDiscount; // Final amount is the same as amount after discount
            } else {
                // TAX EXCLUSIVE: Add tax on top of price
                taxableAmount = amountAfterDiscount;
                taxAmount = Number((taxableAmount * taxRateDecimal).toFixed(2));
                finalAmount = Number((taxableAmount + taxAmount).toFixed(2));
            }
        } else {
            // No tax applied
            taxableAmount = amountAfterDiscount;
            taxAmount = 0;
            finalAmount = amountAfterDiscount;
        }

        // Store individual item results
        result.itemTotals[index] = finalAmount;
        result.itemTaxes[index] = taxAmount;

        // Update running totals
        result.subtotal = Number((result.subtotal + taxableAmount).toFixed(2));
        result.discountTotal = Number(
            (result.discountTotal + lineDiscountAmount).toFixed(2)
        );
        result.taxTotal = Number((result.taxTotal + taxAmount).toFixed(2));
        result.grandTotal = Number(
            (result.subtotal + result.taxTotal).toFixed(2)
        );

        // Add to tax groups for reporting
        if (!taxGroups[tax_id]) {
            taxGroups[tax_id] = {
                tax_id,
                tax_rate_name: taxRateName,
                taxable_amount: 0,
                tax_amount: 0,
                total_amount: 0,
            };
        }

        // Update tax group totals with proper rounding
        const group = taxGroups[tax_id];
        group.taxable_amount = Number(
            (group.taxable_amount + taxableAmount).toFixed(2)
        );
        group.tax_amount = Number((group.tax_amount + taxAmount).toFixed(2));
        group.total_amount = Number(
            (group.total_amount + finalAmount).toFixed(2)
        );
    });

    // Convert tax groups object to array
    result.groupedItems = Object.values(taxGroups);

    return result;
};
