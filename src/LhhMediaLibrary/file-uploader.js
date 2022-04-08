export default function uploadFile({
  method = 'POST',
  url,
  form,
  onUploadProgress = () => {},
  onUploadResponse = () => {},
}) {
  let formData = new FormData();
  for (const field of Object.keys(form)) {
    formData.append(field, form[field]);
  }
  var xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  xhr.upload.onprogress = function (e) {
    const percentComplete = Math.ceil((e.loaded / e.total) * 100);
    onUploadProgress(percentComplete);
  };
  xhr.onload = function () {
    if (xhr.status == 200) {
      //resolve(JSON.parse(xhr.responseText));
      onUploadResponse(xhr.responseText);
    }
  };
  xhr.send(formData);
}
