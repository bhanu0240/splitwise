import React, { useState, useRef } from 'react';
import { handleFileSubmission } from '../../../utils/file-upload-hash';
import addVCF from "../../../services/api-call.service"
import { POST, VCF_URL } from '../../../constants/constants';
import "./file-upload.component.css"

const FileUploadComponent = ({ fileTypes, fileCount, refresh, onClose }) => {
  const [fileList, setFileList] = useState([]);
  const inputFileRef = useRef(null);

  const acceptTypes = fileTypes.map(type => `.${type}`).join(',');

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFileList(files);
  };

  const multiple = (fileCount === "single") ? false : true;


  const handleFileSubmit = async () => {
    const computedVcfHash = await handleFileSubmission(fileList);

    if (acceptTypes === ".vcf") {
      const url = `${VCF_URL}/${computedVcfHash.fileHashes[0]}`;
      const vcfUpload = await addVCF(url, POST);

      if (vcfUpload.status === 201) {
        if (refresh)
          refresh();
      } else {
        alert("VCF Upload Failed")
      }
      onClose();
    }
    setFileList([]);
    inputFileRef.current.value = null;

  }

  return (<div className="fileUpload-Container">
    <input type="file" multiple={multiple} accept={acceptTypes} onChange={(event) => handleFileUpload(event)} ref={inputFileRef} />
    <button onClick={handleFileSubmit}>Upload</button>
  </div>
  );
};

export default FileUploadComponent;
