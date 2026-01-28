import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PdfContent from "./PdfContent";
import Button from "../../components/common/Button";
import { Download } from "lucide-react";

const PdfDownload = ({ contents, heading, name, logo, templatePath }) => {
    return (
        <PDFDownloadLink
            document={
                <PdfContent
                    contents={contents}
                    heading={heading}
                    logo={logo}
                    templatePath={templatePath}
                />
            }
            fileName={`${name}.pdf`}
        >
            {({ loading, error }) => (
                <div className="">
                    <Button
                        icon={Download}
                        text={
                            loading
                                ? "Preparing PDF..."
                                : error
                                ? "Failed to Generate"
                                : "Download PDF"
                        }
                        disabled={loading || error}
                    />
                </div>
            )}
        </PDFDownloadLink>
    );
};

export default PdfDownload;
