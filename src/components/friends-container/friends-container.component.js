import React, { useState } from 'react'
import { createPortal } from 'react-dom';
import "./friends-container.component.css"
import AddFriend from './add-friend/add-friend.component';
import Friend from './friend/friend.component'
import GetFriendList from "../../services/apicall"
import Friend_ADD_ICON from "../../assets/images/friend-add-24.png"
import { FRIENDS_LIST_HEADING, GET, GET_FRIENDS_URL } from "../../constants/constants"



//can make this FriendsContainer use for groupsContainer
export default function FriendsContainer() {

  const [showAddFriend, setShowAddFriend] = useState(false);

  const toggleAddFriendModal = () => {
    setShowAddFriend(!showAddFriend);
  }

  const renderFriendsList = (friendList) => (
    <>
      {friendList.map((frnd) => (
        <Friend
          name={frnd.Name}
          id={frnd.ContactID}
          phoneNum={frnd.PhoneNum}
          email={frnd.Email}
          key={frnd.ContactID}
        />
      ))}
    </>
  )
  return (
    <div className='friends-container'>
      {
        showAddFriend && createPortal(<AddFriend onClose={toggleAddFriendModal} />, document.body)
      }

      <div className="friends-list-heading" onClick={toggleAddFriendModal}>
        {FRIENDS_LIST_HEADING}
        <span className='friend-add-logo'>
          <img src={Friend_ADD_ICON} alt="Edit Icon" />
        </span>
      </div>
      <GetFriendList
        method={GET}
        url={GET_FRIENDS_URL}
        render={renderFriendsList}
      />
    </div>
  )
}
