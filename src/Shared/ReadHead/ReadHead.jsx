import moment from "moment";
import { View, Text } from "@react-pdf/renderer";

const ReadHead = ({
    title,
    styles,
    address_line_1,
    address_line_2,
    address_line_3,
    company_name,
    country,
    state,
    vat_trn,
    corporate_tax_trn,
    number,
    date,
    valid_till,
    due_date,
    reference,
}) => {
    const hasMainRightData =
        number || date || due_date || valid_till || reference;

    return (
        <View style={styles.main}>
            <View style={styles.mainLeft}>
                {company_name && (
                    <Text style={styles.mainLeftCompany}>{company_name}</Text>
                )}
                {address_line_1 && <Text>{address_line_1}</Text>}
                {address_line_2 && <Text>{address_line_2}</Text>}
                {address_line_3 && <Text>{address_line_3}</Text>}
                {(state || country) && (
                    <Text>{[state, country].filter(Boolean).join(", ")}</Text>
                )}
                {vat_trn && <Text>VAT TRN: {vat_trn}</Text>}
                {corporate_tax_trn && (
                    <Text>Corporate Tax TRN: {corporate_tax_trn}</Text>
                )}
            </View>

            {hasMainRightData && (
                <View style={styles.mainRight}>
                    <View style={styles.mainRightData}>
                        {number && <Text>{title} Number</Text>}
                        {date && <Text>{title} Date</Text>}
                        {(due_date || valid_till) && (
                            <Text>{due_date ? "Due Date" : "Valid Till"}</Text>
                        )}
                        {reference && <Text>Reference</Text>}
                    </View>

                    <View style={styles.mainRightData2}>
                        {number && <Text>{number}</Text>}
                        {date && (
                            <Text>{moment(date).format("DD-MM-YYYY")}</Text>
                        )}
                        {(due_date || valid_till) && (
                            <Text>
                                {moment(due_date ?? valid_till).format(
                                    "DD-MM-YYYY"
                                )}
                            </Text>
                        )}
                        {reference && <Text>{reference}</Text>}
                    </View>
                </View>
            )}
        </View>
    );
};

export default ReadHead;
