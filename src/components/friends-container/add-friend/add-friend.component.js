import React from "react"
import DataTable from "../../common/data-table/data-table.component";
import ModalContainer from "../../common/modal-container/modal-container.component";
import "./add-friend.component.css"

function AddFriend({ onClose, open, refresh }) {

  return (
    <ModalContainer open={open} title={"Add Friend"} onClose={onClose} className="add-firend">
      <DataTable onClose={onClose} refresh={refresh} />
    </ModalContainer>
  )

}

export default AddFriend;