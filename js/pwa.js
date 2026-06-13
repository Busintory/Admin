function showUpdateToast() {

  const banner =
    document.getElementById("update-banner");

  banner.hidden = false;
}

document
  .getElementById("refresh-app")
  .addEventListener("click", () => {

    window.location.reload();
  });