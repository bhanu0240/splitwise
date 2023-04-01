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

    // Wait for the promise to resolve before storing the hash in the fileHashes array
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

// this function was taken from https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#Example
function hex(buffer) {
  var hexCodes = [];
  var view = new DataView(buffer);
  for (var i = 0; i < view.byteLength; i += 4) {
    // Using getUint32 reduces the number of iterations needed (we process 4 bytes each time)
    var value = view.getUint32(i)
    // toString(16) will give the hex representation of the number without padding
    var stringValue = value.toString(16)
    // We use concatenation and slice for padding
    var padding = '00000000'
    var paddedValue = (padding + stringValue).slice(-padding.length)
    hexCodes.push(paddedValue);
  }

  // Join all the hex strings into one
  return hexCodes.join("");
}
