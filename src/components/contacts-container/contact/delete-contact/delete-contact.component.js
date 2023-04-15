import deletContactById from "../../../../services/api-call.service"
import { CONTACTS_URL, DELETE } from "../../../../constants/constants"

function DeleteContact({ name, id, onClose, refresh }) {

  const deleteContactButtonClicked = async () => {
    const url = `${CONTACTS_URL}/${id}`;
    try {
      const res = await deletContactById(url, DELETE);
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

  return (<div className="delete-contact">
    <div className='message'>
      Do you want to delete {name} from your contacts
    </div>
    <div className='button-container'>
      <button className="cancel" onClick={onClose}>Cancel</button>
      <button className="confirm" onClick={deleteContactButtonClicked}>Confirm</button>
    </div>
  </div>);
}

export default DeleteContact;