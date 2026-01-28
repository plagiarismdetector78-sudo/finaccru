// import {
//     Document,
//     Page,
//     Text,
//     View,
//     StyleSheet,
//     Image,
//     Font,
// } from "@react-pdf/renderer";
// import WorkSans from "../../assets/fonts/WorkSans.ttf";
// import WorkSansBold from "../../assets/fonts/WorkSansBold.ttf";
// import WorkSansExtraBold from "../../assets/fonts/WorkSansExtraBold.ttf";

// const styles = StyleSheet.create({
//     page: {
//         flexDirection: "column",
//         fontFamily: "Work Sans",
//         position: "relative",
//         paddingBottom: "25px",
//     },
//     fixedHeader: {
//         height: 100,
//         width: "100%",
//         border: "1px solid red",
//     },
//     header: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//         padding: "0 40px",
//         border: "1px solid black",
//     },
//     header__image: {
//         display: "flex",
//         alignItems: "center",
//     },
//     header__text: {
//         fontWeight: "bold",
//         fontSize: "26px",
//     },
//     section: {
//         marginBottom: 10,
//     },
//     footer: {
//         position: "absolute",
//         bottom: 0,
//         left: 0,
//         right: 0,
//         textAlign: "center",
//         backgroundColor: "#f3f4f6",
//         flexDirection: "row",
//         alignItems: "center",
//         height: "35px",
//         padding: "0 40px",
//     },
//     footer__text: {
//         width: "80%",
//         justifyContent: "center",
//         alignItems: "center",
//         marginRight: "55px",
//         textTransform: "capitalize",
//     },
//     footer__text_1: {
//         fontWeight: "normal",
//         fontSize: "8px",
//         paddingTop: "3px",
//         textTransform: "capitalize",
//     },
//     footer__text_2: {
//         fontWeight: "bold",
//         paddingTop: "4px",
//         fontSize: "8px",
//         textTransform: "capitalize",
//     },
//     footer__image: {
//         width: "20%",
//         justifyContent: "center",
//         alignItems: "center",
//     },
// });

// Font.register({
//     family: "Work Sans",
//     fonts: [
//         {
//             src: WorkSans,
//             fontWeight: "normal",
//         },
//         {
//             src: WorkSansBold,
//             fontWeight: "bold",
//         },
//         {
//             src: WorkSansExtraBold,
//             fontWeight: "extraBold",
//         },
//     ],
// });

// const PdfContent = ({ contents, heading, logo, templatePath }) => {
//     const footerHeight = 25;
//     const headerHeight = 110;
//     const pageHeight = 870;
//     const contentPerPage = pageHeight - headerHeight - footerHeight;

//     const pages = [];

//     let currentPage = [];
//     let currentHeight = 0;

//     contents?.forEach((section) => {
//         const sectionHeight = section.height;

//         if (currentHeight + sectionHeight > contentPerPage) {
//             pages.push(currentPage);
//             currentPage = [];
//             currentHeight = 0;
//         }

//         currentPage.push(section);
//         currentHeight += sectionHeight;
//     });

//     if (currentPage.length > 0) {
//         pages.push(currentPage);
//     }

//     return (
//         <Document>
//             {pages.map((pageContent, index) => (
//                 <Page key={index} size="A4" style={styles.page}>
//                     <View style={styles.fixedHeader}>
//                         <Image
//                             style={{
//                                 width: "100%",
//                                 height: "100%",
//                                 border: "1px solid black",
//                             }}
//                             src={`/assets/images/pdf-templates/${templatePath}/Top-New.png`}
//                         />
//                     </View>
//                     <View style={styles.header}>
//                         <View style={styles.header__image}>
//                             <Image
//                                 style={{
//                                     height: "60px",
//                                     maxWidth: "120px",
//                                     maxHeight: "60px",
//                                     border: "1px solid black",
//                                 }}
//                                 src={logo}
//                                 alt="logo"
//                             />
//                         </View>
//                         <View style={styles.header__text}>
//                             <Text>{heading}</Text>
//                         </View>
//                     </View>

//                     {pageContent.map((section, i) => {
//                         const Component = section.component;
//                         const props = section.props;

//                         console.log("Component: ", Component);
//                         console.log("Props: ", props);

//                         return <Component key={i} {...props} />;
//                     })}

