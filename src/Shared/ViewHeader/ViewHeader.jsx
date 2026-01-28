import "./ViewHeader.css";

const ViewHeader = ({ title, logo }) => {
    return (
        <div className="view__header">
            <div style={{ width: "9rem", height: "5rem", overflow: "hidden" }}>
                {logo && (
                    <img
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                        }}
                        src={logo}
                        alt="logo"
                    />
                )}
            </div>
            <h1 className="view__header--head">{title}</h1>
        </div>
    );
};

export default ViewHeader;
