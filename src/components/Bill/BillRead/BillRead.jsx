import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  getBillDetails,
  markBillVoid,
  submitBillForApproval,
  approveBill,
  getExtractedBillDetails,
} from "../../../Actions/Bill";
import { getCurrency, getTaxRate } from "../../../Actions/Onboarding";
import { readAccountantClient } from "../../../Actions/Accountant";

import Loader from "../../Loader/Loader";
import "../../../Styles/Read.css";
import backButton from "../../../assets/Icons/back.svg";

import DueAmountCard from "../../../Shared/DueAmountCard/DueAmountCard";
import PdfDownload from "../../../Shared/PdfDownload/PdfDownload";

// Read Parts
import ReadFrom from "../../../Shared/PurchaseModule/ReadFrom/ReadFrom";
import { styles as headStyles } from "../../../Styles/PurchaseModule/ReadFrom";
import ReadFor from "../../../Shared/ReadFor/ReadFor";
import { styles as forStyles } from "../../../Styles/ReadFor";
import ReadMeta from "../../../Shared/ReadMeta/ReadMeta";
import { styles as metaStyles } from "../../../Styles/ReadMeta";
import LineItem from "../../../Shared/LineItem/LineItem";
import { styles as lineItemStyles } from "../../../Styles/LineItem";
import ReadNotes from "../../../Shared/PurchaseModule/ReadNotes/ReadNotes";
import { styles as bankStyles } from "../../../Styles/PurchaseModule/ReadNotes";
import ReadTax from "../../../Shared/ReadTax/ReadTax";
import { styles as taxStyles } from "../../../Styles/ReadTax";