//                     <View style={styles.footer}>
//                         <View style={styles.footer__image}>
//                             <Image
//                                 style={{ width: "40px" }}
//                                 src={"/assets/images/Logo.svg"}
//                                 alt="Finaccru Branding"
//                             />
//                         </View>
//                         <View style={styles.footer__text}>
//                             <Text style={styles.footer__text_1}>
//                                 This is an electronically generated document and
//                                 does not require a sign or stamp.
//                             </Text>
//                             <Text style={styles.footer__text_2}>
//                                 powered by Finaccru
//                             </Text>
//                         </View>
//                     </View>
//                 </Page>
//             ))}
//         </Document>
//     );
// };

// export default PdfContent;

// New 1 (Fixed Header and Footer)
// import {
//     Document,
//     Page,
//     Text,
//     View,
//     StyleSheet,
//     Image,
//     Font,
// } from "@react-pdf/renderer";
// import WorkSans from "../../assets/fonts/WorkSans.ttf";
// import WorkSansBold from "../../assets/fonts/WorkSansBold.ttf";
// import WorkSansExtraBold from "../../assets/fonts/WorkSansExtraBold.ttf";

// const styles = StyleSheet.create({
//     page: {
//         flexDirection: "column",
//         fontFamily: "Work Sans",
//         position: "relative",
//         paddingBottom: "25px",
//     },
//     fixedHeader: {
//         position: "absolute",
//         top: 0,
//         left: 0,
//         right: 0,
//         height: 100,
//         width: "100%",
//     },
//     header: {
//         position: "absolute",
//         top: 100,
//         left: 0,
//         right: 0,
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//         padding: "0 40px",
//         height: 80,
//     },
//     header__image: {
//         display: "flex",
//         alignItems: "center",
//     },
//     header__text: {
//         fontWeight: "bold",
//         fontSize: "26px",
//     },
//     content: {
//         border: "5px solid red",
//         marginTop: 180, // Space for the header (100 + 80)
//         // paddingHorizontal: 40,
//         // paddingBottom: 35, // Space for footer
//     },
//     section: {
//         marginBottom: 10,
//     },
//     footer: {
//         position: "absolute",
//         bottom: 0,
//         left: 0,
//         right: 0,
//         textAlign: "center",
//         backgroundColor: "#f3f4f6",
//         flexDirection: "row",
//         alignItems: "center",
//         height: "35px",
//         padding: "0 40px",
//     },
//     footer__text: {
//         width: "80%",
//         justifyContent: "center",
//         alignItems: "center",
//         marginRight: "55px",
//         textTransform: "capitalize",
//     },
//     footer__text_1: {
//         fontWeight: "normal",
//         fontSize: "8px",
//         paddingTop: "3px",
//         textTransform: "capitalize",
//     },
//     footer__text_2: {
//         fontWeight: "bold",
//         paddingTop: "4px",
//         fontSize: "8px",
//         textTransform: "capitalize",
//     },
//     footer__image: {
//         width: "20%",
//         justifyContent: "center",
//         alignItems: "center",
//     },
// });

// Font.register({
//     family: "Work Sans",
//     fonts: [
//         {
//             src: WorkSans,
//             fontWeight: "normal",
//         },
//         {
//             src: WorkSansBold,
//             fontWeight: "bold",
//         },
//         {
//             src: WorkSansExtraBold,
//             fontWeight: "extraBold",
//         },
//     ],
// });

// const PdfContent = ({ contents, heading, logo, templatePath }) => {
//     const footerHeight = 35;
//     const headerHeight = 180; // 100 for fixedHeader + 80 for header
//     const pageHeight = 842; // A4 height in points
//     const contentPerPage = pageHeight - headerHeight - footerHeight;

//     const pages = [];

//     let currentPage = [];
//     let currentHeight = 0;

//     contents?.forEach((section) => {
//         const sectionHeight = section.height;

//         if (currentHeight + sectionHeight > contentPerPage) {
//             pages.push(currentPage);
//             currentPage = [];
//             currentHeight = 0;
//         }

//         currentPage.push(section);
//         currentHeight += sectionHeight;
//     });

//     if (currentPage.length > 0) {
//         pages.push(currentPage);
//     }

