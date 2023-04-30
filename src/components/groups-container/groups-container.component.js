import React, { useEffect, useState } from 'react'
import Fuse from 'fuse.js'
import { createPortal } from 'react-dom';
import AddGroup from './add-group/add-group.component';
import Group from './group/group.component'
import SearchComponent from '../common/search-container/search-container.component';
import getGroups from "../../services/api-call.service"
import GROUP_ADD_ICON from "../../assets/images/add-24.png"
import { DEFAULT_PROFILE_ICON_HASH, GROUPS_LIST_HEADING, GET, GROUPS_URL, NO_GROUPS_FOUND, SEARCH_GROUP } from "../../constants/constants"
import "./groups-container.component.css"


export default function GroupsContainer() {

  const [showAddGroup, setShowAddGroup] = useState(false);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetchGroupList();
  }, [])


  const toggleAddGroupModal = () => {
    setShowAddGroup(!showAddGroup);
  }


  const fetchGroupList = async () => {
    const response = await getGroups(GROUPS_URL, GET);
    if (response.statusText === "OK")
      setGroups(response.data);
    else
      alert("Fetching Groups Failed");
  }

  const renderGroupsList = (groupsResponse) => {
    if (groupsResponse.length <= 0) {
      return <div className='no-groups'> {NO_GROUPS_FOUND}</div>
    }

    return <>
      {groupsResponse.map((grp) => (
        <Group
          name={grp.Name}
          id={grp.GroupID}
          imagePath={grp.ImagePath || DEFAULT_PROFILE_ICON_HASH}
          key={grp.GroupID}
          refresh={fetchGroupList}
        />
      ))}
    </>
  }

  const handleSearchGroups = (searchValue) => {
    if (searchValue) {
      const fuse = new Fuse(groups, {
        keys: ["Name", "PhoneNum"]
      });
      const result = fuse.search(searchValue);

      const resultItems = result.map((group) => group.item)
      setGroups(resultItems);
    } else {
      fetchGroupList();
    }
  }


  return (
    <div className='groups-container'>
      {
        createPortal(<AddGroup
          open={showAddGroup}
          onClose={toggleAddGroupModal}
          refresh={fetchGroupList}
        />, document.body)
      }

      <div className='groups-heading'>
        <div className="groups-list-heading" onClick={toggleAddGroupModal}>
          {GROUPS_LIST_HEADING}
          <span className='group-add-logo'>
            <img src={GROUP_ADD_ICON} alt="Edit Icon" />
          </span>
        </div>
        <SearchComponent 
          filterData={handleSearchGroups} 
          className="group-search" 
          placeholder={SEARCH_GROUP}
        />
      </div>

      {renderGroupsList(groups)}
    </div>
  )
}
