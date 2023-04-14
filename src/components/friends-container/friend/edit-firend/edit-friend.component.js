import React, { useState } from "react"
import { handleFileSubmission } from '../../../../utils/file-upload-hash'
import { PUT, CONTACTS_URL, FILES_URL } from "../../../../constants/constants"
import editContactById from "../../../../services/api-call.service"


function EditFriend({ name: friendName, id: contactId, mobile: friendMobile, email: friendEmail, imagePath, onClose, refresh }) {
    const initial_image_url = `${FILES_URL}${imagePath}`;
    const [name, setName] = useState(friendName);
    const [nameError, setNameError] = useState("");
    const [email, setEmail] = useState(friendEmail);
    const [emailError, setEmailError] = useState("");
    const [mobile, setMobile] = useState(friendMobile);
    const [mobileError, setMobileError] = useState("");
    const [image, setImage] = useState(null);
    const [imageURL, setImageURL] = useState(initial_image_url);

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
        setImageURL(URL.createObjectURL(event.target.files[0]));
        setImage(event.target.files);
    };



    const getPayload = async () => {

        let payload = {
            Name: name,
            Email: email,
            PhoneNum: mobile,
        }
        if (image) {
            let computedImageHash = await handleFileSubmission(image);
            payload["ImagePath"] = computedImageHash.fileHashes[0];
        } else {
            payload["ImagePath"] = imagePath
        }

        return payload;
    }


    const handleEditFriend = async () => {

        const url = `${CONTACTS_URL}/${contactId}`;
        const payload = await getPayload();
        try {
            const res = await editContactById(url, PUT, payload);
            if (res.statusText === "Accepted")
                refresh();
            else
                alert("Edit Unsuccessfull");
            onClose();
        } catch (err) {
            alert(`Editing ${name} failed`)
            onClose();
        }
    }


    return (<div className="edit-friend">

        <div className='row'>
            <label>Name</label>
            <input type="text" value={name} onChange={handleNameChange} />
            {nameError && <div className="error">{nameError}</div>}
        </div>
        <div className='row'>
            <label>Email</label>
            <input type="email" value={email} onChange={handleEmailChange} />
            {emailError && <div className="error">{emailError}</div>}
        </div>
        <div className='row'>
            <label>Phone</label>
            <input type="tel" value={mobile} onChange={handleMobileChange} />
            {mobileError && <div className="error">{mobileError}</div>}
        </div>
        <div className='row'>
            <label>Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {<img
                src={imageURL}
                alt={`${friendName}'s profile`}
            />
            }
        </div>
        <div className="edit-friend-button" onClick={async () => { await handleEditFriend() }}>
            <label>Edit Friend</label>
        </div>

    </div>);

}

export default EditFriend;