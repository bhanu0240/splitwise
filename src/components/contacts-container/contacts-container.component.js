import React, { useEffect, useState } from 'react'
import Fuse from 'fuse.js'
import { createPortal } from 'react-dom';
import AddContact from './add-contact/add-contact.component';
import Contact from './contact/contact.component'
import SearchComponent from '../common/search-container/search-container.component';
import getContacts from "../../services/api-call.service"
import CONTACT_ADD_ICON from "../../assets/images/contact-add-24.png"
import { DEFAULT_PROFILE_ICON_HASH, CONTACTS_LIST_HEADING, GET, CONTACTS_URL, NO_CONTACTS_FOUND } from "../../constants/constants"
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
      return <div className='no-contacts'> {NO_CONTACTS_FOUND}</div>
    }

    return <>
      {contactsResponse.map((cntct) => (
        <Contact
          name={cntct.Name}
          id={cntct.ContactID}
          phoneNum={cntct.PhoneNum}
          email={cntct.Email}
          imagePath={cntct.ImagePath || DEFAULT_PROFILE_ICON_HASH}
          key={cntct.ContactID}
          refresh={fetchContactList}
        />
      ))}
    </>
  }

  const handleSearchContacts = (searchValue) => {
    if (searchValue) {
      const fuse = new Fuse(contacts, {
        keys: ["Name", "PhoneNum"]
      });
      const result = fuse.search(searchValue);

      const resultItems = result.map((contact) => contact.item)
      setContacts(resultItems);
    } else {
      fetchContactList();
    }
  }


  return (
    <div className='contacts-container'>
      {
        createPortal(<AddContact open={showAddContact} onClose={toggleAddContactModal} refresh={fetchContactList} />, document.body)
      }

      <div className='contacts-heading'>
        <div className="contacts-list-heading" onClick={toggleAddContactModal}>
          {CONTACTS_LIST_HEADING}
          <span className='contact-add-logo'>
            <img src={CONTACT_ADD_ICON} alt="Edit Icon" />
          </span>
        </div>
        <SearchComponent filterData={handleSearchContacts} className="contact-search" />

      </div>

      {renderContactsList(contacts)}
    </div>
  )
}
