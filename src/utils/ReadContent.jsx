import ReadHead from "../Shared/ReadHead/ReadHead";
import { pdfStyle as headPdfStyle } from "../Styles/ReadHead";
import ReadFor from "../Shared/ReadFor/ReadFor";
import { pdfStyle as forPdfStyles } from "../Styles/ReadFor";
import ReadMeta from "../Shared/ReadMeta/ReadMeta";
import { pdfStyle as metaPdfStyles } from "../Styles/ReadMeta";
import LineItem from "../Shared/LineItem/LineItem";
import { pdfStyle as lineItemPdfStyles } from "../Styles/LineItem";
import ReadBank from "../Shared/ReadBank/ReadBank";
import { pdfStyle as bankPdfStyles } from "../Styles/ReadBank";
import ReadTax from "../Shared/ReadTax/ReadTax";
import { pdfStyle as taxPdfStyles } from "../Styles/ReadTax";

export default function ReadContent(
    showBankDetails,
    title,
    mainData,
    user,
    currencies,
    taxRates,
    itemTax,
    itemTotal,
    subTotal,
    discount,
    tax,
    total,
    groupedItems,
    showTax
) {
    const contents = [
        {
            component: ReadHead,
            // height: 90,
            props: {
                title: title,
                styles: headPdfStyle,
                address_line_1: user?.clientInfo?.company_data?.address_line_1,
                address_line_2: user?.clientInfo?.company_data?.address_line_2,
                address_line_3: user?.clientInfo?.company_data?.address_line_3,
                company_name: user?.clientInfo?.company_data?.company_name,
                country: user?.clientInfo?.company_data?.country,
                state: user?.clientInfo?.company_data?.state,
                vat_trn: user?.clientInfo?.company_data?.vat_trn,
                corporate_tax_trn:
                    user?.clientInfo?.company_data?.corporate_tax_trn,
                reference: mainData?.reference,
            },
        },
        {
            component: ReadFor,
            // height: 90,
            props: {
                title: title,
                styles: forPdfStyles,
                customer_name: mainData?.customer?.customer_name,
                billing_address_line_1:
                    mainData?.customer?.billing_address_line_1,
                billing_address_line_2:
                    mainData?.customer?.billing_address_line_2,
                billing_address_line_3:
                    mainData?.customer?.billing_address_line_3,
                billing_state: mainData?.customer?.billing_state,
                billing_country: mainData?.customer?.billing_country,

                shipping_address_line_1:
                    mainData?.customer?.shipping_address_details
                        ?.address_line_1,
                shipping_address_line_2:
                    mainData?.customer?.shipping_address_details
                        ?.address_line_2,
                shipping_address_line_3:
                    mainData?.customer?.shipping_address_details
                        ?.address_line_3,
                shipping_state:
                    mainData?.customer?.shipping_address_details?.state,
                shipping_country:
                    mainData?.customer?.shipping_address_details?.country,
                trn: mainData?.customer?.trn,
            },
        },
        {
            component: ReadMeta,
            // height: 70,
            props: {
                styles: metaPdfStyles,
                currency_abv: currencies?.find(
                    (currency) => currency.currency_id === mainData?.currency_id
                )?.currency_abv,
                currency_conversion_rate: mainData?.currency_conversion_rate,
                subject: mainData?.subject,
            },
        },
        ...(mainData?.line_items || []).map((item, index) => {
            const taxItem = taxRates?.find(
                (tax) => tax.tax_rate_id === item.tax_id
            );
            return {
                component: LineItem,
                height: item.description ? 65 : 50,
                props: {
                    styles: lineItemPdfStyles,
                    index: index,
                    item_name: item.item_name || "",
                    unit: item.unit || "",
                    qty: item.qty || "",
                    rate: item.rate || "",
                    discount: item.discount || "",
                    is_percentage_discount: item.is_percentage_discount || "",
                    tax_id: item.tax_id || "",
                    taxRateName: taxItem ? taxItem.tax_rate_name : "",
                    taxAmount: itemTax && itemTax[index],
                    amount: itemTotal && itemTotal[index],
                    description: item.description || "",
                    showTax: showTax,
                },
            };
        }),
        {
            component: ReadBank,
            height:
                (user?.clientInfo?.other_bank_accounts || []).length * 55 + 80,
            props: {
                showBankDetails: showBankDetails,
                styles: bankPdfStyles,
                primary_bank: mainData?.primary_bank_details,
                secondary_bank: mainData?.secondary_bank_details,
                currency_abv: currencies?.find(
                    (currency) => currency.currency_id === mainData?.currency_id
                )?.currency_abv,
                primary_currency_abv: currencies?.find(
                    (currency) =>
                        currency.currency_name ===
                        mainData?.primary_bank_details?.currency_name
                )?.currency_abv,
                secondary_currency_abv: currencies?.find(
                    (currency) =>
                        currency.currency_name ===
                        mainData?.primary_bank_details?.currency_name
                )?.currency_abv,
                subTotal: subTotal,
                discount: discount,
                tax: tax,
                total: total,
                showTax: showTax,
            },
        },
        {
            component: ReadTax,
            height: 200,
            props: {
                styles: taxPdfStyles,
                currency_abv: currencies?.find(
                    (currency) => currency.currency_id === mainData?.currency_id
                )?.currency_abv,
                currency_conversion_rate: mainData?.currency_conversion_rate,
                subTotal: subTotal,
                discount: discount,
                tax: tax,
                total: total,
                groupedItems: groupedItems,
                terms_and_conditions: mainData?.terms_and_conditions,
                showTax: showTax,
            },
        },
    ];

    if (title === "Tax Invoice") {
        contents[0].props.number = mainData?.ti_number;
        contents[0].props.date = mainData?.ti_date;
        contents[0].props.due_date = mainData?.due_date;
    } else if (title === "Proforma Invoice") {
        contents[0].props.number = mainData?.pi_number;
        contents[0].props.date = mainData?.pi_date;
        contents[0].props.due_date = mainData?.due_date;
        contents[0].props.title = "PI";
    } else if (title === "Estimate") {
        contents[0].props.number = mainData?.estimate_number;
        contents[0].props.date = mainData?.estimate_date;
        contents[0].props.valid_till = mainData?.valid_till;
    } else if (title === "Credit Note") {
        contents[0].props.number = mainData?.cn_number;
        contents[0].props.date = mainData?.cn_date;
        contents[0].props.due_date = mainData?.due_date;
    }

    return contents;
}
