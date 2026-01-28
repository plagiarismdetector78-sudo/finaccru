import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { readAccountantClientsList } from "../../../Actions/Accountant";

import Header from "../../Accountant/Header/Header";
import Table from "../../Accountant/Table/Table";

import "../../Accountant/Accountant.css";
import { useParams } from "react-router-dom";


const JrAccountants = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { clients, loading } = useSelector((state) => state.accountantReducer);

  useEffect(() => {
    dispatch(readAccountantClientsList("sr", id));
  }, [dispatch, id]);

  return (
    <div className="accountant__body">
      <Header backNeeded={true} backFor="jr" />
      <Table tableFor="clients" data={clients} loading={loading} id={id} />
    </div>
  )
}

export default JrAccountants;
