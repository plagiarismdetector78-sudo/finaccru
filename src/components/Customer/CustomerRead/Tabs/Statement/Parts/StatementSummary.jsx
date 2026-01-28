import { View, Text } from "@react-pdf/renderer";
import moment from "moment";

const StatementSummary = ({
    styles,
    start_date,
    end_date,
    opening_balance,
    invoiced_amount,
    amount_received,
    credit_notes,
    balance_due,
}) => {
    return (
        <View style={styles.main}>
            <View style={styles.mainSummary}>
                <Text style={styles.summaryHeading}>Statement of Accounts</Text>
                <Text style={styles.summarySubHeading}>
                    From : {moment(start_date).format("DD-MM-YYYY")}
                </Text>
                <Text style={styles.summarySubHeading}>
                    To : {moment(end_date).format("DD-MM-YYYY")}
                </Text>
                <Text style={styles.summaryNewSubHeading}>
                    (Currency in AED)
                </Text>
            </View>
            <View style={styles.summaryInfo}>
                <View style={styles.summaryInfoBox}>
                    <Text style={styles.summaryInfoHead}>Opening Balance</Text>
                    <Text style={styles.summaryInfoData}>
                        {opening_balance}
                    </Text>
                </View>
                <Text style={styles.symbolStyle}> + </Text>
                <View style={styles.summaryInfoBox}>
                    <Text style={styles.summaryInfoHead}>Invoiced Amount</Text>
                    <Text style={styles.summaryInfoData}>
                        {invoiced_amount}
                    </Text>
                </View>
                <Text style={styles.symbolStyle}> - </Text>
                <View style={styles.summaryInfoBox}>
                    <Text style={styles.summaryInfoHead}>Payment Received</Text>
                    <Text style={styles.summaryInfoData}>
                        {amount_received}
                    </Text>
                </View>
                <Text style={styles.symbolStyle}> - </Text>
                <View style={styles.summaryInfoBox}>
                    <Text style={styles.summaryInfoHead}>Credit Notes</Text>
                    <Text style={styles.summaryInfoData}>{credit_notes}</Text>
                </View>
                <Text style={styles.symbolStyle}> = </Text>
                <View style={styles.summaryInfoBox}>
                    <Text style={styles.summaryInfoHead}>Balance Due</Text>
                    <Text style={styles.summaryInfoData}>{balance_due}</Text>
                </View>
            </View>
        </View>
    );
};

export default StatementSummary;
