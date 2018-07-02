require('electron-titlebar')
const {app,BrowserWindow,ipcRenderer} = require('electron')
const {dialog} = require('electron').remote;
const fs = require('fs');

window.onload = () => {
  initEditor();
}

// MARKDOWN REGEX

function manageClass(regex, cl, element) {
  if (element.innerHTML.search(regex) != -1) element.classList.add(cl);
  else if (element.classList.contains(cl)) element.classList.remove(cl);
}

function applySelectionFunc(pnode, regex, command) {
  let node = pnode.firstChild;
  let text = pnode.innerHTML;
  let match;
  while (match = regex.exec(text)) {
    console.log(match);

    if (match == null) return;

    let start = (regex.lastIndex - match[0].length + 2);
    let end = (regex.lastIndex - 2);

    let range = document.createRange();
    let sel = window.getSelection();
    let original = sel.getRangeAt(0);

    range.setStart(node, start);
    range.setEnd(pnode.lastChild, end);
    sel.removeAllRanges();
    sel.addRange(range);
    document.execCommand(command,false,false);
    sel.removeAllRanges();
    sel.addRange(original);
  }
}

function markdownEngine(editor, opts) {
  editor.querySelectorAll("p").forEach((p) => {
    manageClass(/^#[^#]+/g, "h1", p);
    manageClass(/^##[^#]+/g, "h2", p);
    manageClass(/^###[^#]+/g, "h3", p);
    manageClass(/^####[^#]+/g, "h4", p);
    manageClass(/^#####[^#]+/g, "h5", p);
    manageClass(/^######[^#]+/g, "h6", p);
    manageClass(/^[\+\-\*] /g, "ul", p);
    // applySelectionFunc(p,/(?:^|[^>])\*\*[^<>].+[^<>]\*\*/g, "bold");
    // if (p.innerHTML.search(/\*\*/g) != -1) document.execCommand('bold', false, false );
  });
}

function initEditor() {
  let editor = document.getElementById('editor');
  markdownEngine(editor);
  editor.addEventListener('input', function(ev) {
    let keys = [];
    if (ev.keyCode == '13') {
      document.execCommand('formatBlock', false, 'p');
      return false;
    }
    markdownEngine(editor, keys);
  }, false);
}

// FILE MANAGEMENT

var current_file = "";
function saveFile() {
let writable_content = document.getElementById('editor').innerHTML
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/<br>/g, '\u000a')
    .replace(/<\/p>/g, '\u000a')
    .replace(/<p .+>/g, '')
    .replace(/&nbsp;/g, '\u0020');
  if (current_file === "") {
    dialog.showSaveDialog({
      filters: [
        {name: 'Markdown', extensions: ['md']},
        {name: 'Text', extensions: ['txt']},
        {name: 'All Files', extensions: ['*']}
      ]
    }, (fileName) => {
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

          app.addRecentDocument(fileName);
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
      document.getElementById('editor').innerHTML = "<p>" + data
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/\u000a/g, '<p>')
        .replace(/\u0020/g, '&nbsp;');
      initEditor();
    });
    document.getElementsByTagName('title')[0].innerHTML = filePath;
    document.getElementById('title').innerHTML = filePath;
    current_file = filePath;

    app.addRecentDocument(filePath);
  });
}
