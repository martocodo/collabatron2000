// Controller for Snapshot Actions
var SnapshotController = () => {
  var snapshotsAlbum = document.getElementById('snapshots');
  var btnSaveSnapshot = document.getElementById('btnSaveSnapshot');
  btnSaveSnapshot.addEventListener("click", (e) => {
    // notifier.success('Snaphot captured!');
    notifier.success('Snapshot saved to album!');
    var dataUrl = canvas.toDataURL();
    var newSnapshot = document.createElement('img');
    newSnapshot.setAttribute('class', "snapshot");
    newSnapshot.setAttribute('width', 150);
    newSnapshot.setAttribute('height', 100);
    newSnapshot.setAttribute('src', dataUrl);
    snapshotsAlbum.appendChild(newSnapshot);
  })
};
