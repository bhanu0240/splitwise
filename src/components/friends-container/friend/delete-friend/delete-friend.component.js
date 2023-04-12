import React, { useState } from "react"
import DeleteFriendAPI from "../../../../services/apicall"
import { DELETE, CONTACTS_URL } from "../../../../constants/constants"

function DeleteFriend({ name, id, onClose,refresh }) {

  const [confirmBtnClicked, setConfirmBtnClicked] = useState(false);


  const deleteFriendButtonClicked = () => {
    setConfirmBtnClicked(true);
  }

  const renderDeleteAPICallBack = (data) => {
    refresh("deleteFriend");
    setConfirmBtnClicked(false);
    onClose();
  }

  return (<div className="delete-friend">
    <div className='message'>
      Do you want to delete {name} from your contacts
    </div>
    <div className='button-container'>
      <button className="cancel" onClick={onClose}>Cancel</button>
      <button className="confirm" onClick={deleteFriendButtonClicked}>Confirm</button>
    </div>
    {
      confirmBtnClicked &&
      <DeleteFriendAPI
        method={DELETE}
        url={`${CONTACTS_URL}/${id}`}
        render={(data) => renderDeleteAPICallBack(data)}
      />
    }

  </div>);
}

export default DeleteFriend;