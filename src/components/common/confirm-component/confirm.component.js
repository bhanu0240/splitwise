import deletContactById from "../../../services/api-call.service"
import { DELETE } from "../../../constants/constants"

function Confirm({ message, onClose, refresh,url}) {

  const deleteContactButtonClicked = async () => {
    try {
      const res = await deletContactById(url, DELETE);
      if (res.status === 200) {
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
      {message}
    </div>
    <div className='button-container'>
      <button className="cancel" onClick={onClose}>Cancel</button>
      <button className="confirm" onClick={deleteContactButtonClicked}>Confirm</button>
    </div>
  </div>);
}

export default Confirm;