import React,{useState} from "react"
import { createPortal } from "react-dom"
import EditGroup from "./edit-group/edit-group.component"
import DeleteGroup from "../../common/confirm-component/confirm.component"
import Modal from "../../common/modal-container/modal-container.component"
import DeleteIcon from "../../../assets/images/delete-icon.png"
import EditIcon from "../../../assets/images/edit-icon.png"
import { FILES_URL, GROUPS_URL } from "../../../constants/constants"
import "./group.component.css"


function GroupComponent({name,id,refresh,imagePath}) {
  const [showEditModal, setEditModal] = useState(false);
  const [showDeleteModal, setDeleteModal] = useState(false);

  const renderEditModal = () => {

    return (
    <Modal 
      open={showEditModal}
      onClose={toggleEditModal}
      title={"Edit Group"}
      className={"edit-modal"}
    >
      <EditGroup
        onClose={toggleEditModal}
        name={name}
        id={id}
        imagePath={imagePath}
        refresh={refresh}
      />
    </Modal>
    );
  }

  const renderDeleteModal = () => {
    const message=`Are you sure you want to delete ${name} from your groups`;
    const url=`${GROUPS_URL}/${id}`
    return (<Modal
      open={showDeleteModal}
      onClose={toggleDeleteModal}
      className={"delete-modal"}
      title={"Delete Group"}
    >
      <DeleteGroup
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

export default GroupComponent