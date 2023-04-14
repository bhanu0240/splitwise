import React, { useState } from "react"
import DataTable from "../../common/data-table/data-table.component";
import ModalContainer from "../../common/modal-container/modal-container.component";
import FileUploadComponent from "../../common/file-upload/file-upload.component"
import "./add-friend.component.css"
import TabNavItem from "../../common/tabs/tab-nav-item/tab-nav.component";
import TabContent from "../../common/tabs/tab-content/tab-content.component";

function AddFriend({ onClose, open, refresh }) {

  const [selectedTab, setSelectedTab] = useState("manual");

  const handleTabClick = (e) => {
    setSelectedTab(e.target.id);
  }

  return (
    <ModalContainer open={open} title={"Add Contacts"} onClose={onClose} className="add-contact">
      <div className="add-contact-container">
        <div className="tab-container">
          <TabNavItem
            title="Manual"
            id="manual"
            className={selectedTab === "manual" ? "active tab" : "tab"}
            selectedTab={selectedTab}
            onClick={handleTabClick}
          />
          <TabNavItem
            title="VCF"
            id="vcf"
            className={selectedTab === "vcf" ? "active tab" : "tab"}
            selectedTab={selectedTab}
            onClick={handleTabClick}
          />
        </div>
        <div className="tab-content">
          <TabContent id="manual" selectedTab={selectedTab}>
            <DataTable onClose={onClose} selectedTab={selectedTab} refresh={refresh} />
          </TabContent>
          <TabContent id="vcf" selectedTab={selectedTab}>
            <FileUploadComponent fileTypes={["vcf"]} fileCount={"single"} onClose={onClose} selectedtab={selectedTab} refresh={refresh} />
          </TabContent>
        </div>
      </div>
    </ModalContainer>
  )

}

export default AddFriend;