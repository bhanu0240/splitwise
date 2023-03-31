import axios from "axios"

export const computeFileStatus = async (payload) => {

  try {
    let res = await axios.post(`http://192.168.1.9:3000/v1/file-exists`, payload);
    return res
  } catch (err) {
    return err;
  }

}

export const addNewFiles = async (fileList) => {
  try {

    const formData = new FormData();

    // Update the formData object
    for (let i = 0; i < fileList.length; i++)
      formData.append(
        "files",
        fileList[i],
        fileList[i].name
      );

    let res = await axios.post(`http://192.168.1.9:3000/v1/files`, formData);
    return res.status;
  } catch (err) {
    console.log(err);
    return err;
  }

}