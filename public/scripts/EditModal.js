function openEditModal() {
    var modal = document.getElementById("editModal")
    modal.style.display = "block"
}

function closeEditModal() {
    var modal = document.getElementById("editModal")
    modal.style.display = "none"
}

function potentiallyCloseEditModal(event) {
    if (event.target == this)  closeEditModal()
}