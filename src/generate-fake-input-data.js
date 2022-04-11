function pickRandomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}
function generateFile() {
  const { url, mimeType } = pickRandomItem([
    {
      url: 'https://lhh-medias.s3.eu-west-3.amazonaws.com/qKxXhLccub.mp4',
      mimeType: 'media/mp4',
    },
    {
      url: 'https://lhh-medias.s3.eu-west-3.amazonaws.com/pdau3V0Hz0.pdf',
      mimeType: 'application/pdf',
    },
    {
      url: 'https://s3.eu-west-3.amazonaws.com/lhh-medias/VqdBEOQMF7.jpg',
      mimeType: 'image/jpeg',
    },
  ]);

  return {
    type: 'file',
    id: Math.floor(Math.random() * Math.pow(10, 10)),
    name: 'My super file ' + pickRandomItem([...Array(999).keys()]),
    url,
    mimeType,
    /*name: pickRandomItem([
      'Header CASP.jpg',
      'Header CASP Demo (1).jpg',
      'Footer CASP.jpg',
    ]),*/
    sizeBytes: Math.round(Math.random() * 200000),
  };
}
function generateFolder({ name, children = [] }) {
  return {
    type: 'folder',
    id: Math.floor(Math.random() * Math.pow(10, 10)),
    name: name || 'My Parent Folder ' + pickRandomItem([...Array(999).keys()]),
    children,
  };
}
function generateFakeFileTree({ folder, dephtCursor = 0, maxDepht = 5 }) {
  dephtCursor++;
  if (dephtCursor >= maxDepht) {
    return;
  }
  const countFolder = pickRandomItem([1, 2, 3, 4]);
  for (let i = 0; i < countFolder; i++) {
    const newSubFolder = generateFolder({});
    folder.children.push(newSubFolder);
    generateFakeFileTree({ folder: newSubFolder, dephtCursor, maxDepht });
  }
  const countFiles = pickRandomItem([0, 1, 3, 5, 8, 12, 20]);
  for (let i = 0; i < countFiles; i++) {
    const newSubFile = generateFile();
    folder.children.push(newSubFile);
  }
}

/*
function flattenTree() {
  const flatList = [];

  function addChildren({ parent }) {
    //if (flatList.find()) {
    //  return
    //}
    for (const child of parent.children) {
      addChildren({ parent: child });
    }
  }

  return flatList;
}
*/

const nestedFolder = generateFolder({ name: 'My example folder' });
generateFakeFileTree({
  folder: nestedFolder,
  maxDepht: 4,
});

export default function () {
  let fakeItemsNested = [
    generateFolder({ children: [generateFile(), generateFile()] }),
    generateFolder({ children: [generateFile()] }),
    nestedFolder,
    generateFile(),
    generateFile(),
    generateFile(),
    generateFile(),
    generateFile(),
  ];
  //const fakeFiles = flattenTree(fakeFilesNested);
  const fakeItems = fakeItemsNested;
  //console.log(fakeFiles);
  return fakeItems;
}
