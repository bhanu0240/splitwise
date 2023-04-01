import React, { useState } from "react";
import "./data-table.component.css";
import Addfriends from "./../../../services/apicall"
import { POST, ADD_FRIENDS_URL } from "../../../constants/constants";
import { handleFiles } from "../../../utils/compute-image-hash";
import { computeFileStatus, addNewFiles } from "../../../services/image-hash.service";


function DataTable({ onClose }) {
    const [name, setName] = useState("");
    const [nameError, setNameError] = useState("");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [mobile, setMobile] = useState("");
    const [mobileError, setMobileError] = useState("");
    const [image, setImage] = useState(null);
    const [rows, setRows] = useState([]);
    const [submitClicked, setSubmitClicked] = useState(false);

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

        if (name && email && mobile) {
            let computedImageHash = await handleFiles(image);
            let getImageStatus = await computeFileStatus(computedImageHash.fileHashes);

            if (!Object.values(getImageStatus.data)[0]) {
                const addFilesResponse = await addNewFiles(image);
                if (addFilesResponse === 200) {
                    setImage(null);
                }

                else {
                    alert("Error while adding Images");
                    return;
                }
            }

            setRows([...rows, { Name: name, Email: email, PhoneNum: mobile, ImagePath: computedImageHash.fileHashes[0] }]);
            setName("");
            setEmail("");
            setMobile("");
            setImage(null);
        } else if (nameError || emailError || mobileError) {

            alert("Error while adding Images");
            return;
        } else {
            setNameError(name ? "" : "Name is required.");
            setEmailError(email ? "" : "Email is required.");
            setMobileError(mobile ? "" : "Mobile number is required.");
            return;
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
        setSubmitClicked(true);
    }

    const renderAddFriendsAPICallback = (data) => {
        onClose();
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
                            <td>{row.Name}</td>
                            <td>{row.Email}</td>
                            <td>{row.PhoneNum}</td>
                            <td>{row.Image ? <img src={URL.createObjectURL(row.Image)} alt="User Avatar" /> : "N/A"}</td>
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

            {
                submitClicked &&
                <Addfriends
                    method={POST}
                    url={ADD_FRIENDS_URL}
                    render={(data) => { renderAddFriendsAPICallback() }}
                    data={rows}
                />
            }
        </div>
    );
}

export default DataTable;