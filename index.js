require('electron-titlebar')
const electron = require('electron')
const {dialog} = require('electron').remote;
const fs = require('fs');

if (process.platform === 'darwin') {
  document.getElementById('')
}

function saveFile(content) {
  dialog.showSaveDialog((fileName) => {
    if (fileName === undefined){
        console.log("You didn't save the file");
        return;
    }

    // fileName is a string that contains the path and filename created in the save file dialog.
    fs.writeFile(fileName, content, (err) => {
        if (err) {
            alert("An error ocurred creating the file "+ err.message)
        }
        document.getElementsByTagName('title')[0].innerHTML = fileName;
        document.getElementById('title').innerHTML = fileName;
    });
});
}
