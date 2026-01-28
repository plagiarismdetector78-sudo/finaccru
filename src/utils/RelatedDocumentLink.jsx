import { Link } from "react-router-dom";

const documentRoutes = {
    EST: "/estimate/view/",
    INV: "/tax-invoice/view/",
    PI: "/proforma/view/",
    // Add more if needed
};

export function renderRelatedDocumentCell(relatedDocId, relatedDocNumber) {
    if (!relatedDocId || !relatedDocNumber) {
        return <div className="text-start">-</div>;
    }

    const [prefix] = relatedDocNumber.split("-");
    const route = documentRoutes[prefix?.toUpperCase()];

    if (!route) {
        return <div className="text-start">{relatedDocNumber}</div>;
    }

    return (
        <div className="text-start">
            <Link
                to={`${route}${relatedDocId}`}
                className="text-blue-600 hover:underline"
            >
                {relatedDocNumber}
            </Link>
        </div>
    );
}
