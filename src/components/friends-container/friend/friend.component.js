import React, { useState } from 'react'
import { createPortal } from "react-dom"
import Modal from "../../common/modal-container/modal-container.component"
import EditFriend from "./edit-firend/edit-friend.component"
import DeleteFriend from "./delete-friend/delete-friend.component"
import DeleteIcon from "../../../assets/images/delete-icon.png"
import EditIcon from "../../../assets/images/edit-icon.png"
import { FILES_URL } from "../../../constants/constants"
import "./friend.component.css"

function Friend({ name, id, phoneNum, email, imagePath,refresh }) {
  const [showEditModal, setEditModal] = useState(false);
  const [showDeleteModal, setDeleteModal] = useState(false);

  const renderEditModal = () => {

    return (
    <Modal 
      open={showEditModal}
      onClose={toggleEditModal}
      title={"Edit Friend"}
      className={"edit-modal"}
    >
      <EditFriend
        onClose={toggleEditModal}
        name={name}
        id={id}
        mobile={phoneNum}
        email={email}
        imagePath={imagePath}
        refresh={refresh}
      />
    </Modal>
    );
  }

  const renderDeleteModal = () => {
    return (<Modal
      open={showDeleteModal}
      onClose={toggleDeleteModal}
      className={"delete-modal"}
      title={"Delete Friend"}
    >
      <DeleteFriend
        onClose={toggleDeleteModal}
        name={name}
        id={id}
        refresh={refresh}
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
         createPortal(renderEditModal(), document.body)
      }

      {
       createPortal(renderDeleteModal(), document.body)
      }
    </div>
  )
}




export default Friend;