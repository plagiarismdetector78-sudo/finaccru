import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { readJrAccountants } from "../../Actions/Accountant";

import Header from "../Accountant/Header/Header";
import Table from "../Accountant/Table/Table";

import "../Accountant/Accountant.css";

const SeniorAccountant = () => {
  const dispatch = useDispatch();

  const { jr_accountants, loading } = useSelector((state) => state.accountantReducer);

  useEffect(() => {
    dispatch(readJrAccountants());
  }, [dispatch]);

  return (
    <div className="accountant__body">
      <Header backNeeded={false} />
      <Table tableFor="jrAccountant" data={jr_accountants} loading={loading} />
    </div>
  )
}

export default SeniorAccountant;
