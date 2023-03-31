import React, { useState } from 'react';
import { handleFiles } from '../../../utils/compute-image-hash';
import { computeFileStatus, addNewFiles } from "../../../services/image-hash.service"

const FileUploadComponent = ({ fileTypes, fileCount }) => {
  const [fileList, setFileList] = useState([]);

  const acceptTypes = fileTypes.map(type => `.${type}`).join(',');

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFileList(files);
  };

  const multiple = (fileCount === "single") ? false : true;


  const handleFileSubmit = async () => {

    const computedImagesHash = await handleFiles(fileList);

    const getImageStatus = await computeFileStatus(computedImagesHash.fileHashes);

    let files = [];
    let keyEntries = Object.entries(getImageStatus.data);

    let filteredData = keyEntries.filter(([key, value]) => !value)

    filteredData.forEach(([key, value]) => {
      files.push(computedImagesHash.imageDictonary[key])
    });

    if (files.length > 0) {
      const addFilesResponse = await addNewFiles(files);
      if (addFilesResponse === 200) {
        setFileList([]);
      } else {
        console.log("Error while adding Images")
      }
    }
  }

  return (<>
    <input type="file" multiple={multiple} accept={acceptTypes} onChange={(event) => handleFileUpload(event)} />
    <button onClick={() => { handleFileSubmit() }}>Upload</button>
  </>
  );
};

export default FileUploadComponent;
