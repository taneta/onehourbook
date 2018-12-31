
function loadChapters() {
  fetch('test.txt').catch(console.error).then((r) => {
    r.text().then(console.log);
  });
}

window.onload = loadChapters;