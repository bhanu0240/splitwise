import React, { useState } from 'react'
import { createPortal } from "react-dom"
import Modal from "../../common/modal-container/modal-container.component"
import EditContact from "./edit-contact/edit-contact.component"
import DeleteContact from "../../common/confirm-component/confirm.component"
import DeleteIcon from "../../../assets/images/delete-icon.png"
import EditIcon from "../../../assets/images/edit-icon.png"
import { CONTACTS_URL, FILES_URL } from "../../../constants/constants"
import "./contact.component.css"

function Contact({ name, id, phoneNum, email, imagePath,refresh}) {
  const [showEditModal, setEditModal] = useState(false);
  const [showDeleteModal, setDeleteModal] = useState(false);

  const renderEditModal = () => {

    return (
    <Modal 
      open={showEditModal}
      onClose={toggleEditModal}
      title={"Edit Contact"}
      className={"edit-modal"}
    >
      <EditContact
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
    const url= `${CONTACTS_URL}/${id}`;
    const message=`Are you sure you want to delete ${name} from your contacts`;
    return (<Modal
      open={showDeleteModal}
      onClose={toggleDeleteModal}
      className={"delete-modal"}
      title={"Delete Contact"}
    >
      <DeleteContact
        onClose={toggleDeleteModal}
        message={message}
        url={url}
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
        <img src={`${FILES_URL}/${imagePath}`} alt="Profile Icon" />
      </div>
      <div className="profile-name" title={name}>
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




export default Contact;