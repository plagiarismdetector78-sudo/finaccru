import moment from "moment";

import { View, Text } from "@react-pdf/renderer";

const PaymentHead = ({
    styles,
    title,
    address_line_1,
    address_line_2,
    address_line_3,
    company_name,
    country,
    state,
    vat_trn,
    corporate_tax_trn,
    payment_number,
    payment_date,
}) => {
    return (
        <View style={styles.main}>
            <View style={styles.mainLeft}>
                {/* <Text style={styles.mainLeftHeading}>
                    {title} From
                </Text> */}
                {company_name && (
                    <Text style={styles.mainLeftCompany}>{company_name}</Text>
                )}
                {address_line_1 && <Text>{address_line_1}</Text>}
                {address_line_2 && <Text>{address_line_2}</Text>}
                {address_line_3 && <Text>{address_line_3}</Text>}

                {state && country && <Text>{state + ", " + country}</Text>}
                {vat_trn && <Text>VAT TRN: {vat_trn}</Text>}
                {corporate_tax_trn && (
                    <Text>Corporate Tax TRN: {corporate_tax_trn}</Text>
                )}
            </View>
            <View style={styles.mainRight}>
                <View style={styles.mainRightData}>
                    <Text>{title} Number</Text>
                    <Text>{title} Date</Text>
                </View>
                <View style={styles.mainRightData2}>
                    <Text>{payment_number}</Text>
                    <Text>{moment(payment_date).format("DD-MM-YYYY")}</Text>
                </View>
            </View>
        </View>
    );
};

export default PaymentHead;
