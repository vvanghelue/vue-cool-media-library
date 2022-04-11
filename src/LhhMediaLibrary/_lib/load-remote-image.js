/* eslint-disable */
export default function loadRemoteImage(url) {
  return new Promise((resolve) => {
    const img = new Image();
    const c = document.createElement('canvas');
    const ctx = c.getContext('2d');

    img.onload = function () {
      c.width = this.naturalWidth; // update canvas size to match image
      c.height = this.naturalHeight;
      ctx.drawImage(this, 0, 0); // draw in image
      c.toBlob(
        (blob) => {
          // get content as JPEG blob
          // here the image is a blob
          resolve(blob);
        },
        'image/png',
        1,
      );
    };
    img.crossOrigin = 'anonymous'; // if from different origin
    img.src = url;
  });
}
