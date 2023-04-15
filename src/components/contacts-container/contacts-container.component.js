import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom';
import AddContact from './add-contact/add-contact.component';
import Contact from './contact/contact.component'
import SearchComponent from '../common/search-container/search-container.component';
import getContacts from "../../services/api-call.service"
import CONTACT_ADD_ICON from "../../assets/images/contact-add-24.png"
import { DEFAULT_PROFILE_ICON_HASH, CONTACTS_LIST_HEADING, GET, CONTACTS_URL } from "../../constants/constants"
import "./contacts-container.component.css"



export default function ContactsContainer() {

  const [showAddContact, setShowAddContact] = useState(false);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    fetchContactList();
  }, [])


  const toggleAddContactModal = () => {
    setShowAddContact(!showAddContact);
  }


  const fetchContactList = async () => {
    const response = await getContacts(CONTACTS_URL, GET);
    if (response.statusText === "OK")
      setContacts(response.data);
  }

  const renderContactsList = (contactsResponse) => {
    if (contactsResponse.length <= 0) {
      return <div className='no-contacts'> Please Add Contacts</div>
    }

    return <>
      {contactsResponse.map((frnd) => (
        <Contact
          name={frnd.Name}
          id={frnd.ContactID}
          phoneNum={frnd.PhoneNum}
          email={frnd.Email}
          imagePath={frnd.ImagePath || DEFAULT_PROFILE_ICON_HASH}
          key={frnd.ContactID}
          refresh={fetchContactList}
        />
      ))}
    </>
  }

  const handleFilter=(searchValue)=>{


  }


  return (
    <div className='contacts-container'>
      {
        createPortal(<AddContact open={showAddContact} onClose={toggleAddContactModal} refresh={fetchContactList} />, document.body)
      }

      <div className="contacts-list-heading" onClick={toggleAddContactModal}>
        {CONTACTS_LIST_HEADING}
        <span className='contact-add-logo'>
          <img src={CONTACT_ADD_ICON} alt="Edit Icon" />
        </span>
      </div>
      <SearchComponent filterData={handleFilter} className="contact-search" />
      {renderContactsList(contacts)}
    </div>
  )
}
