import React, { useState } from "react";
import "./data-table.component.css";
import Addfriends from "./../../../services/apicall"
import { POST, ADD_FRIENDS_URL } from "../../../constants/constants";
import axios from "axios";


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

    const handleFiles = async (file) => {
        const reader = new FileReader();
        let sha256result;

        // Wrap the FileReader.onload event in a promise
        const onloadPromise = new Promise((resolve) => {
            reader.onload = () => {
                const fileResult = reader.result;
                crypto.subtle.digest('SHA-256', fileResult).then((hash) => {
                    sha256result = hex(hash);
                    resolve(); // resolve the promise once the hash is calculated
                });
            };
        });

        reader.readAsArrayBuffer(file);

        // Wait for the promise to resolve before returning the sha256result value
        await onloadPromise;
        return sha256result;
    };


    // this function was taken from https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#Example
    function hex(buffer) {
        var hexCodes = [];
        var view = new DataView(buffer);
        for (var i = 0; i < view.byteLength; i += 4) {
            // Using getUint32 reduces the number of iterations needed (we process 4 bytes each time)
            var value = view.getUint32(i)
            // toString(16) will give the hex representation of the number without padding
            var stringValue = value.toString(16)
            // We use concatenation and slice for padding
            var padding = '00000000'
            var paddedValue = (padding + stringValue).slice(-padding.length)
            hexCodes.push(paddedValue);
        }

        // Join all the hex strings into one
        return hexCodes.join("");
    }

    const handleHashedImage = async (imagehash) => {

        try {
            let res = await axios.get(`http://192.168.1.9:3000/v1/file-exists/${imagehash}`);
            return res
        } catch (err) {
            return err;
        }

    }

    const addNewFile = async () => {
        try {
            const formData = new FormData();

            // Update the formData object
            formData.append(
                "files",
                image,
                image.name
            );

            let res = await axios.post(`http://192.168.1.9:3000/v1/files`, formData);
            return res.response.data;
        } catch (err) {
            console.log(err);
            return err;
        }

    }

    const handleAddRow = async () => {

        if (name && email && mobile) {
            let imageHash = await handleFiles(image);
            let hashedImageResponse = await handleHashedImage(imageHash);
            if (hashedImageResponse.response.status === 404) {
                imageHash = await addNewFile(image, name);
            }

            setRows([...rows, { Name: name, Email: email, PhoneNum: mobile, ImageHash: imageHash }]);
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