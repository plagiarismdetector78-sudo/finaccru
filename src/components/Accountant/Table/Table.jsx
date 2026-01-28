import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import clientColumns from "../../../Columns/Client";
import juniorAccountantColumns from '../../../Columns/JuniorAccountant';

import TableCard from "../../../Shared/TableCard/TableCard";
import "./Table.css";

const Table = ({ tableFor, data, loading, id }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector(state => state.userReducer);
    const client_columns = clientColumns(navigate, user?.localInfo?.role, id);
    const junior_accountant_columns = juniorAccountantColumns(navigate);

    return (
        <div className='accountant__table'>
            <div className='accountant__table--head'>
                <div className='accountant__table--heading'>
                    {
                        tableFor === "clients" ? "All Clients" : "All Junior Accountants"
                    }
                </div>
                <div className='accountant_chat' onClick={() => navigate("/chat")}>Chat</div>
            </div>
            <div className='accountant__table'>
                <TableCard
                    columns={tableFor === "clients" ? client_columns : junior_accountant_columns}
                    dispatch={dispatch}
                    items={{ items: data, total_items: data?.length }}
                    loading={loading}
                />
            </div>
        </div>
    )
}

export default Table;