import React, { useState, useRef } from "react";
import "./data-table.component.css";
import { POST, FILES_URL, CONTACTS_URL } from "../../../constants/constants";
import { handleFileSubmission } from "../../../utils/file-upload-hash";
import addContacts from "./../../../services/api-call.service"


function DataTable({ onClose, refresh }) {
    const [name, setName] = useState("");
    const [nameError, setNameError] = useState("");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [mobile, setMobile] = useState("");
    const [mobileError, setMobileError] = useState("");
    const [image, setImage] = useState(null);
    const [rows, setRows] = useState([]);

    const fileInputRef = useRef(null);

    const handleNameChange = (event) => {
        setName(event.target.value);
        if (!event.target.value) {
            setNameError("Name is required.");
        } else {
            setNameError("");
        }
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        if (!event.target.value) {
            setEmailError("Email is required.");
        } else if (!/\S+@\S+\.\S+/.test(event.target.value)) {
            setEmailError("Invalid email format.");
        } else {
            setEmailError("");
        }
    };

    const handleMobileChange = (event) => {
        setMobile(event.target.value);
        if (!event.target.value) {
            setMobileError("Mobile number is required.");
        } else if (!/^\d{10}$/.test(event.target.value)) {
            setMobileError("Invalid mobile number format.");
        } else {
            setMobileError("");
        }
    };

    const handleImageChange = (event) => {
        setImage(event.target.files);
    };


    const handleAddRow = async () => {
        if (!nameError && !emailError && !mobileError && name && email && mobile) {
            if (image) {
                let computedImageHash = await handleFileSubmission(image);
                setRows([...rows, { Name: name, Email: email, PhoneNum: mobile, ImagePath: computedImageHash.fileHashes[0] }]);
            } else {
                setRows([...rows, { Name: name, Email: email, PhoneNum: mobile }]);
            }
            setName("");
            setEmail("");
            setMobile("");
            setImage(null);
            fileInputRef.current.value = null;
        }

    };

    const handleEditRow = (index) => {
        const editedRow = rows[index];
        setName(editedRow.Name);
        setEmail(editedRow.Email);
        setMobile(editedRow.PhoneNum);
        setRows(rows.filter((row, i) => i !== index));
    };

    const handleDeleteRow = (index) => {
        setRows(rows.filter((row, i) => i !== index));
    };

    const handleAddContacts = async () => {
        if (rows.length > 0) {
            try {
                const res = await addContacts(
                    CONTACTS_URL,
                    POST,
                    rows
                );
                if (res.statusText === "Created") {
                    refresh();
                    onClose();
                }
            } catch (err) {
                alert("Something went wrong while adding");
                console.log(err);
            }
        }
        else {
            alert("Please add contacts");
        }
    }


    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Image</th>
                        <th>Actions</th>
                    </tr>
                    <tr>
                        <td>
                            <input type="text" value={name} onChange={handleNameChange} />
                            <div className="error"> {nameError && nameError}</div>
                        </td>
                        <td>
                            <input type="email" value={email} onChange={handleEmailChange} />
                            <div className="error">  {emailError && emailError}</div>
                        </td>
                        <td>
                            <input type="tel" value={mobile} onChange={handleMobileChange} />
                            <div className="error">{mobileError && mobileError}</div>
                        </td>
                        <td>
                            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} />
                        </td>
                        <td>
                            <button className="add-button" onClick={handleAddRow}>Add</button>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={index}>
                            <td>{row.Name}</td>
                            <td>{row.Email}</td>
                            <td>{row.PhoneNum}</td>
                            <td>{row.ImagePath ? <img src={`${FILES_URL}${row.ImagePath}`} alt="User Avatar" /> : "N/A"}</td>
                            <td>
                                <div className="btn-container">
                                    <button className="edit-button" onClick={() => handleEditRow(index)}>Edit</button>
                                    <button className="delete-button" onClick={() => handleDeleteRow(index)}>Delete</button>
                                </div>
                            </td>
                        </tr>
                    ))}

                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan="5" className="submit-button" onClick={handleAddContacts}>
                            Submit
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}

export default DataTable;