import calculateTotalAmounts from "../../../utils/calculateTotalAmounts";
import PurchaseReadContent from "../../../utils/PurchaseReadContent";
import ViewHeader from "../../../Shared/ViewHeader/ViewHeader";
import ViewFooter from "../../../Shared/ViewFooter/ViewFooter";
import { setChatDocument } from "../../../Actions/Chat";
import { Document, Page, pdfjs } from "react-pdf";
import { LoadingOutlined } from "@ant-design/icons";
// Set the worker URL for pdf.js
// Make sure the path is correct, and the PDF worker file is available at that location
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const BillRead = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.userReducer);
  const { client } = useSelector((state) => state.accountantReducer);
  const { loading, bill, extractedBill } = useSelector(
    (state) => state.billReducer
  );
  const { taxRates } = useSelector((state) => state.onboardingReducer);

  const bill_id =
    user?.localInfo?.role === 2
      ? window.location.pathname.split("/")[7]
      : user?.localInfo?.role === 1
      ? window.location.pathname.split("/")[5]
      : window.location.pathname.split("/")[3];
  const client_id =
    user?.localInfo?.role === 2
      ? window.location.pathname.split("/")[4]
      : user?.localInfo?.role === 1
      ? window.location.pathname.split("/")[2]
      : 0;
  const jr_id =
    user?.localInfo?.role === 2 ? window.location.pathname.split("/")[2] : 0;

  const [itemTotal, setItemTotal] = useState([]);
  const [itemTax, setItemTax] = useState([]);
  const [groupedItems, setGroupedItems] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);

  const { currencies } = useSelector((state) => state.onboardingReducer);

  const searchParams = new URLSearchParams(window.location.search);
  const extracted = searchParams.get("extracted");

  const finalBill = extracted ? extractedBill : bill;

  useEffect(() => {
    dispatch(getCurrency());
    dispatch(getTaxRate());
  }, [dispatch]);

  useEffect(() => {
    if (extracted) {
      dispatch(getExtractedBillDetails(bill_id, user?.localInfo?.role));
    } else {
      dispatch(getBillDetails(bill_id, user?.localInfo?.role));
    }
    if (user?.localInfo?.role) {
      dispatch(readAccountantClient(client_id));
    }
  }, [dispatch, bill_id, client_id, user?.localInfo?.role]);

  useEffect(() => {
    const amount = calculateTotalAmounts(
      finalBill?.line_items,
      setSubTotal,
      setDiscount,
      setTax,
      setTotal,
      setItemTax,
      taxRates
    );
    setItemTotal(amount);
  }, [finalBill, taxRates]);

  useEffect(() => {
    const groupedByTaxId = finalBill?.line_items?.reduce((acc, item, index) => {
      const existingGroup = acc.find((group) => group.tax_id === item.tax_id);
      if (existingGroup) {
        existingGroup.taxable_amount +=
          itemTotal?.at(index) - itemTax?.at(index);
        existingGroup.tax_amount += itemTax?.at(index);
        existingGroup.total_amount += itemTotal?.at(index);
      } else {
        const taxItem = taxRates?.find((tr) => tr.tax_rate_id === item.tax_id);
        acc.push({
          tax_id: item.tax_id,
          tax_rate_name: taxItem?.tax_rate_name,
          taxable_amount: itemTotal?.at(index) - itemTax?.at(index),
          tax_amount: itemTax?.at(index),
          total_amount: itemTotal?.at(index),
        });
      }
      return acc;
    }, []);

    setGroupedItems(groupedByTaxId);
  }, [itemTotal, itemTax, finalBill, taxRates]);

  useEffect(() => {
    dispatch(setChatDocument({ id: bill?.bill_id, number: bill?.bill_number }));
    return () => {
      dispatch({ type: "RemoveChatDocument" });
    };
  }, [dispatch, bill]);

  const [clientData, setClientData] = useState({});
  useEffect(() => {
    if (user?.localInfo?.role) {
      setClientData({ clientInfo: client });
    } else {
      setClientData(user);
    }
  }, [user, client]);
  const contents = PurchaseReadContent(
    "Bill",
    finalBill,
    clientData,
    currencies,
    taxRates,
    itemTax,
    itemTotal,
    subTotal,
    discount,
    tax,
    total,
    groupedItems
  );
  // PDF Logic
  const [pdfError, setPdfError] = useState(null);
  const [pdfPages, setPdfPages] = useState(null);
  const [pdfPage, setPdfPage] = useState(1);
  const [pdfScale, setPdfScale] = useState(1.5);
  const [pdfRotation, setPdfRotation] = useState(0);
  const onDocumentLoadSuccess = ({ numPages }) => {
    setPdfPages(numPages);
  };

  const onError = (error) => {
    setPdfError(error.message);
  };

  const onPageChange = (page) => {
    if (page < 1 || page > pdfPages) return;
    setPdfPage(page);
  };
  return (
    <>
      <div className="read__header">
        <div className="read__header--left">
          <img
            src={backButton}
            alt="back"
            className="read__header--back-btn"
            onClick={() =>
              navigate(
                `${
                  user?.localInfo?.role === 2
                    ? `/jr/${jr_id}/clients/${client_id}`
                    : user?.localInfo?.role === 1
                    ? `/clients/${client_id}`
                    : "/bill"
                }`
              )
            }
          />
          <h1 className="read__header--title">
            {user?.localInfo?.role ? "Go Back" : "Bills List"}
          </h1>
        </div>
        <div className="read__header--right">
          {user?.localInfo?.role === 1 || user?.localInfo?.role === 2 ? (
            <>
              <a
                className="read__header--btn1"
                onClick={() => {
                  navigate(
                    `${
                      user?.localInfo?.role === 2
                        ? `/jr/${jr_id}/clients/${client_id}`
                        : user?.localInfo?.role === 1
                        ? `/clients/${client_id}`
                        : ""
                    }/bill/edit/${extracted ? bill_id : finalBill?.bill_id}${
                      extracted ? "?extracted=true" : ""
                    }`
                  );
                }}
              >
                {" "}
                Edit{" "}
              </a>
              {extracted ? (
                ""
              ) : (
                <a
                  className="read__header--btn2"
                  onClick={() => {
                    dispatch(
                      approveBill(bill_id, user?.localInfo?.role, client_id)
                    );
                  }}
                >
                  {" "}
                  Approve{" "}
                </a>
              )}
            </>
          ) : finalBill?.bill_status === "Draft" ? (
            <>
              <a
                className="read__header--btn1"
                onClick={() => {
                  dispatch(submitBillForApproval(bill_id));
                }}
              >
                Submit for Approval
              </a>
              <a
                className="read__header--btn1"
                onClick={() => {
                  dispatch(markBillVoid(bill_id));
                }}
              >
                Mark as Void
              </a>
            </>
          ) : finalBill?.bill_status === "Pending Approval" ? (
            <a
              className="read__header--btn1"
              onClick={() => {
                dispatch(markBillVoid(bill_id));
              }}
            >
              Mark as Void
            </a>
          ) : (
            ""
          )}
          {user?.localInfo?.role ? (
            ""
          ) : finalBill?.bill_status === "Void" ? (
            ""
          ) : finalBill?.bill_status === "Approved" ? (
            ""
          ) : (
            <a
              className="read__header--btn1"
              onClick={() => {
                navigate(
                  `${
                    user?.localInfo?.role === 2
                      ? `/jr/${jr_id}/clients/${client_id}`
                      : user?.localInfo?.role === 1
                      ? `/clients/${client_id}`
                      : ""
                  }/bill/edit/${finalBill?.bill_id}`
                );
              }}
            >
              Edit
            </a>
          )}
          <PdfDownload
            contents={contents}
            heading={"Bill"}
            name={finalBill?.bill_number}
            logo={
              user?.localInfo?.role
                ? client?.company_logo_url
                : user?.clientInfo?.company_logo_url
            }
          />
        </div>
      </div>
      <div className="read__container">
        {loading ? (
          <Loader />
        ) : (
          <div className="read--main" id="read--main">
            <ViewHeader
              title={"Bill"}
              logo={
                user?.localInfo?.role
                  ? client?.company_logo_url
                  : user?.clientInfo?.company_logo_url
              }
            />
            <ReadFrom
              title={"Bill"}
              styles={headStyles}
              address_line_1={
                user?.localInfo?.role
                  ? client?.company_data?.address_line_1
                  : user?.clientInfo?.company_data?.address_line_1
              }
              address_line_2={
                user?.localInfo?.role
                  ? client?.company_data?.address_line_2
                  : user?.clientInfo?.company_data?.address_line_2
              }
              address_line_3={
                user?.localInfo?.role
                  ? client?.company_data?.address_line_3
                  : user?.clientInfo?.company_data?.address_line_3
              }
              company_name={
                user?.localInfo?.role
                  ? client?.company_data?.company_name
                  : user?.clientInfo?.company_data?.company_name
              }
              country={
                user?.localInfo?.role
                  ? client?.company_data?.country
                  : user?.clientInfo?.company_data?.country
              }
              state={
                user?.localInfo?.role
                  ? client?.company_data?.state
                  : user?.clientInfo?.company_data?.state
              }
              vat_trn={
                user?.localInfo?.role
                  ? client?.company_data?.vat_trn
                  : user?.clientInfo?.company_data?.vat_trn
              }
              corporate_tax_trn={
                user?.localInfo?.role
                  ? client?.company_data?.corporate_tax_trn
                  : user?.clientInfo?.company_data?.corporate_tax_trn
              }
              number={finalBill?.bill_number}
              date={finalBill?.bill_date}
              expected_delivery_date={finalBill?.expected_delivery_date}
            />
            <ReadFor
              title={"Bill"}
              styles={forStyles}
              vendor_name={finalBill?.vendor?.vendor_name}
              billing_address_line_1={finalBill?.vendor?.billing_address_line_1}
              billing_address_line_2={finalBill?.vendor?.billing_address_line_2}
              billing_address_line_3={finalBill?.vendor?.billing_address_line_3}
              billing_state={finalBill?.vendor?.billing_state}
              billing_country={finalBill?.vendor?.billing_country}
              shipping_address_line_1={
                finalBill?.vendor?.shipping_address_line_1
              }
              shipping_address_line_2={
                finalBill?.vendor?.shipping_address_line_2
              }
              shipping_address_line_3={
                finalBill?.vendor?.shipping_address_line_3
              }
              shipping_state={finalBill?.vendor?.shipping_state}
              shipping_country={finalBill?.vendor?.shipping_country}
              trn={finalBill?.vendor?.trn}
            />
            <ReadMeta
              styles={metaStyles}
              currency_abv={
                currencies?.find(
                  (currency) => currency.currency_id === finalBill?.currency_id
                )?.currency_abv
              }
              currency_conversion_rate={finalBill?.currency_conversion_rate}
              subject={finalBill?.subject}
            />
            <div className="read__items">
              {finalBill?.line_items?.map((item, index) => (
                <LineItem
                  styles={lineItemStyles}
                  key={index}
                  index={index}
                  item_name={item?.item_name}
                  unit={item?.unit}
                  qty={item?.qty}
                  rate={item?.rate}
                  discount={item?.discount}
                  is_percentage_discount={item?.is_percentage_discount}
                  tax_id={item?.tax_id}
                  taxRateName={
                    taxRates?.find((tax) => tax.tax_rate_id === item?.tax_id)
                      ?.tax_rate_name
                  }
                  taxAmount={itemTax && itemTax[index]}
                  amount={itemTotal && itemTotal[index]}
                  description={item?.description}
                />
              ))}
            </div>
            <ReadNotes
              styles={bankStyles}
              currency_abv={
                currencies?.find(
                  (currency) => currency.currency_id === finalBill?.currency_id
                )?.currency_abv
              }
              notes={finalBill?.notes}
              subTotal={subTotal}
              discount={discount}
              tax={tax}
              total={total}
            />
            <ReadTax
              styles={taxStyles}
              currency_abv={
                currencies?.find(
                  (currency) => currency.currency_id === finalBill?.currency_id
                )?.currency_abv
              }
              currency_conversion_rate={finalBill?.currency_conversion_rate}
              subTotal={subTotal}
              discount={discount}
              tax={tax}
              total={total}
              groupedItems={groupedItems}
              terms_and_conditions={finalBill?.terms_and_conditions}
            />
            <ViewFooter />
          </div>
        )}
      </div>
      <DueAmountCard
        title={"Bill"}
        due_amount={finalBill?.due_amount}
        currency_abv={
          currencies?.find(
            (currency) => currency.currency_id === finalBill?.currency_id
          )?.currency_abv
        }
        linked_item1={finalBill?.linked_payments}
        linked_item2={finalBill?.linked_debit_notes}
      />
      {extracted && (
        <div className="pdf__viewer-main">
          <div className="pdf__viewer">
            <Document
              file={extractedBill?.attachment_url.replace(
                extractedBill?.attachment_url.split("/").slice(0, 3).join("/"),
                ""
              )}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onError}
              loading={<LoadingOutlined />}
            >
              <Page
                pageNumber={pdfPage}
                scale={pdfScale}
                rotate={pdfRotation}
                renderAnnotationLayer={false}
                renderTextLayer={false}
              />
            </Document>
            {pdfError && <div className="pdf__viewer--error">{pdfError}</div>}
            {pdfError && (
              <a
                href={extractedBill?.attachment_url}
                target="_blank"
                rel="noreferrer"
                className="pdf__viewer--error"
              >
                Download
              </a>
            )}
          </div>
          {pdfPages && (
            <div className="pdf__viewer--controls">
              <button
                onClick={() => onPageChange(pdfPage - 1)}
                disabled={pdfPage === 1}
              >
                Previous
              </button>
              <span>
                {pdfPage} of {pdfPages}
              </span>
              <button
                onClick={() => onPageChange(pdfPage + 1)}
                disabled={pdfPage === pdfPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default BillRead;
