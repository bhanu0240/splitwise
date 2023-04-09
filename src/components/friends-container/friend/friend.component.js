import React, { useState } from 'react'
import { createPortal } from "react-dom"
import Modal from "../../common/modal-container/modal-container.component"
import EditFriend from "./edit-firend/edit-friend.component"
import DeleteFriend from "./delete-friend/delete-friend.component"
import DeleteIcon from "../../../assets/images/delete-icon.png"
import EditIcon from "../../../assets/images/edit-icon.png"
import { FILES_URL } from "../../../constants/constants"
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
        <img src={`${FILES_URL}${imagePath}`} alt="Profile Icon" />
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



export default Friend;