import fs from 'node:fs';

const path = "./file"
const content = "Hello world!"
const errorDir = "Error to create Directory"
const dirCreated = 'Directory is created'
const errorFile = "Error to create file"
const fileCreated = "File is created"
const dirfile = "file/Hello.txt"


fs.mkdir(path, (error) => {
  if (error) {
    console.log(errorDir)
    return;
  }
  console.log(dirCreated)
});

fs.writeFile(dirfile, content, (error) => {
  if (error) { 
    console.error(errorFile)
    return;
  }
  console.log(fileCreated)
});
