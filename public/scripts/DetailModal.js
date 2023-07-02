function openEventDetailModal(info, timeZone) {
    console.log(JSON.stringify(info.event))
    var modalContent = document.getElementById("eventDetailModalContent")

    // Title
    var title = document.createElement("H1")
    title.innerText = info.event.title
    title.style.fontWeight = "bold"
    modalContent.append(title)

    // Category
    if (info.event.extendedProps.hasOwnProperty("category")) {
        var category = document.createElement("p")
        category.innerText = info.event.extendedProps["category"]
        category.style.fontStyle = "italic"
        modalContent.append(category)
    }

    // Description
    if (info.event.extendedProps.hasOwnProperty("description")) {
        var category = document.createElement("p")
        category.innerText = info.event.extendedProps["description"]
        modalContent.append(category)
    }

    // Time
    var timeLabel = document.createElement("p")
    timeLabel.innerText = "When:"
    timeLabel.style.display = "inline-block"
    timeLabel.style.fontWeight = "bold"
    timeLabel.style.marginRight = "5px"
    modalContent.append(timeLabel)

    var start = moment(info.event["start"])
    var end = moment(info.event["end"])
    var allDay = info.event["allDay"]

    if (allDay) {
        var timeMessage = start.format("dddd M/D/YY")
        
        if (end.isValid()) {
            timeMessage += ` to ${end.format("dddd M/D/YY")}`
        }
    } else {
        var timeMessage = start.format(`dddd M/D/YY h:mm A [${timeZone}]`)

        if (end.isValid()) {
            
            if (start.isSame(end, "day")) {
                timeMessage += ` to ${end.format(`h:mm A [${timeZone}]`)}`
            } else {
                timeMessage += ` to ${end.format(`dddd M/D/YY h:mm A [${timeZone}]`)}`
            }
        }
    }

    if (info.event.extendedProps.hasOwnProperty("recurringDay")) {
        timeMessage += ` (occurs every ${info.event.extendedProps["recurringDay"]})`
    }
    
    var time = document.createElement("p")
    time.innerText = timeMessage
    time.style.display = "inline-block"
    modalContent.append(time)

    // Location
    if (info.event.extendedProps.hasOwnProperty("location")) {
        modalContent.append(document.createElement("div"))
        
        var locationLabel = document.createElement("p")
        locationLabel.innerText = "Where:"
        locationLabel.style.display = "inline-block"
        locationLabel.style.fontWeight = "bold"
        locationLabel.style.marginRight = "5px"
        modalContent.append(locationLabel)

        var location = document.createElement("p")
        location.innerText = info.event.extendedProps["location"]
        location.style.display = "inline-block"
        modalContent.append(location)
    }

    var modal = document.getElementById("eventDetailModal")
    modal.style.display = "block"
}

function closeEventDetailModal() {
    
    // Remove all elements except the first (the close button)
    var modalContent = document.getElementById("eventDetailModalContent")
    var children = modalContent.children
    while (children.length > 1){
        modalContent.removeChild(children[1])
    }
    
    // "Hide" the modal
    var modal = document.getElementById("eventDetailModal")
    modal.style.display = "none"
}

function potentiallyCloseEventDetailModal(event) {
    if (event.target == this)  closeEventDetailModal()
}