import React, { useState } from 'react'
import { createPortal } from "react-dom"
import Modal from "../../common/modal-container/modal-container.component"
import EditFriendAPI from "../../../services/apicall"
import DeleteFriendAPI from "../../../services/apicall"
import { addNewFiles, computeFileStatus } from '../../../services/image-hash.service'
import { handleFiles } from '../../../utils/compute-image-hash'
import { DELETE, GET_FRIENDS_URL, PUT, DEFAULT_PROFILE_PATH } from "../../../constants/constants"
import DeleteIcon from "../../../assets/images/delete-icon.png"
import EditIcon from "../../../assets/images/edit-icon.png"
import "./friend.component.css"

function Friend({ name, id, phoneNum, email, imagePath }) {
  const [showEditModal, setEditModal] = useState(false);
  const [showDeleteModal, setDeleteModal] = useState(false);

  const renderEditModal = () => {

    return (<Modal className={"edit-modal"}
      onClose={toggleEditModal}
      title={"Edit Friend"}
    >
      <EditFriend
        onClose={toggleEditModal}
        name={name}
        id={id}
        mobile={phoneNum}
        email={email}
        imagePath={imagePath}
      />
    </Modal>);
  }

  const renderDeleteModal = () => {
    return (<Modal
      className={"delete-modal"}
      onClose={toggleDeleteModal}
      title={"Delete Friend"}
    >
      <DeleteFriend
        onClose={toggleDeleteModal}
        name={name}
        id={id}
      />
    </Modal>);
  }

  const toggleDeleteModal = () => {
    setDeleteModal(!showDeleteModal);
  }

  const toggleEditModal = () => {
    setEditModal(!showEditModal);
  }


  return (
    <div className="profile-card" key={id}>
      <div className="profile-icon">
        <img src={`${DEFAULT_PROFILE_PATH}${imagePath}`} alt="Profile Icon" />
      </div>
      <div className="profile-name">
        {name}
      </div>
      <div className="profile-actions">
        <span className="edit-icon">
          <img src={EditIcon} alt="Edit Icon" onClick={toggleEditModal} />
        </span>
        <span className="delete-icon">
          <img src={DeleteIcon} alt="Delete Icon" onClick={toggleDeleteModal} />
        </span>
      </div>

      {
        showEditModal && createPortal(renderEditModal(), document.body)
      }

      {
        showDeleteModal && createPortal(renderDeleteModal(), document.body)
      }
    </div>
  )
}

// While API call was made dont render other data or jsx from this component (need to work)
// Have to handle 

function DeleteFriend({ name, id, onClose }) {

  const [confirmBtnClicked, setConfirmBtnClicked] = useState(false);


  const deleteFriendButtonClicked = () => {
    setConfirmBtnClicked(true);

  }

  const renderDeleteAPICallBack = (data) => {
    setConfirmBtnClicked(false);
    onClose();
  }

  return (<div className="delete-friend">
    <div className='message'>
      Do you want to delete {name} from your contacts
    </div>
    <div className='button-container'>
      <button className="cancel" onClick={() => { onClose() }}>Cancel</button>
      <button className="confirm" onClick={() => { deleteFriendButtonClicked() }}>Confirm</button>
    </div>
    {
      confirmBtnClicked &&
      <DeleteFriendAPI
        method={DELETE}
        url={`${GET_FRIENDS_URL}/${id}`}
        render={(data) => renderDeleteAPICallBack(data)}
      />
    }

  </div>);
}


// While API call was made dont render other data or jsx from this component (need to work)

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
  const [imageURL, setImageURL] = useState(`${DEFAULT_PROFILE_PATH}${imagePath}`);

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
        url={`${GET_FRIENDS_URL}/${friendId}`}
        data={payloadData}
        render={(data) => renderEditAPICallback(data)}
      />
    }

  </div>);

}

export default Friend;