import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from '../../../Actions/User';
import CompanyModal from "../CompanyModal/CompanyModal";

import "./Header.css"
import { InfoCircleTwoTone } from "@ant-design/icons";
import backButton from "../../../assets/Icons/back.svg";
import logoutIcon from "../../../assets/dashboardIcons/logout.svg";
import profileIcon from "../../../assets/dashboardIcons/profile.svg";

import { Tooltip } from "antd";

const Header = ({ headerFor, backNeeded }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [companyModalOpen, setCompanyModalOpen] = useState(false);

    const { user } = useSelector(state => state.userReducer);

    return (
        <>
            {
                backNeeded ?
                    <div className='read__header--left back__btn'>
                        <img src={backButton} alt='back' className='read__header--back-btn' onClick={() => {
                            navigate(window.location.pathname.split('/').slice(0, -2).join('/') === "" ? "/" : window.location.pathname.split('/').slice(0, -2).join('/'));
                        }} />
                        <h1 className='read__header--title'> Go Back </h1>
                    </div>
                    : null
            }
            <div className={`header__accountant ${backNeeded ? 'header__accountant--padding2' : 'header__accountant--padding1'}`}>
                <div className="header__accountant--left">
                    <span className="header__accountant--title">
                        {
                            headerFor === "Chat" ?
                                <>
                                    <h1> Chat </h1>
                                </>
                                : headerFor ?
                                    <>
                                        <h1> {headerFor?.full_name} </h1>
                                        <InfoCircleTwoTone onClick={() => setCompanyModalOpen(true)} />
                                    </>
                                    :
                                    <h1> Dashboard </h1>
                        }
                    </span>
                </div>
                <CompanyModal isCompanyModalOpen={companyModalOpen} handleCompanyCancel={() => setCompanyModalOpen(false)} clientData={headerFor} />
                <div className="header__accountant--right">
                    <div className="header__accountant--profile">
                        <img src={profileIcon} alt="" />
                        <div className="header__accountant--userinfo">
                            <span className="header__accountant--name">{user?.displayName}</span>
                            <span className="header__accountant--email">{user?.email}</span>
                        </div>
                        <Tooltip title="Logout" color='red' placement="bottom">
                            <img className="header__accountant--logout" src={logoutIcon} alt="logout"
                                onClick={() => dispatch(logout())}
                            />
                        </Tooltip>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header;
