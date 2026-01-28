import { View, Text } from "@react-pdf/renderer";

const ReadMeta = ({
    styles,
    currency_abv,
    currency_conversion_rate,
    subject,
}) => {
    const main1Style = subject
        ? styles.main1
        : {
              ...styles.main1,
              // paddingBottom: "2rem"
          };
    return (
        <View style={styles.main}>
            <View style={main1Style}>
                <View style={styles.main1Heading}>
                    <Text>Currency</Text>
                </View>
                <View style={styles.main1Data}>
                    <Text>1</Text>
                    <Text>{currency_abv} =</Text>
                    <Text>{currency_conversion_rate}</Text>
                    <Text>AED</Text>
                </View>
            </View>
            {subject && (
                <View style={styles.main2}>
                    <View style={styles.main2Heading}>
                        <Text>Subject</Text>
                    </View>
                    <View style={styles.main2Data}>
                        <Text>{subject}</Text>
                    </View>
                </View>
            )}
        </View>
    );
};

export default ReadMeta;
