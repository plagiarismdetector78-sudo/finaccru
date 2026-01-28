import { View, Text } from '@react-pdf/renderer'
import moment from 'moment';

const StatementSummary = ({ styles, start_date, end_date, opening_balance, additions, withdrawals, closing_balance }) => {
    return (
        <View style={styles.main}>
            <View style={styles.mainSummary}>
                <Text style={styles.summaryHeading}>Statement Summary</Text>
                <Text style={styles.summarySubHeading}>From {moment(start_date).format('LL')}</Text>
                <Text style={styles.summarySubHeading}>To {moment(end_date).format('LL')}</Text>
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
                    <Text style={styles.summaryInfoHead}>Additions</Text>
                    <Text style={styles.summaryInfoData}>
                        {new Intl.NumberFormat('en-US', {
                        }).format(parseFloat(additions).toFixed(2))}
                    </Text>
                </View>
                <View style={styles.summarySymbol}>
                    <Text style={styles.symbolStyle}> - </Text>
                </View>
                <View style={styles.summaryInfoBox}>
                    <Text style={styles.summaryInfoHead}>Withdrawals</Text>
                    <Text style={styles.summaryInfoData}>
                    {new Intl.NumberFormat('en-US', {
                        }).format(parseFloat(withdrawals).toFixed(2))}
                    </Text>
                </View>
                <View style={styles.summarySymbol}>
                    <Text style={styles.symbolStyle}> = </Text>
                </View>
                <View style={styles.summaryInfoBox}>
                    <Text style={styles.summaryInfoHead}>Closing Balance</Text>
                    <Text style={styles.summaryInfoData}>
                    {new Intl.NumberFormat('en-US', {
                        }).format(parseFloat(closing_balance).toFixed(2))}
                    </Text>
                </View>
            </View>
        </View>
    )
}

export default StatementSummary;
