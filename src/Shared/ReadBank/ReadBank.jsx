import { View, Text } from "@react-pdf/renderer";

const ReadBank = ({
    styles,
    currency_abv,
    primary_currency_abv,
    secondary_currency_abv,
    primary_bank,
    secondary_bank,
    subTotal,
    discount,
    tax,
    total,
    showBankDetails,
    showTax,
}) => {
    const filterSecondaryBankAccounts = Array.isArray(secondary_bank)
        ? secondary_bank.filter(
              (bank) => bank.currency_abv !== primary_bank?.currency_abv
          )
        : [];
    return (
        <View style={styles.main}>
            <Text style={styles.mainHeading}>
                {showBankDetails && "Bank Details"}
            </Text>
            <View style={styles.mainData}>
                {!showBankDetails ? null : (
                    <View style={styles.mainDataLeft}>
                        {/* Primary Bank */}
                        {primary_bank && (
                            <>
                                {secondary_bank && (
                                    <Text style={styles.sectionHeader}>
                                        Bank 1
                                    </Text>
                                )}
                                <View style={styles.mainDataLeftLeft}>
                                    <View style={styles.mainDataLeftLeftLeft}>
                                        <Text style={styles.bankText}>
                                            Bank Name
                                        </Text>
                                        <Text style={styles.bankText}>
                                            Account Number
                                        </Text>
                                        <Text style={styles.bankText}>
                                            Account Name
                                        </Text>
                                        <Text style={styles.bankText}>
                                            IBAN
                                        </Text>
                                        <Text style={styles.bankText}>
                                            Branch Name
                                        </Text>
                                        <Text style={styles.bankText}>
                                            SWIFT Code
                                        </Text>
                                        <Text style={styles.bankText}>
                                            Currency
                                        </Text>
                                    </View>
                                    <View style={styles.mainDataLeftLeftRight}>
                                        <Text style={styles.bankText}>
                                            {primary_bank?.bank_name}
                                        </Text>
                                        <Text style={styles.bankText}>
                                            {primary_bank?.account_number}
                                        </Text>
                                        <Text style={styles.bankText}>
                                            {primary_bank?.account_holder_name}
                                        </Text>
                                        <Text style={styles.bankText}>
                                            {primary_bank?.iban_number}
                                        </Text>
                                        <Text style={styles.bankText}>
                                            {primary_bank?.branch_name}
                                        </Text>
                                        <Text style={styles.bankText}>
                                            {primary_bank?.swift_code}
                                        </Text>
                                        <Text style={styles.bankText}>
                                            {primary_currency_abv}
                                        </Text>
                                    </View>
                                </View>
                            </>
                        )}

                        {/* Secondary Bank */}
                        {secondary_bank && (
                            <>
                                <Text style={styles.sectionHeader}>Bank 2</Text>
                                <View style={styles.mainDataLeftLeft}>
                                    <View style={styles.mainDataLeftLeftLeft}>
                                        <Text style={styles.bankText}>
                                            Bank Name
                                        </Text>
                                        <Text style={styles.bankText}>
                                            Account Number
                                        </Text>
                                        <Text style={styles.bankText}>
                                            Account Name
                                        </Text>
                                        <Text style={styles.bankText}>
                                            IBAN
                                        </Text>
                                        <Text style={styles.bankText}>
                                            Branch Name
                                        </Text>
                                        <Text style={styles.bankText}>
                                            SWIFT Code
                                        </Text>
                                        <Text style={styles.bankText}>
                                            Currency
                                        </Text>
                                    </View>
                                    <View style={styles.mainDataLeftLeftRight}>
                                        <Text style={styles.bankText}>
                                            {secondary_bank?.bank_name}
                                        </Text>
                                        <Text style={styles.bankText}>
                                            {secondary_bank?.account_number}
                                        </Text>
                                        <Text style={styles.bankText}>
                                            {
                                                secondary_bank?.account_holder_name
                                            }
                                        </Text>
                                        <Text style={styles.bankText}>
                                            {secondary_bank?.iban_number}
                                        </Text>
                                        <Text style={styles.bankText}>
                                            {secondary_bank?.branch_name}
                                        </Text>
                                        <Text style={styles.bankText}>
                                            {secondary_bank?.swift_code}
                                        </Text>
                                        <Text style={styles.bankText}>
                                            {secondary_currency_abv}
                                        </Text>
                                    </View>
                                </View>
                            </>
                        )}
                    </View>
                )}

                {/* Totals Section */}
                <View
                    style={
                        showBankDetails
                            ? styles.mainDataRight
                            : styles.mainDataNewRight
                    }
                >
                    <View style={styles.mainDataRightLeft}>
                        <Text style={styles.statsText}>Sub Total</Text>
                        <Text style={styles.statsText}>Discount</Text>
                        {showTax && <Text style={styles.statsText}>Tax</Text>}
                        <Text style={styles.statsText}>Total</Text>
                    </View>
                    <View style={styles.mainDataRightRight}>
                        <View style={styles.statsTextValue}>
                            <Text style={styles.statsCurrency}>
                                {currency_abv}
                            </Text>
                            <Text>
                                {new Intl.NumberFormat("en-US", {
                                    minimumFractionDigits: 2,
                                }).format(
                                    parseFloat((subTotal || 0).toFixed(2))
                                )}
                            </Text>
                        </View>
                        <View style={styles.statsTextValue}>
                            <Text style={styles.statsCurrency}>
                                {currency_abv}
                            </Text>
                            <Text>
                                {new Intl.NumberFormat("en-US", {
                                    minimumFractionDigits: 2,
                                }).format(
                                    parseFloat((discount || 0).toFixed(2))
                                )}
                            </Text>
                        </View>
                        {showTax && (
                            <View style={styles.statsTextValue}>
                                <Text style={styles.statsCurrency}>
                                    {currency_abv}
                                </Text>
                                <Text>
                                    {new Intl.NumberFormat("en-US", {
                                        minimumFractionDigits: 2,
                                    }).format(
                                        parseFloat((tax || 0).toFixed(2))
                                    )}
                                </Text>
                            </View>
                        )}
                        <View style={styles.statsTextValue}>
                            <Text style={styles.statsCurrency}>
                                {currency_abv}
                            </Text>
                            <Text>
                                {new Intl.NumberFormat("en-US", {
                                    minimumFractionDigits: 2,
                                }).format(parseFloat((total || 0).toFixed(2)))}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default ReadBank;
