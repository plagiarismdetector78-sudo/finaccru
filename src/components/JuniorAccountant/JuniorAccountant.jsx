import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { readAccountantClientsList } from "../../Actions/Accountant";

import Header from "../Accountant/Header/Header";
import Table from "../Accountant/Table/Table";

import "../Accountant/Accountant.css";

const JuniorAccountant = () => {
  const dispatch = useDispatch();
  
  const { clients, loading } = useSelector((state) => state.accountantReducer);

  useEffect(() => {
    dispatch(readAccountantClientsList());
  }, [dispatch]);
  
  return (
    <div className="accountant__body">
      <Header />
      <Table tableFor="clients" data={clients} loading={loading} />
    </div>
  )
}

export default JuniorAccountant;
