import React, { useState } from "react";
import "./data-table.component.css";

function DataTable() {
    const [name, setName] = useState("");
    const [nameError, setNameError] = useState("");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [mobile, setMobile] = useState("");
    const [mobileError, setMobileError] = useState("");
    const [image, setImage] = useState(null);
    const [rows, setRows] = useState([]);

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
        setImage(event.target.files[0]);
    };

    const handleAddRow = () => {
        if (name && email && mobile) {
            setRows([...rows, { name, email, mobile, image }]);
            setName("");
            setEmail("");
            setMobile("");
            setImage(null);
        } else {
            setNameError(name ? "" : "Name is required.");
            setEmailError(email ? "" : "Email is required.");
            setMobileError(mobile ? "" : "Mobile number is required.");
        }
    };

    const handleEditRow = (index) => {
        const editedRow = rows[index];
        setName(editedRow.name);
        setEmail(editedRow.email);
        setMobile(editedRow.mobile);
        setImage(editedRow.image);
        setRows(rows.filter((row, i) => i !== index));
    };

    const handleDeleteRow = (index) => {
        setRows(rows.filter((row, i) => i !== index));
    };

    const addFriends = () => {
        console.log(rows);
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
                            {nameError && <div className="error">{nameError}</div>}
                        </td>
                        <td>
                            <input type="email" value={email} onChange={handleEmailChange} />
                            {emailError && <div className="error">{emailError}</div>}
                        </td>
                        <td>
                            <input type="tel" value={mobile} onChange={handleMobileChange} />
                            {mobileError && <div className="error">{mobileError}</div>}
                        </td>
                        <td>
                            <input type="file" accept="image/*" onChange={handleImageChange} />
                        </td>
                        <td>
                            <button className="add-button" onClick={handleAddRow}>Add</button>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={index}>
                            <td>{row.name}</td>
                            <td>{row.email}</td>
                            <td>{row.mobile}</td>
                            <td>{row.image ? <img src={URL.createObjectURL(row.image)} alt="User Avatar" /> : "N/A"}</td>
                            <td>
                                <button className="edit-button" onClick={() => handleEditRow(index)}>Edit</button>
                                <button className="delete-button" onClick={() => handleDeleteRow(index)}>Delete</button>
                            </td>
                        </tr>
                    ))}

                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan="5" className="submit-button" onClick={addFriends}>
                            Submit
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}

export default DataTable;