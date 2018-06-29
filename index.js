require('electron-titlebar')
const electron = require('electron')
const {dialog} = require('electron').remote;
const fs = require('fs');

if (process.platform === 'darwin') {
  document.getElementById('')
}

var current_file = "";
function saveFile() {
let writable_content = document.getElementById('editor').innerHTML
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');
  if (current_file === "") {
    dialog.showSaveDialog((fileName) => {
      if (fileName === undefined){
          return;
      }



      // fileName is a string that contains the path and filename created in the save file dialog.
      fs.writeFile(fileName, writable_content, (err) => {
          if (err) {
              alert("An error occurred creating the file "+ err.message)
          }
          document.getElementsByTagName('title')[0].innerHTML = fileName;
          document.getElementById('title').innerHTML = fileName;
          current_file = fileName;
      });
    });
  }
  else {
    fs.writeFile(current_file, writable_content, (err) => {
        if (err) {
            alert("An error occurred saving the file "+ err.message)
        }
    });
  }
}

function openFile() {
  dialog.showOpenDialog((filePaths) => {
      if (filePaths === undefined) {
        return;
      }

      var filePath = filePaths[0];

      fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) alert('Error reading the file: ' + err);
        document.getElementById('editor').innerHTML = data
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      });
      document.getElementsByTagName('title')[0].innerHTML = filePath;
      document.getElementById('title').innerHTML = filePath;
      current_file = filePath;
    });
}
