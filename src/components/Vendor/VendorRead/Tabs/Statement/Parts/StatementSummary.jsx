import { View, Text } from '@react-pdf/renderer'
import moment from 'moment';

const StatementSummary = ({ styles, start_date, end_date, amount_received, balance_due, bill_amount, debit_notes, opening_balance }) => {
    return (
        <View style={styles.main}>
            <View style={styles.mainSummary}>
                <Text style={styles.summaryHeading}>Statement Summary</Text>
                <Text style={styles.summarySubHeading}>From {moment(start_date).format('DD-MM-YYYY')}</Text>
                <Text style={styles.summarySubHeading}>To {moment(end_date).format('DD-MM-YYYY')}</Text>
                <Text style={styles.summaryNewSubHeading}>(Currency in AED)</Text>
            </View>
            <View style={styles.summaryInfo}>
                <View style={styles.summaryInfoBox}>
                    <Text style={styles.summaryInfoHead}>Opening Balance</Text>
                    <Text style={styles.summaryInfoData}>
                        {new Intl.NumberFormat('en-US', {
                        }).format(parseFloat(opening_balance).toFixed(2))}
                    </Text>
                </View>
                <View style={styles.summarySymbol}>
                    <Text style={styles.symbolStyle}> + </Text>
                </View>
                <View style={styles.summaryInfoBox}>
                    <Text style={styles.summaryInfoHead}>Bill Amount</Text>
                    <Text style={styles.summaryInfoData}>
                        {new Intl.NumberFormat('en-US', {
                        }).format(parseFloat(bill_amount).toFixed(2))}
                    </Text>
                </View>
                <View style={styles.summarySymbol}>
                    <Text style={styles.symbolStyle}> - </Text>
                </View>
                <View style={styles.summaryInfoBox}>
                    <Text style={styles.summaryInfoHead}>Amount Received</Text>
                    <Text style={styles.summaryInfoData}>
                    {new Intl.NumberFormat('en-US', {
                        }).format(parseFloat(amount_received).toFixed(2))}
                    </Text>
                </View>
                <View style={styles.summarySymbol}>
                    <Text style={styles.symbolStyle}> - </Text>
                </View>
                <View style={styles.summaryInfoBox}>
                    <Text style={styles.summaryInfoHead}>Debit Notes</Text>
                    <Text style={styles.summaryInfoData}>
                    {new Intl.NumberFormat('en-US', {
                        }).format(parseFloat(debit_notes).toFixed(2))}
                    </Text>
                </View>
                <View style={styles.summarySymbol}>
                    <Text style={styles.symbolStyle}> = </Text>
                </View>
                <View style={styles.summaryInfoBox}>
                    <Text style={styles.summaryInfoHead}>Balance Due</Text>
                    <Text style={styles.summaryInfoData}>
                    {new Intl.NumberFormat('en-US', {
                        }).format(parseFloat(balance_due).toFixed(2))}
                    </Text>
                </View>
            </View>
        </View>
    )
}

export default StatementSummary;
