import ReadFrom from "../Shared/PurchaseModule/ReadFrom/ReadFrom";
import { pdfStyle as headPdfStyle } from "../Styles/PurchaseModule/ReadFrom";
import ReadFor from "../Shared/ReadFor/ReadFor";
import { pdfStyle as forPdfStyles } from "../Styles/ReadFor";
import ReadMeta from "../Shared/ReadMeta/ReadMeta";
import { pdfStyle as metaPdfStyles } from "../Styles/ReadMeta";
import LineItem from "../Shared/LineItem/LineItem";
import { pdfStyle as lineItemPdfStyles } from "../Styles/LineItem";
import ReadNote from "../Shared/PurchaseModule/ReadNotes/ReadNotes";
import { pdfStyle as bankPdfStyles } from "../Styles/PurchaseModule/ReadNotes";
import ReadTax from "../Shared/ReadTax/ReadTax";
import { pdfStyle as taxPdfStyles } from "../Styles/ReadTax";

export default function PurchaseReadContent(
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
    groupedItems
) {
    const contents = [
        {
            component: ReadFrom,
            height: 90,
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
                expected_delivery_date: mainData?.expected_delivery_date,
            },
        },
        {
            component: ReadFor,
            height: 90,
            props: {
                title: title,
                styles: forPdfStyles,
                vendor_name: mainData?.vendor?.vendor_name,
                billing_address_line_1:
                    mainData?.vendor?.billing_address_line_1,
                billing_address_line_2:
                    mainData?.vendor?.billing_address_line_2,
                billing_address_line_3:
                    mainData?.vendor?.billing_address_line_3,
                billing_state: mainData?.vendor?.billing_state,
                billing_country: mainData?.vendor?.billing_country,
                shipping_address_line_1:
                    mainData?.vendor?.shipping_address_line_1,
                shipping_address_line_2:
                    mainData?.vendor?.shipping_address_line_2,
                shipping_address_line_3:
                    mainData?.vendor?.shipping_address_line_3,
                shipping_state: mainData?.vendor?.shipping_state,
                shipping_country: mainData?.vendor?.shipping_country,
                trn: mainData?.vendor?.trn,
            },
        },
        {
            component: ReadMeta,
            height: 70,
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
                height: item.description ? 45 : 30,
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
                },
            };
        }),
        {
            component: ReadNote,
            height: 120,
            props: {
                styles: bankPdfStyles,
                notes: mainData?.notes,
                currency_abv: currencies?.find(
                    (currency) => currency.currency_id === mainData?.currency_id
                )?.currency_abv,
                subTotal: subTotal,
                discount: discount,
                tax: tax,
                total: total,
            },
        },
        {
            component: ReadTax,
            height: 120,
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
            },
        },
    ];

    if (title === "Purchase Order") {
        contents[0].props.number = mainData?.po_number;
        contents[0].props.date = mainData?.order_date;
    } else if (title === "Bill") {
        contents[0].props.number = mainData?.bill_number;
        contents[0].props.date = mainData?.bill_date;
    } else if (title === "Debit Note") {
        contents[0].props.number = mainData?.dn_number;
        contents[0].props.date = mainData?.dn_date;
    }

    return contents;
}
