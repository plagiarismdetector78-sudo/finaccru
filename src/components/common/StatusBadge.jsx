const statusStyles = {
    Void: "text-red-700 bg-red-100",
    Draft: "text-yellow-700 bg-yellow-100",
    "Pending Approval": "text-blue-700 bg-blue-100",
    Approved: "text-emerald-700 bg-emerald-100",
    Converted: "text-cyan-700 bg-cyan-100",
    Sent: "text-sky-700 bg-sky-100",
    "Client Accepted": "text-green-700 bg-green-100 ",
};

const StatusBadge = ({ status }) => {
    const style = statusStyles[status] || "text-gray-700 bg-gray-100";

    return (
        <div
            className={`px-2 py-1 rounded-full text-xs text-center font-medium ${style}`}
        >
            {status}
        </div>
    );
};

export default StatusBadge;
