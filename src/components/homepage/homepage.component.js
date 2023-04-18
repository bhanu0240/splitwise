import ContactsContainer from "../contacts-container/contacts-container.component"
import GroupsContainer from "../groups-container/groups-container.component"
import FileUploadComponent from "../common/file-upload/file-upload.component"
import "./homepage.component.css"

export default function HomePage() {

    return (
        <main className="main-content">
            <div className="left-container">
                <ContactsContainer />
                <GroupsContainer/>
            </div>
            <div className="middle-container">
                <FileUploadComponent fileTypes={["img", "jpeg", "jpg", "png", "webp"]} fileCount={"multiple"} />
            </div>
            <div className="right-container">

            </div>
        </main>)
}

