import deletFriendById from "../../../../services/api-call.service"
import { CONTACTS_URL, DELETE } from "../../../../constants/constants"

function DeleteFriend({ name, id, onClose, refresh }) {

  const deleteFriendButtonClicked = async () => {
    const url = `${CONTACTS_URL}/${id}`;
    try {
      const res = await deletFriendById(url, DELETE);
      if (res.statusText === "OK") {
        refresh();
      }
      else {
        alert("Delete Unsuccessful")
      }
      onClose();
    } catch (err) {
      alert(err);
    }
  }

  return (<div className="delete-friend">
    <div className='message'>
      Do you want to delete {name} from your contacts
    </div>
    <div className='button-container'>
      <button className="cancel" onClick={onClose}>Cancel</button>
      <button className="confirm" onClick={deleteFriendButtonClicked}>Confirm</button>
    </div>
  </div>);
}

export default DeleteFriend;