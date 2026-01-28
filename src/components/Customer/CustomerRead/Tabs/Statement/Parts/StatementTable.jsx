import moment from "moment";
import { View, Text } from "@react-pdf/renderer";

const StatementTable = ({ styles, transactions }) => {
    return (
        <View style={styles.main}>
            <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderCellLeft}>Date</Text>
                <Text style={styles.tableHeaderCellLeft}>Type</Text>
                <Text style={styles.tableHeaderCellLeft}>Details</Text>
                <Text style={styles.tableHeaderCellRight}>Amount</Text>
                <Text style={styles.tableHeaderCellRight}>Payments</Text>
                <Text style={styles.tableHeaderCellRight}>Balance</Text>
            </View>
            <View style={styles.tableBody}>
                {transactions?.map((transaction, index) => (
                    <View key={index} style={styles.tableRow}>
                        <Text style={styles.tableRowCellLeft}>
                            {moment(transaction.date).format("DD-MM-YYYY")}
                        </Text>
                        <Text style={styles.tableRowCellLeft}>
                            {transaction.type}
                        </Text>
                        <Text style={styles.tableRowCellLeft}>
                            {transaction.details}
                        </Text>
                        <Text style={styles.tableRowCellRight}>
                            {transaction.amount}
                        </Text>
                        <Text style={styles.tableRowCellRight}>
                            {transaction.payments}
                        </Text>
                        <Text style={styles.tableRowCellRight}>
                            {transaction.balance}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

export default StatementTable;
