import "./DueAmountCard.css"

const DueAmountCard = ({ title, due_amount, currency_abv, linked_item1, linked_item2 }) => {
    return (
        <div className="dueAmount__container">
            <div className="dueAmount__main">
                {
                    title === "Tax Invoice" || title === "Bill" ?
                        <h3 className="dueAmount__main--head">Amount Due</h3>
                        : <h3 className="dueAmount__main--head">Balance Amount</h3>
                }
                <h2 className="dueAmount__main--amount">{currency_abv} {due_amount}</h2>
                {
                    title === "Tax Invoice" || title === "Bill" ?
                        <>
                            {
                                linked_item1?.length > 0 ?
                                    <div className="dueAmount--table">
                                        <div className="dueAmount--table-head">
                                            <div className="dueAmount--table-head1">
                                                {title === "Tax Invoice" ? "Receipt Id" : "Payment Id"}
                                            </div>
                                            <div className="dueAmount--table-head2">
                                                {title === "Tax Invoice" ? "Receipt Number" : "Payment Number"}
                                            </div>
                                            <div className="dueAmount--table-head3">
                                                {title === "Tax Invoice" ? "Amount" : "Amount"}
                                            </div>
                                        </div>
                                        <div className="dueAmount--table-body">
                                            {
                                                linked_item1?.length > 0 ? linked_item1?.map((receipt, index) => {
                                                    return (
                                                        <div key={index} className="dueAmount--table--data" >
                                                            <div className="dueAmount--table-head1">
                                                                {title === "Tax Invoice" ? receipt.receipt_id : receipt.payment_id}
                                                            </div>
                                                            <div className="dueAmount--table-head2">
                                                                {title === "Tax Invoice" ? receipt.receipt_number : receipt.payment_number}
                                                            </div>
                                                            <div className="dueAmount--table-head3">
                                                                {title === "Tax Invoice" ? receipt.amount : receipt.amount}
                                                            </div>
                                                        </div>
                                                    )
                                                }) :
                                                    <span className="dueAmount--table-noData">No Receipt</span>
                                            }
                                        </div>
                                    </div> : ""
                            }
                            {
                                linked_item2?.length > 0 ?
                                    <div className="dueAmount--table">
                                        <div className="dueAmount--table-head">
                                            <div className="dueAmount--table-head1">
                                                {title === "Tax Invoice" ? "Credit Note Id" : "Debit Note Id"}
                                            </div>
                                            <div className="dueAmount--table-head2">
                                                {title === "Tax Invoice" ? "Credit Note Number" : "Debit Note Number"}
                                            </div>
                                            <div className="dueAmount--table-head3">
                                                {title === "Tax Invoice" ? "Amount" : "Amount"}
                                            </div>
                                        </div>
                                        <div className="dueAmount--table-body">
                                            {
                                                linked_item2?.length > 0 ? linked_item2?.map((cn, index) => {
                                                    return (
                                                        <div key={index} className="dueAmount--table--data" >
                                                            <div className="dueAmount--table-head1">
                                                                {title === "Tax Invoice" ? cn.cn_id : cn.dn_id}
                                                            </div>
                                                            <div className="dueAmount--table-head2">
                                                                {title === "Tax Invoice" ? cn.cn_number : cn.dn_number}
                                                            </div>
                                                            <div className="dueAmount--table-head3">
                                                                {title === "Tax Invoice" ? cn.amount : cn.amount}
                                                            </div>
                                                        </div>
                                                    )
                                                }) :
                                                    <span className="dueAmount--table-noData">No Credit Notes</span>
                                            }
                                        </div>
                                    </div> : ""
                            }
                        </>
                        :
                        <>
                            {
                                linked_item1?.length > 0 ?
                                    <div className="dueAmount--table">
                                        <div className="dueAmount--table-head">
                                            <div className="dueAmount--table-head1">
                                                {title === "Credit Note" ? "Invoice Id" : "Bill Id"}
                                            </div>
                                            <div className="dueAmount--table-head2">
                                                {title === "Credit Note" ? "Invoice Number" : "Bill Number"}
                                            </div>
                                            <div className="dueAmount--table-head3">
                                                {title === "Credit Note" ? "Amount" : "Amount"}
                                            </div>
                                        </div>
                                        <div className="dueAmount--table-body">
                                            {
                                                linked_item1?.length > 0 ? linked_item1?.map((invoice, index) => {
                                                    return (
                                                        <div key={index} className="dueAmount--table--data" >
                                                            <div className="dueAmount--table-head1">
                                                                {title === "Credit Note" ? invoice.invoice_id : invoice.bill_id}
                                                            </div>
                                                            <div className="dueAmount--table-head2">
                                                                {title === "Credit Note" ? invoice.invoice_number : invoice.bill_number}
                                                            </div>
                                                            <div className="dueAmount--table-head3">
                                                                {title === "Credit Note" ? invoice.amount : invoice.amount}
                                                            </div>
                                                        </div>
                                                    )
                                                }) :
                                                    <span className="dueAmount--table-noData">No Receipt</span>
                                            }
                                        </div>
                                    </div>
                                    : ""
                            }
                        </>
                }
            </div>
        </div >
    )
}

export default DueAmountCard;
