import fs from 'node:fs';

const path = "./file"
const content = "Hello world!"


fs.mkdir(path, (error) => {
  if (error) {
    console.log("Error to create file")
    return;
  }
  console.log("File is created")
});

fs.writeFile("file/Hello.txt", content, (error) => {
  if (error) { 
    console.error("Error to create file")
    return;
  }
  console.log("File is created")
});
