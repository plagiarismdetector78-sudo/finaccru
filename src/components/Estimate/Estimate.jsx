import React, { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import Input from "../common/Input";
import { Download, Plus, Search } from "lucide-react";
import Button from "../common/Button";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Spinner from "../common/Spinner";
import Breadcrumb from "../common/BreadCrumb";
import EstimateTable from "./EstimateTable";
import { downloadEstimateList, getEstimateList } from "../../Actions/Estimate";
import DeviceRestriction from "../common/DeviceRestriction";

const Estimate = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, estimates } = useSelector(
        (state) => state.estimateReducer
    );

    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const fetchEstimates = (page = 1, search = "") => {
        dispatch(getEstimateList(page, search));
    };

    const debouncedSearch = useCallback(
        debounce((searchValue) => {
            setCurrentPage(1);
            fetchEstimates(1, searchValue);
        }, 500),
        [dispatch]
    );

    useEffect(() => {
        if (!searchText) {
            fetchEstimates(currentPage);
        }
    }, [dispatch, currentPage, searchText]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        fetchEstimates(newPage, searchText);
    };

    useEffect(() => {
        fetchEstimates(currentPage);
    }, []);

    useEffect(() => {
        if (searchText.length > 2) {
            debouncedSearch(searchText);
        }
        return () => {
            debouncedSearch.cancel();
        };
    }, [searchText, debouncedSearch]);

    const handleCreateEstimateClick = () => {
        navigate("/estimate/create?action_type=create");
    };

    const handleEstimateDownloadClick = () => {
        dispatch(downloadEstimateList());
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
                    item={{ label: "Estimate", viewLabel: "View Estimates" }}
                />
                <div className="flex items-center justify-between gap-40 my-5">
                    <div className="w-1/3">
                        <Input
                            icon={Search}
                            value={searchText}
                            onChange={handleSearchInputChange}
                            placeholder={"Search Estimate by Estimate Number"}
                        />
                    </div>
                    <div className="flex items-center gap-5 w-1/3">
                        <Button
                            icon={Download}
                            text={"Download"}
                            variant="outlined"
                            onClick={handleEstimateDownloadClick}
                        />
                        <Button
                            icon={Plus}
                            text={"Create Estimate"}
                            onClick={handleCreateEstimateClick}
                        />
                    </div>
                </div>
                <div>
                    <EstimateTable
                        estimates={estimates}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </DeviceRestriction>
    );
};

export default Estimate;
