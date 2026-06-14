function showUpdateToast() {

  const banner =
    document.getElementById("update-banner");

  banner.classList.remove("hidden");
}

document
  .getElementById("refresh-app")
  .addEventListener("click", () => {

    window.location.reload();
  });
