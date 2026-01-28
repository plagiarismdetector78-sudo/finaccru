import { View, Text } from '@react-pdf/renderer'

const StatementHead = ({ styles, user, vendor }) => {
    return (
        <View style={styles.main}>
            <View style={styles.mainLeft}>
                <View style={styles.mainLeftHeading}>
                    {/* <Text>To</Text> */}
                </View>
                <View style={styles.mainLeftData}>
                    <Text style={styles.mainLeftCustomer}>{vendor?.vendor_name}</Text>
                    <Text>{vendor?.billing_address_line_1}</Text>
                    {vendor?.billing_address_line_2 && <Text>{vendor?.billing_address_line_2}</Text>}
                    {vendor?.billing_address_line_3 && <Text>{vendor?.billing_address_line_3}</Text>}
                    <Text>{vendor?.billing_state + ', ' + vendor?.billing_country}</Text>
                    {vendor?.trn && <Text>TRN: {vendor?.trn}</Text>}
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