//     const renderHeaderFooter = () => (
//         <>
//             {/* Fixed Header Image */}
//             <View style={styles.fixedHeader} fixed>
//                 <Image
//                     style={{
//                         width: "100%",
//                         height: "100%",
//                     }}
//                     src={`/assets/images/pdf-templates/${templatePath}/Top-New.png`}
//                 />
//             </View>

//             {/* Header with Logo and Text */}
//             <View style={styles.header} fixed>
//                 <View style={styles.header__image}>
//                     <Image
//                         style={{
//                             height: "60px",
//                             maxWidth: "120px",
//                             maxHeight: "60px",
//                         }}
//                         src={logo}
//                         alt="logo"
//                     />
//                 </View>
//                 <View style={styles.header__text}>
//                     <Text>{heading}</Text>
//                 </View>
//             </View>

//             {/* Footer */}
//             <View style={styles.footer} fixed>
//                 <View style={styles.footer__image}>
//                     <Image
//                         style={{ width: "40px" }}
//                         src={"/assets/images/Logo.svg"}
//                         alt="Finaccru Branding"
//                     />
//                 </View>
//                 <View style={styles.footer__text}>
//                     <Text style={styles.footer__text_1}>
//                         This is an electronically generated document and does
//                         not require a sign or stamp.
//                     </Text>
//                     <Text style={styles.footer__text_2}>
//                         powered by Finaccru
//                     </Text>
//                 </View>
//             </View>
//         </>
//     );

//     return (
//         <Document>
//             {pages.map((pageContent, index) => (
//                 <Page key={index} size="A4" style={styles.page}>
//                     {renderHeaderFooter()}

//                     <View style={styles.content}>
//                         {pageContent.map((section, i) => {
//                             const Component = section.component;
//                             const props = section.props;

//                             return <Component key={i} {...props} />;
//                         })}
//                     </View>
//                 </Page>
//             ))}
//         </Document>
//     );
// };

// export default PdfContent;

// New 2 (Header & Footer Alignment Issue Fix)
// import {
//     Document,
//     Page,
//     Text,
//     View,
//     StyleSheet,
//     Image,
//     Font,
// } from "@react-pdf/renderer";
// import WorkSans from "../../assets/fonts/WorkSans.ttf";
// import WorkSansBold from "../../assets/fonts/WorkSansBold.ttf";
// import WorkSansExtraBold from "../../assets/fonts/WorkSansExtraBold.ttf";

// const styles = StyleSheet.create({
//     page: {
//         flexDirection: "column",
//         fontFamily: "Work Sans",
//         position: "relative",
//         paddingBottom: "25px",
//     },
//     fixedHeader: {
//         position: "absolute",
//         top: 0,
//         left: 0,
//         right: 0,
//         height: 100,
//         width: "100%",
//     },
//     header: {
//         position: "absolute",
//         top: 100,
//         left: 0,
//         right: 0,
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//         padding: "0 40px",
//         // height: 80,
//         border: "1px solid black",
//     },
//     header__image: {
//         display: "flex",
//         alignItems: "center",
//     },
//     header__text: {
//         fontWeight: "bold",
//         fontSize: "26px",
//     },
//     contentFirstPage: {
//         border: "1px solid red",
//         marginTop: 150, // Space for the header (100 + 80)
//     },
//     contentOtherPages: {
//         border: "`px solid red",
//         marginTop: 100, // Space only for the fixed header background
//     },
//     section: {
//         marginBottom: 10,
//     },
//     footer: {
//         position: "absolute",
//         bottom: 0,
//         left: 0,
//         right: 0,
//         textAlign: "center",
//         backgroundColor: "#f3f4f6",
//         flexDirection: "row",
//         alignItems: "center",
//         height: "35px",
//         padding: "0 40px",
//     },
//     footer__text: {
//         width: "80%",
//         justifyContent: "center",
//         alignItems: "center",
//         marginRight: "55px",
//         textTransform: "capitalize",
//     },
//     footer__text_1: {
//         fontWeight: "normal",
//         fontSize: "8px",
//         paddingTop: "3px",
//         textTransform: "capitalize",
//     },
//     footer__text_2: {
//         fontWeight: "bold",
//         paddingTop: "4px",
//         fontSize: "8px",
//         textTransform: "capitalize",
//     },
//     footer__image: {
//         width: "20%",
//         justifyContent: "center",
//         alignItems: "center",
//     },
// });

