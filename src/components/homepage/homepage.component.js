import "./homepage.component.css"
import ContactsContainer from "../contacts-container/contacts-container.component"
import FileUploadComponent from "../common/file-upload/file-upload.component"



export default function HomePage() {

    return (
        <main className="main-content">
            <div className="left-container">
                <ContactsContainer />
            </div>
            <div className="middle-container">
                <FileUploadComponent fileTypes={["img", "jpeg", "jpg", "png", "webp"]} fileCount={"multiple"} />
            </div>
            <div className="right-container">

            </div>
        </main>)
}

