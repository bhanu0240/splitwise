import React, { useEffect, useState } from "react"
import Fuse from "fuse.js";
import ModalContainer from "../../common/modal-container/modal-container.component";
import Search from "../../common/search-container/search-container.component";
import {
  ADD_GROUP,
  CONTACTS_URL,
  FILES_URL,
  GROUPS_URL,
  GET,
  POST,
  DEFAULT_PROFILE_ICON_HASH,
  ENTER_GROUP_NAME,
  SEARCH_CONTACT,
  NO_CONTACTS_FOUND,
  
} from "../../../constants/constants";
import getContacts from "./../../../services/api-call.service"
import createGroup from "./../../../services/api-call.service"
import "./add-group.component.css"



function AddGroupComponent({ open, onClose, refresh }) {
  const [grpName,setGrpName] = useState("");
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [disabledBtn,setDisabledBtn] = useState(true);

  useEffect(() => {
    fetchContacts()
  }, [])

  const renderContacts = () => {
    if (contacts.length <= 0) {
      return <div className="no-contacts-found">{NO_CONTACTS_FOUND}</div>
    }
    else
      return (
        contacts.map((cnc) => {
          const imagePath = cnc.ImagePath || DEFAULT_PROFILE_ICON_HASH;
          const contactSelected = selectedContacts.includes(cnc.ContactID) ? "selected" : "";
          return (
            <div className={`grp-cnt ${contactSelected}`} key={cnc.ContactID} id={cnc.ContactID}>
              <div className="profile-icon">
                <img src={`${FILES_URL}/${imagePath}`} alt="Profile Icon" />
              </div>
              <div className="profile-name" title={cnc.Name}>
                {cnc.Name}
              </div>
            </div>
          )
        })
      )

  }


  const fetchContacts = async () => {
    const contactsRes = await getContacts(CONTACTS_URL, GET);
    if (contactsRes.statusText === "OK")
      setContacts(contactsRes.data)
    else {
      setContacts([])
    }
  }

  const handleContactSelect = (e) => {
    const profileCard= e.target.closest(".grp-cnt");
    if(profileCard){
      const selectedContactId = parseInt(profileCard.id);
      const selectedIds = [...selectedContacts];
      const index=selectedIds.indexOf(selectedContactId);
      if(index>=0){
        selectedIds.splice(index,1);
      }
      else
        selectedIds.push(selectedContactId)
      if(selectedIds.length>0&&grpName.length>0)
        setDisabledBtn(false);
      else
        setDisabledBtn(true);
      setSelectedContacts(selectedIds);
    }
  }

  const handleGroupName =(grpName)=>{
    setGrpName(grpName);
    if(grpName.length>0 && selectedContacts.length>0)
    setDisabledBtn(false);
    else
     setDisabledBtn(true);

  }
  const handleFilterContacts=(searchValue)=>{
    if (searchValue) {
      const fuse = new Fuse(contacts, {
        keys: ["Name"]
      });
      const result = fuse.search(searchValue);

      const resultItems = result.map((contact) => contact.item)
      setContacts(resultItems);
    } else {
      fetchContacts();
    }
  }

  const handleCreateGroup =async ()=>{
    setDisabledBtn(true);
    const payload={
      "Name":grpName,
      "contactIDs":selectedContacts
    }
    const createGrpRes = await createGroup(GROUPS_URL,POST,payload);
    setSelectedContacts([]);
    setGrpName("");
    if(createGrpRes.statusText==="Created")
    {
      refresh();
    }
    onClose();
  
  }

  return (
    <ModalContainer open={open} title={ADD_GROUP} onClose={onClose} className="add-contact">
      <div className="add-group-container">
        <div className="field-container">
          <label htmlFor="grp-name" className="grp-label">Group Name</label>
          <input
            type="text"
            id="grp-name"
            placeholder={ENTER_GROUP_NAME}
            onChange={(e)=>handleGroupName(e.target.value)}
            className={`add-group-field`}
          />
        </div>


        <div className="contact-container">
          <div className="select-contacts-title">Select Contacts</div>
          <Search className="grp-cnt-search" filterData={handleFilterContacts} placeholder={SEARCH_CONTACT}/>
          <div className="contact-list" onClick={handleContactSelect}>
            {
              renderContacts()
            }
          </div>
        </div>
        <div className="btn-container crt-grp" onClick={handleCreateGroup}>
          <button disabled={disabledBtn}>Create Group</button>
        </div>
      </div>
    </ModalContainer>

  )
}

export default AddGroupComponent;