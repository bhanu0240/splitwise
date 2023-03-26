import React from "react"
import DataTable from "../../common/data-table/data-table.component";
import ModalContainer from "../../common/modal-container/modal-container.component";
import "./add-friend.component.css"

function AddFriend({ onClose }) {
  return (
    <ModalContainer title={"Add Friend"} onClose={onClose} className="add-firend">
      <DataTable />
    </ModalContainer>
  )
}

export default AddFriend;