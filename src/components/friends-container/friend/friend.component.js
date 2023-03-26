import React, { useState } from 'react'
import { createPortal } from "react-dom"
import Modal from "../../common/modal-container/modal-container.component"
import ProfileIcon from "../../../assets/images/profile-icon.png"
import DeleteIcon from "../../../assets/images/delete-icon.png"
import EditIcon from "../../../assets/images/edit-icon.png"
import "./friend.component.css"

function Friend({ name, id }) {
  const [showEditModal, setEditModal] = useState(false);
  const [showDeleteModal, setDeleteModal] = useState(false);

  const renderEditModal = () => {

    return (<Modal className={"edit-modal"}
      onClose={() => { setEditModal(!showEditModal) }}
      title={"Edit Friend"}
    >
    </Modal>);
  }

  const renderDeleteModal = () => {
    return (<Modal
      className={"delete-modal"}
      onClose={() => { setDeleteModal(!showDeleteModal) }}
      title={"Delete Friend"}
    >
    </Modal>);
  }


  return (
    <div className="profile-card" key={id}>
      <div className="profile-icon">
        <img src={ProfileIcon} alt="Profile Icon" />
      </div>
      <div className="profile-name">
        {name}
      </div>
      <div className="profile-actions">
        <span className="edit-icon">
          <img src={EditIcon} alt="Edit Icon" onClick={() => setEditModal(!showEditModal)} />
        </span>
        <span className="delete-icon">
          <img src={DeleteIcon} alt="Delete Icon" onClick={() => setDeleteModal(!showDeleteModal)} />
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

export default Friend;