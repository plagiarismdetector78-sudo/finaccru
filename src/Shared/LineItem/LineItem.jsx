import { View, Text } from "@react-pdf/renderer";

const formatNumber = (value) => {
    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(parseFloat(value || 0));
};

// Reusable component for table headers
const TableHeader = ({ label, styles }) => (
    <View style={styles?.mainItemHeading}>
        <Text>{label}</Text>
    </View>
);

const LineItem = ({
    styles,
    item_name,
    unit,
    qty,
    rate,
    discount,
    is_percentage_discount,
    tax_id,
    taxAmount,
    taxRateName,
    amount,
    description,
    index,
    showTax,
}) => {
    return (
        <View style={styles?.main} key={index}>
            <View style={styles?.mainWholeItem}>
                <View style={styles?.mainItemName}>
                    {index === 0 && (
                        <TableHeader label="Item Name" styles={styles} />
                    )}
                    <View
                        style={
                            item_name?.length > 40
                                ? styles?.mainItemNameBoxLong
                                : styles?.mainItemNameBoxShort
                        }
                    >
                        <Text>{item_name}</Text>
                    </View>
                </View>
                <View style={styles?.mainItemUnit}>
                    {index === 0 && (
                        <TableHeader label="Unit" styles={styles} />
                    )}
                    <View style={styles?.mainItemUnitBox}>
                        <Text>{unit}</Text>
                    </View>
                </View>
                <View style={styles?.mainItemQty}>
                    {index === 0 && <TableHeader label="Qty" styles={styles} />}
                    <View style={styles?.mainItemQtyBox}>
                        <Text>{qty}</Text>
                    </View>
                </View>
                <View style={styles?.mainItemRate}>
                    {index === 0 && (
                        <TableHeader label="Rate" styles={styles} />
                    )}
                    <View style={styles?.mainItemRateBox}>
                        <Text>{formatNumber(rate)}</Text>
                    </View>
                </View>
                <View style={styles?.mainItemDiscount}>
                    {index === 0 && (
                        <TableHeader label="Discount" styles={styles} />
                    )}
                    <View style={styles?.mainItemDiscountBox}>
                        <View style={styles?.mainItemDiscountAmount}>
                            <Text>{formatNumber(discount)}</Text>
                        </View>
                        <View style={styles?.mainItemDiscountType}>
                            <Text>{is_percentage_discount ? "%" : "$"}</Text>
                        </View>
                    </View>
                </View>

                {showTax && (
                    <View style={styles?.mainItemTax}>
                        {index === 0 && (
                            <TableHeader label="Tax" styles={styles} />
                        )}
                        <View style={styles?.mainItemTaxBox}>
                            <View style={styles?.mainItemTaxAmount}>
                                <Text>
                                    {tax_id === 1
                                        ? formatNumber(taxAmount)
                                        : tax_id === 2
                                        ? "0.00%"
                                        : "-"}
                                </Text>
                            </View>
                        </View>
                    </View>
                )}

                <View style={styles?.mainItemAmount}>
                    {index === 0 && (
                        <TableHeader label="Amount" styles={styles} />
                    )}
                    <View style={styles?.mainItemAmountBox}>
                        <Text>{formatNumber(amount)}</Text>
                    </View>
                </View>
            </View>

            {description && (
                <View style={styles?.mainItemDescription}>
                    <View style={styles?.mainItemDescriptionBox}>
                        <View style={styles?.mainItemDescriptionData}>
                            <Text>{description}</Text>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
};

export default LineItem;
