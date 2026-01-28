import { View, Text } from '@react-pdf/renderer'

const ReadNotes = ({ styles, currency_abv, notes, subTotal, discount, tax, total }) => {
    return (
        <View style={styles.main}>
            <Text style={styles.mainHeading}>Note</Text>
            <View style={styles.mainData}>
                <View style={styles.mainDataLeft}>
                    <Text style={styles.notes}>{notes}</Text>
                </View>
                <View style={styles.mainDataRight}>
                    <View style={styles.mainDataRightLeft}>
                        <Text style={styles.statsText}>Sub Total</Text>
                        <Text style={styles.statsText}>Discount</Text>
                        <Text style={styles.statsText}>Tax</Text>
                        <Text style={styles.statsText}>Total</Text>
                    </View>
                    <View style={styles.mainDataRightRight}>
                        <Text style={styles.statsTextValue}>
                            <Text style={styles.statsCurrency}>{currency_abv}</Text> &nbsp;
                            {new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(parseFloat((subTotal || 0).toFixed(2)))}
                        </Text>
                        <Text style={styles.statsTextValue}>
                            <Text style={styles.statsCurrency}>{currency_abv}</Text> &nbsp;
                            {new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(parseFloat((discount || 0).toFixed(2)))}
                        </Text>
                        <Text style={styles.statsTextValue}>
                            <Text style={styles.statsCurrency}>{currency_abv}</Text> &nbsp;
                            {new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(parseFloat((tax || 0).toFixed(2)))}
                        </Text>
                        <Text style={styles.statsTextValue}>
                            <Text style={styles.statsCurrency}>{currency_abv}</Text> &nbsp;
                            {new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(parseFloat((total || 0).toFixed(2)))}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default ReadNotes;