document.onkeyup = keyUp

function keyUp(event){ 
    if (event.keyCode == 27) escape()
}

function escape(){
    closeEditModal()
    closeEventDetailModal()
}