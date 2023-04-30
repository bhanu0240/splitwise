import React, { useState, useEffect } from "react"
import getContacts from "../../../../services/api-call.service"
import getGrpContact from "../../../../services/api-call.service"
import updateGroup from "../../../../services/api-call.service"
import {
  PUT,
  GET,
  CONTACTS_URL,
  CURRENT_GROUP_CONTACTS,
  REMAINING_CONTACTS,
  PLEASE_ADD_CONTACTS_TO_THE_ACCOUNT,
  PLEASE_ADD_CONTACTS_TO_THIS_GROUP,
  GROUPS_URL,
} from "../../../../constants/constants"
import "./edit-group.component.css"


function EditGroup({ name, id, refresh, onClose }) {

  const [leftItems, setLeftItems] = useState([]);
  const [rightItems, setRightItems] = useState([]);
  const [lSelectedItems, setLSelectedItems] = useState([]);
  const [rSelectedItems, setRSelectedItems] = useState([]);
  const [leftArrowStatus, setLeftArrowStatus] = useState(undefined);
  const [rightArrowStatus, setRightArrowStatus] = useState(undefined);


  useEffect(() => {
    fetchContacts()
  }, []);

  const fetchContacts = async () => {
    const allContacts = await getContacts(CONTACTS_URL, GET);
    const grpContacts = await getGrpContact(`${GROUPS_URL}/${id}`, GET);

    let lsItems = [], rsItems = [];

    allContacts.data.forEach((cn) => {
      let exists = false;
      grpContacts.data.Contacts.forEach((cntct) => {
        if (cn.ContactID === cntct.ContactID) {
          exists = true;
        }
      });

      if (exists === false)
        rsItems.push(cn);
      else
        lsItems.push(cn);

    });

    setLeftItems(lsItems);
    setRightItems(rsItems);

  }


  const handleContactClick = (container, contact) => {

    let items = [];
    if (container === "left") {
      let index = lSelectedItems.indexOf(contact.ContactID);

      if (index >= 0) {
        items = [...lSelectedItems];
        items.splice(index, 1);
      } else {
        items = [contact.ContactID, ...lSelectedItems];
      }
      if (items.length > 0) {
        setRightArrowStatus("active");
        setLeftArrowStatus(undefined);
      } else {
        setRightArrowStatus(undefined);
      }

      setLSelectedItems(items);
    } else {
      let index = rSelectedItems.indexOf(contact.ContactID);

      if (index >= 0) {
        items = [...rSelectedItems];
        items.splice(index, 1);
      } else {
        items = [contact.ContactID, ...rSelectedItems];
      }
      if (items.length > 0 && !rightArrowStatus) {
        setLeftArrowStatus("active");
      } else {
        setLeftArrowStatus(undefined);
      }
      setRSelectedItems(items);

    }

  }

  const renderItems = (items, container) => {
    return <div className={`${container}-items`}>
      {
        items.length > 0 ?
          items.map((contact) => {

            const selected = container === "left" ? lSelectedItems.includes(contact.ContactID) ?
              "selected" : null : rSelectedItems.includes(contact.ContactID) ? "selected" : undefined

            return (
              <div
                className={`contact-item ${selected}`}
                key={contact.ContactID}
                onClick={() => handleContactClick(container, contact)}
              >
                {contact.Name}

              </div>)
          }) :
          <div
            className="empty-contacts">
            {container === "left" ? PLEASE_ADD_CONTACTS_TO_THIS_GROUP : PLEASE_ADD_CONTACTS_TO_THE_ACCOUNT}
          </div>
      }
    </div>;
  }

  const handleRightArrowClick = () => {
    let updatedLeftContacts = [], selectedLeftContacts = [];
    leftItems.forEach((cn) => {
      if (lSelectedItems.includes(cn.ContactID)) {
        selectedLeftContacts.push(cn);
      } else {
        updatedLeftContacts.push(cn);
      }
    });

    setLeftItems(updatedLeftContacts);
    setLSelectedItems([]);
    setRightItems([...selectedLeftContacts, ...rightItems]);
    setRightArrowStatus(undefined);
    if (rSelectedItems.length > 0) {
      setLeftArrowStatus("active");
    }
  }

  const handleLeftArrowClick = () => {
    let updatedRightContacts = [], selectedRightContacts = [];
    rightItems.forEach((cn) => {
      if (rSelectedItems.includes(cn.ContactID)) {
        selectedRightContacts.push(cn);
      } else {
        updatedRightContacts.push(cn);
      }
    });

    setRightItems(updatedRightContacts);
    setRSelectedItems([]);
    setLeftItems([...selectedRightContacts, ...leftItems]);
    setLeftArrowStatus(undefined);
  }

  const handleEditGroup = async () => {

    const updatedContactIDs = leftItems.map((cn) => cn.ContactID);

    let payload = {
      "Name": name,
      "ContactIDs": updatedContactIDs
    };


    const url = `${GROUPS_URL}/${id}`;
    const res = await updateGroup(url, PUT, payload);

    if (res.statusText === "Accepted") {
      onClose();
      refresh();
    } else {
      alert("Updating group failed");
    }
  }


  return (
    <div className="edit-grp-container">
      <div className="edit-contacts-container">

        <div className="left-items-container">
          <div className="contacts-title">{CURRENT_GROUP_CONTACTS} </div>
          {renderItems(leftItems, "left")}
        </div>

        <div className={"arrow-container"}>
          <div className={`left-arrow ${leftArrowStatus}`} onClick={handleLeftArrowClick}>
            {'<'}
          </div>
          <div className={`right-arrow ${rightArrowStatus}`} onClick={handleRightArrowClick}>
            {'>'}
          </div>
        </div>

        <div className="right-items-container">
          <div className="contacts-title">{REMAINING_CONTACTS} </div>
          {renderItems(rightItems, "right")}
        </div>
      </div>
      <div className="btn-container">
        <button onClick={handleEditGroup}>
          Edit Group
        </button>

      </div>
    </div>
  )
}

export default EditGroup