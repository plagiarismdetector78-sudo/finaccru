import React from 'react'
import logo from '../../assets/Icons/cropped_logo.svg'
import './ViewFooter.css'

const ViewFooter = () => {
    return (
        <div className="view__footer">
            <img style={{ width: "5rem" }} src={logo} alt="logo" />
            <div className='view__footer--text'>
                <p style={{ fontWeight: "400", fontSize: "0.8rem" }}> This is electronically generated document and does not require sign or stamp. </p>
                <span style={{ marginTop: "0.8rem", fontWeight: "700", fontSize: "0.8rem" }}> powered by Finaccru </span>
            </div>
        </div>
    )
}

export default ViewFooter
