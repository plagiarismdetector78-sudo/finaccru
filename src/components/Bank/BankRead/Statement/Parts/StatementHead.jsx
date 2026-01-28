import { View, Text } from '@react-pdf/renderer'

const StatementHead = ({ styles, bank, user }) => {
    return (
        <View style={styles.main}>
            <View style={styles.mainLeft}>
                <View style={styles.mainLeftHeading}>
                    {/* <Text>To</Text> */}
                </View>
                <View style={styles.mainLeftData}>
                    <Text style={styles.mainLeftCustomer}>{bank?.bank_name}</Text>
                    <Text>{bank?.branch_name}</Text>
                    <Text>{"Holder: "}{bank?.account_holder_name}</Text>
                    <Text>{"Account: "}{bank?.account_number}</Text>
                    <Text>{"IBAN: "}{bank?.iban_number}</Text>
                </View>
            </View>
            <View style={styles.mainRight}>
                <View style={styles.mainRightData}>
                    <Text style={styles.mainLeftCustomer}>{user?.company_data?.company_name}</Text>
                    <Text>{user?.company_data?.address_line_1}</Text>
                    {user?.company_data?.address_line_2 && <Text>{user?.company_data?.address_line_2}</Text>}
                    {user?.company_data?.address_line_3 && <Text>{user?.company_data?.address_line_3}</Text>}
                    <Text>{user?.company_data?.state + ', ' + user?.company_data?.country}</Text>
                    {user?.company_data?.vat_trn && <Text>VAT TRN: {user?.company_data?.vat_trn}</Text>}
                </View>
            </View>
        </View>
    )
}

export default StatementHead;