// Font.register({
//     family: "Work Sans",
//     fonts: [
//         {
//             src: WorkSans,
//             fontWeight: "normal",
//         },
//         {
//             src: WorkSansBold,
//             fontWeight: "bold",
//         },
//         {
//             src: WorkSansExtraBold,
//             fontWeight: "extraBold",
//         },
//     ],
// });

// const PdfContent = ({ contents, heading, logo, templatePath }) => {
//     // Different heights for first page vs other pages
//     const footerHeight = 35;
//     const firstPageHeaderHeight = 180; // 100 for fixedHeader + 80 for logo/heading
//     const otherPagesHeaderHeight = 100; // Just the fixed header background
//     const pageHeight = 842; // A4 height in points

//     // Calculate content space available for first and other pages
//     const contentPerFirstPage =
//         pageHeight - firstPageHeaderHeight - footerHeight;
//     const contentPerOtherPage =
//         pageHeight - otherPagesHeaderHeight - footerHeight;

//     const pages = [];

//     let currentPage = [];
//     let currentHeight = 0;
//     let isFirstPage = true;

//     contents?.forEach((section) => {
//         const sectionHeight = section.height;
//         const availableHeight = isFirstPage
//             ? contentPerFirstPage
//             : contentPerOtherPage;

//         if (currentHeight + sectionHeight > availableHeight) {
//             pages.push({ content: currentPage, isFirstPage });
//             currentPage = [];
//             currentHeight = 0;
//             isFirstPage = false;
//         }

//         currentPage.push(section);
//         currentHeight += sectionHeight;
//     });

//     if (currentPage.length > 0) {
//         pages.push({ content: currentPage, isFirstPage });
//     }

//     // Fixed header image and footer appear on all pages
//     const renderFixedElements = (isFirstPage) => (
//         <>
//             {/* Fixed Header Image */}
//             <View style={styles.fixedHeader} fixed>
//                 <Image
//                     style={{
//                         width: "100%",
//                         height: "100%",
//                     }}
//                     src={`/assets/images/pdf-templates/${templatePath}/Top-New.png`}
//                 />
//             </View>

//             {/* Footer */}
//             <View style={styles.footer} fixed>
//                 <View style={styles.footer__image}>
//                     <Image
//                         style={{ width: "40px" }}
//                         src={"/assets/images/Logo.svg"}
//                         alt="Finaccru Branding"
//                     />
//                 </View>
//                 <View style={styles.footer__text}>
//                     <Text style={styles.footer__text_1}>
//                         This is an electronically generated document and does
//                         not require a sign or stamp.
//                     </Text>
//                     <Text style={styles.footer__text_2}>
//                         powered by Finaccru
//                     </Text>
//                 </View>
//             </View>
//         </>
//     );

//     return (
//         <Document>
//             {pages.map((page, index) => (
//                 <Page key={index} size="A4" style={styles.page}>
//                     {/* Fixed elements on all pages */}
//                     {renderFixedElements()}

//                     {/* Header with Logo and Text - only on first page */}
//                     {page.isFirstPage && (
//                         <View style={styles.header}>
//                             <View style={styles.header__image}>
//                                 <Image
//                                     style={{
//                                         height: "60px",
//                                         maxWidth: "120px",
//                                         maxHeight: "60px",
//                                     }}
//                                     src={logo}
//                                     alt="logo"
//                                 />
//                             </View>
//                             <View style={styles.header__text}>
//                                 <Text>{heading}</Text>
//                             </View>
//                         </View>
//                     )}

//                     {/* Content with different top margins based on page type */}
//                     <View
//                         style={
//                             page.isFirstPage
//                                 ? styles.contentFirstPage
//                                 : styles.contentOtherPages
//                         }
//                     >
//                         {page.content.map((section, i) => {
//                             const Component = section.component;
//                             const props = section.props;

//                             return <Component key={i} {...props} />;
//                         })}
//                     </View>
//                 </Page>
//             ))}
//         </Document>
//     );
// };

// export default PdfContent;

// New 4 (Trying to fix Overlapping of Content over Header and Footer)
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
    Font,
} from "@react-pdf/renderer";
import WorkSans from "../../assets/fonts/WorkSans.ttf";
import WorkSansBold from "../../assets/fonts/WorkSansBold.ttf";
import WorkSansExtraBold from "../../assets/fonts/WorkSansExtraBold.ttf";

