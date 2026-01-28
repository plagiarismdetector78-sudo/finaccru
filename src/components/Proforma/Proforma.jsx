import React, { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Download, Plus, Search } from "lucide-react";

import Input from "../common/Input";
import Button from "../common/Button";
import Spinner from "../common/Spinner";
import Breadcrumb from "../common/BreadCrumb";
import DeviceRestriction from "../common/DeviceRestriction";
import ProformaTable from "./ProformaTable";
import { downloadProformaList, getProformaList } from "../../Actions/Proforma";

const Proforma = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, proformas } = useSelector(
        (state) => state.proformaReducer
    );

    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const fetchProformas = (page = 1, search = "") => {
        dispatch(getProformaList(page, search));
    };

    const debouncedSearch = useCallback(
        debounce((searchValue) => {
            setCurrentPage(1);
            fetchProformas(1, searchValue);
        }, 500),
        [dispatch]
    );

    useEffect(() => {
        if (!searchText) {
            fetchProformas(currentPage);
        }
    }, [dispatch, currentPage, searchText]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        fetchProformas(newPage, searchText);
    };

    useEffect(() => {
        fetchProformas(currentPage);
    }, []);

    useEffect(() => {
        if (searchText.length > 2) {
            debouncedSearch(searchText);
        }
        return () => {
            debouncedSearch.cancel();
        };
    }, [searchText, debouncedSearch]);

    const handleCreateProformaClick = () => {
        navigate("/proforma/create");
    };

    const handleProformaDownloadClick = () => {
        dispatch(downloadProformaList());
    };

    const handleSearchInputChange = (event) => {
        setSearchText(event.target.value);
    };

    if (loading) {
        return <Spinner />;
    }

    return (
        <DeviceRestriction>
            <div>
                <Breadcrumb
                    item={{
                        label: "Proforma Invoice",
                        viewLabel: "View Proforma Invoices",
                    }}
                />
                <div className="flex items-center justify-between gap-40 my-5">
                    <div className="w-1/3">
                        <Input
                            icon={Search}
                            value={searchText}
                            onChange={handleSearchInputChange}
                            placeholder={"Search Proforma by Proforma Number"}
                        />
                    </div>
                    <div className="flex items-center gap-5 w-1/3">
                        <Button
                            icon={Download}
                            text={"Download"}
                            variant="outlined"
                            onClick={handleProformaDownloadClick}
                        />
                        <Button
                            icon={Plus}
                            text={"Create Proforma"}
                            onClick={handleCreateProformaClick}
                        />
                    </div>
                </div>
                <div>
                    <ProformaTable
                        proformas={proformas}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </DeviceRestriction>
    );
};

export default Proforma;
