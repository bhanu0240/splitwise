import React, { useState } from "react"
import EditFriendAPI from "../../../../services/apicall"
import { addNewFiles, computeFileStatus } from '../../../../services/image-hash.service'
import { handleFiles } from '../../../../utils/compute-image-hash'
import { PUT, CONTACTS_URL } from "../../../../constants/constants"


function EditFriend({ name: friendName, id: friendId, mobile: friendMobile, email: friendEmail, imagePath, onClose }) {
    const [name, setName] = useState(friendName);
    const [nameError, setNameError] = useState("");
    const [email, setEmail] = useState(friendEmail);
    const [emailError, setEmailError] = useState("");
    const [mobile, setMobile] = useState(friendMobile);
    const [mobileError, setMobileError] = useState("");
    const [image, setImage] = useState(null);
    const [editClicked, setEditClicked] = useState(false);
    const [payloadData, setPayloadData] = useState(null);
    const [imageURL, setImageURL] = useState(`${CONTACTS_URL}${imagePath}`);

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


    const handleEditFriendClicked = async () => {
        let payload = await getPayload()
        setPayloadData(payload);
        setEditClicked(true);
    }

    const getPayload = async () => {

        let payload = {
            Name: name,
            Email: email,
            PhoneNum: mobile,
        }
        if (image) {
            let computedImageHash = await handleFiles(image);
            let getImageStatus = await computeFileStatus(computedImageHash.fileHashes);

            if (!Object.values(getImageStatus.data)[0]) {
                const addFilesResponse = await addNewFiles(image);
                if (addFilesResponse === 200) {
                    setImage(null);
                } else {
                    alert("Error while adding Images");
                    return {};
                }
            }

            payload["ImagePath"] = computedImageHash.fileHashes[0];
        } else {
            payload["ImagePath"] = imagePath
        }

        return payload;
    }

    const renderEditAPICallback = (data) => {
        setEditClicked(false);
        onClose();
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
        <div className="edit-friend-button" onClick={async () => { await handleEditFriendClicked() }}>
            <label>Edit Friend</label>
        </div>

        {
            editClicked && <EditFriendAPI
                method={PUT}
                url={`${CONTACTS_URL}/${friendId}`}
                data={payloadData}
                render={(data) => renderEditAPICallback(data)}
            />
        }

    </div>);

}

export default EditFriend;