import { View, Text } from "@react-pdf/renderer";

const PaymentFor = ({
    styles,
    title,
    currency_abv,
    customer_name,
    vendor_name,
    billing_address_line_1,
    billing_address_line_2,
    billing_address_line_3,
    billing_state,
    billing_country,
    trn,
    invoice_mappings,
    total_amount,
    amount_in_words,
}) => {
    return (
        <View style={styles.main}>
            <View style={styles.mainLeft}>
                <View style={styles.mainLeftHeading}>
                    <Text>Billing Address</Text>
                </View>
                <View style={styles.mainLeftData}>
                    <Text style={styles.mainLeftCustomer}>
                        {customer_name ? customer_name : vendor_name}
                    </Text>
                    <Text>{billing_address_line_1}</Text>
                    {billing_address_line_2 && (
                        <Text>{billing_address_line_2}</Text>
                    )}
                    {billing_address_line_3 && (
                        <Text>{billing_address_line_3}</Text>
                    )}
                    <Text>{billing_state + ", " + billing_country}</Text>
                    {trn && <Text>VAT TRN: {trn}</Text>}
                </View>
            </View>
            {invoice_mappings?.length > 0 ? (
                <View style={styles.mainMiddle}>
                    <View style={styles.mainMiddleHeading}>
                        <Text style={styles.textLeftAlign}>
                            {title === "Receipt" ? "Invoices" : "Bills"}
                        </Text>
                    </View>
                    <View style={styles.mainMiddleData}>
                        <View style={styles.mainMiddleDataHeading}>
                            <Text style={styles.mainMiddleDataHeadingtext}>
                                {title === "Receipt" ? "Invoice" : "Bill"}
                            </Text>
                            <Text style={styles.mainMiddleDataHeadingtext}>
                                Amount Received
                            </Text>
                        </View>
                        <View style={styles.mainMiddleDataValue}>
                            {invoice_mappings?.map((item, index) => (
                                <View
                                    key={index}
                                    style={styles.mainMiddleDataValueItem}
                                >
                                    <Text
                                        style={
                                            styles.mainMiddleDataValueItemtext
                                        }
                                    >
                                        {title === "Receipt"
                                            ? item.invoice_number
                                            : item.bill_number}
                                    </Text>
                                    <Text
                                        style={
                                            styles.mainMiddleDataValueItemtext
                                        }
                                    >
                                        {item.amount}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            ) : (
                <View style={styles.mainMiddle}></View>
            )}
            <View style={styles.mainRight}>
                <View style={styles.mainRightHeading1}>
                    <Text>Amount Received</Text>
                </View>
                <View style={styles.mainRightValue1}>
                    <Text>
                        {`${new Intl.NumberFormat("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }).format(Number(total_amount) || 0)} ${currency_abv}`}
                    </Text>
                </View>

                <View style={styles.mainRightHeading2}>
                    <Text>Amount Received (In Words)</Text>
                </View>
                <View style={styles.mainRightValue2}>
                    <Text>{amount_in_words}</Text>
                </View>
            </View>
        </View>
    );
};

export default PaymentFor;
