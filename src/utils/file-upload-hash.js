import computeFileStatus from "../services/api-call.service";
import addNewFiles from "../services/api-call.service";
import { POST, BASE_URL, FILES_URL } from "../constants/constants";


export const handleFiles = async (files) => {
  const fileHashes = [];
  const imageDictonary = {};


  for (const file of files) {
    const reader = new FileReader();
    let sha256result;

    // Wrap the FileReader.onload event in a promise
    const onloadPromise = new Promise((resolve) => {
      reader.onload = () => {
        const fileResult = reader.result;
        crypto.subtle.digest('SHA-256', fileResult).then((hash) => {
          sha256result = hex(hash);
          resolve(); // resolve the promise once the hash is calculated
        });
      };
    });

    reader.readAsArrayBuffer(file);

    await onloadPromise;
    imageDictonary[sha256result] = file;
    fileHashes.push(sha256result);
  }

  let response = {
    "fileHashes": fileHashes,
    "imageDictonary": imageDictonary
  }
  return response;
};


function hex(buffer) {
  var hexCodes = [];
  var view = new DataView(buffer);
  for (var i = 0; i < view.byteLength; i += 4) {

    var value = view.getUint32(i)

    var stringValue = value.toString(16)

    var padding = '00000000'
    var paddedValue = (padding + stringValue).slice(-padding.length)
    hexCodes.push(paddedValue);
  }

  return hexCodes.join("");
}

export const handleFileSubmission = async (fileList) => {

  try {
    const computedImagesHash = await handleFiles(fileList);

    const url = `${BASE_URL}file-exists`;
    const getFileStatus = await computeFileStatus(url, POST, computedImagesHash.fileHashes);

    let files = [];
    let keyEntries = Object.entries(getFileStatus.data);

    let filteredData = keyEntries.filter(([key, value]) => !value)

    filteredData.forEach(([key, value]) => {
      files.push(computedImagesHash.imageDictonary[key])
    });

    if (files.length > 0) {
      const formData = new FormData();

      // Update the formData object
      for (let i = 0; i < fileList.length; i++)
        formData.append(
          "files",
          fileList[i],
          fileList[i].name
        );
      const addFilesResponse = await addNewFiles(FILES_URL, POST, formData);
      if (addFilesResponse.status !== 201) {
        console.log("Error while adding files");
      }
    }
    return computedImagesHash;
  } catch (err) {
    console.log(err);
  }
}