const styles = StyleSheet.create({
    page: {
        flexDirection: "column",
        fontFamily: "Work Sans",
        position: "relative",
        padding: "100px 0 35px 0", // Top/bottom padding for header/footer space
    },
    fixedHeader: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 100,
        width: "100%",
    },
    logoHeader: {
        position: "absolute",
        top: 100,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 40px",
        // height: 80,
    },
    header__image: {
        display: "flex",
        alignItems: "center",
    },
    header__text: {
        fontWeight: "bold",
        fontSize: "26px",
    },
    contentContainer: {
        flexGrow: 1,
        marginTop: 60, // Only on first page to accommodate logo header
        // marginHorizontal: 40,
    },
    contentContainerOtherPages: {
        flexGrow: 1,
        // marginHorizontal: 40,
    },
    section: {
        // marginBottom: 10,
    },
    footer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        textAlign: "center",
        backgroundColor: "#f3f4f6",
        flexDirection: "row",
        alignItems: "center",
        height: 35,
        padding: "0 40px",
    },
    footer__text: {
        width: "80%",
        justifyContent: "center",
        alignItems: "center",
        marginRight: "55px",
    },
    footer__text_1: {
        fontWeight: "normal",
        fontSize: "8px",
        paddingTop: "3px",
    },
    footer__text_2: {
        fontWeight: "bold",
        paddingTop: "4px",
        fontSize: "8px",
        textTransform: "capitalize",
    },
    footer__image: {
        width: "20%",
        justifyContent: "center",
        alignItems: "center",
    },
    footer__pageNumber: {
        fontSize: 8,
        marginLeft: "auto",
    },
});

Font.register({
    family: "Work Sans",
    fonts: [
        {
            src: WorkSans,
            fontWeight: "normal",
        },
        {
            src: WorkSansBold,
            fontWeight: "bold",
        },
        {
            src: WorkSansExtraBold,
            fontWeight: "extraBold",
        },
    ],
});

const PdfContent = ({ contents, heading, logo, templatePath }) => {
    // Fixed elements that will appear on every page
    const FixedHeader = () => (
        <View style={styles.fixedHeader} fixed>
            <Image
                style={{
                    width: "100%",
                    height: "100%",
                }}
                src={`/assets/images/pdf-templates/${templatePath}/Top-New.png`}
            />
        </View>
    );

    const Footer = () => (
        <View style={styles.footer} fixed>
            <View style={styles.footer__image}>
                <Image
                    style={{ width: "40px" }}
                    src={"/assets/images/logo_with_name.png"}
                    alt="Finaccru Branding"
                />
            </View>
            <View style={styles.footer__text}>
                <Text style={styles.footer__text_1}>
                    This is an electronically generated document and does not
                    require a sign or stamp.
                </Text>
                <Text style={styles.footer__text_2}>powered by Finaccru</Text>
            </View>
            <Text
                style={styles.footer__pageNumber}
                render={({ pageNumber, totalPages }) =>
                    `Page ${pageNumber} of ${totalPages}`
                }
            />
        </View>
    );

    return (
        <Document>
            {/* First page with logo header */}
            <Page
                size="A4"
                style={{
                    ...styles.page,
                    padding:
                        templatePath === "template-3"
                            ? "10px 0 35px 0"
                            : styles.page.padding,
                }}
            >
                <FixedHeader />
                <Footer />

                {/* Logo header only on first page */}
                <View
                    style={{
                        ...styles.logoHeader,
                        top:
                            templatePath === "template-3"
                                ? "20"
                                : styles.logoHeader.top,
                    }}
                >
                    <View style={styles.header__image}>
                        {logo && (
                            <Image
                                style={{
                                    height: "50px",
                                    maxWidth: "100px",
                                    maxHeight: "50px",
                                }}
                                src={logo}
                                alt="logo"
                            />
                        )}
                    </View>
                    <View style={styles.header__text}>
                        <Text>{heading}</Text>
                    </View>
                </View>

                {/* Content container with break */}
                <View style={styles.contentContainer} break={false}>
                    {contents.map((section, i) => {
                        const Component = section.component;
                        const props = section.props;
                        return (
                            <View key={i} style={styles.section} wrap>
                                <Component {...props} />
                            </View>
                        );
                    })}
                </View>
            </Page>
        </Document>
    );
};

export default PdfContent;
