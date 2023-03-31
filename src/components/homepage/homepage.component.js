import "./homepage.component.css"
import FriendsContainer from "../friends-container/friends-container.component"
import FileUploadComponent from "../common/file-upload/file-upload.component"



export default function HomePage() {

    const handleImageChange = (event) => {
        this.setState(event.target.files)
    }

    return (
        <main className="main-content">
            <div className="left-container">
                <FriendsContainer />
            </div>
            <div className="middle-container">
                <FileUploadComponent fileTypes={["img", "jpeg", "jpg", "png", "webp"]} fileCount={"multiple"} />
            </div>
            <div className="right-container">

            </div>
        </main>)
}

