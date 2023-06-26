const express = require('express');
const debug = require('debug')('app:apiRouter');
const axios = require('axios').default
const moment = require('moment')

const apiRouter = express.Router();

// Custom Variables
const eventQueryLink = "https://sheets.googleapis.com/v4/spreadsheets/1sLq5aMdx9sCQXxVh0gzZMj_pywDeh_E6U1f18FObAvQ/values/Events?key=AIzaSyBy50CfayeCy395Q-JfhS28_JCTaXqBFOc"
const categoryQueryLink = "https://script.google.com/macros/s/AKfycbzm8fW4M7hGCVPk4qXX-8fuv8ukF3y2zfrU98P31ML5KvMGWJ6pHzgbjQ9hXgbfVX8z4Q/exec"

apiRouter.route('/events').get((req, res) => {

	;(async function call() {
		try {
			debug('calling events');
			const response = await axios.get(eventQueryLink)
			const data = response.data.values

			const headers = data[0]
			let events = []

			let categories
			if (data.length > 1) {
				categories = await getCategories()
			}

			for (let eventRaw = 1; eventRaw < data.length; eventRaw++){
				let eventFields = {}

				for (let f = 0; f < data[eventRaw].length; f++){
					if (data[eventRaw][f] == "") continue
					eventFields[headers[f]] = data[eventRaw][f]
				}
				
				let event = {}
				event["extendedProps"] = {}

				// Title
				let title
				if (eventFields.hasOwnProperty('Title')) {
					title = eventFields["Title"]
				} else {
					title = "undefined"
				}
				event['title'] = title

				// Description
				if (eventFields.hasOwnProperty('Description')) {
					event["extendedProps"]["description"] = eventFields["Description"]
				}

				// Category / Color
				let color
				if (eventFields.hasOwnProperty("Category")) {
					const category = eventFields["Category"]
					event["extendedProps"]["category"] = category
					const categoryColor = categories.find(e => e.Name == category)

					if (undefined == categoryColor) {
						color = "#808080"
					} else {
						color = categoryColor.Color
					}
				} else {
					color = "#808080"
				}
				event["color"] = color

				// Location
				if (eventFields.hasOwnProperty('Location')) {
					event["extendedProps"]["location"] = eventFields["Location"]
				}
				
				// All Day
				const allDay = eventFields["All Day"] == "TRUE"
				event["allDay"] = allDay

				// Date / Time
				if (eventFields.hasOwnProperty("Recurring Day")) {
					// Recurring
					
					event["daysOfWeek"] = dayOfWeek[eventFields["Recurring Day"]]
					event["extendedProps"]["recurringDay"] = eventFields["Recurring Day"]

					if (eventFields.hasOwnProperty("Day")){
						event["startRecur"] = new Date(eventFields["Day"])
					}

					if (eventFields.hasOwnProperty("Last Day")) {
						const lastDay = new Date(eventFields["Last Day"])
						event["end"] = lastDay.setDate(lastDay.getDate() + 1)
					}

					if (!allDay) {
						
						if (!eventFields.hasOwnProperty("Start")) {
							console.error(`Issue in the event database. Contact admin. Event with title '${title}' (spreadsheet row ${eventRaw}) does not have a value in the Start column. Start needs to be provided if Reccuring Day is set and All Day is not TRUE. Event will not be shown.`)
							continue
						}

						if (!eventFields.hasOwnProperty("End")) {
							console.error(`Issue in the event database. Contact admin. Event with title '${title}' (spreadsheet row ${eventRaw}) does not have a value in the End column. End needs to be provided if Reccuring Day is set and All Day is not TRUE. Event will not be shown.`)
							continue
						}

						event["startTime"] = eventFields["Start"]
						event["endTime"] = eventFields["End"]
					} 

				} else {
					// Non-Recurring

					if (!eventFields.hasOwnProperty("Day")) {
						console.error(`Issue in the event database. Contact admin. Event with title '${title}' (spreadsheet row ${eventRaw}) does not have a value in the Day column. Event will not be shown.`)
						continue
					}

					if (allDay){
						// Non-Recurring, All Day

						event["start"] = new Date(eventFields["Day"])

						if (eventFields.hasOwnProperty("Last Day")) {
							const lastDay = new Date(eventFields["Last Day"])
							event["end"] = lastDay.setDate(lastDay.getDate() + 1)
						}
					} else {
						// Non-Recurring, Not All day

						if (!eventFields.hasOwnProperty("Start")) {
							console.error(`Issue in the event database. Contact admin. Event with title '${title}' (spreadsheet row ${eventRaw}) does not have a value in the Start column. Event will not be shown.`)
							continue
						}

						if (!eventFields.hasOwnProperty("End")) {
							console.error(`Issue in the event database. Contact admin. Event with title '${title}' (spreadsheet row ${eventRaw}) does not have a value in the End column. Event will not be shown.`)
							continue
						}

						const start = new Date(`${eventFields["Day"]} ${eventFields["Start"]}`)
						event["start"] = moment(start).format('yyyy-MM-DDTHH:mm')

						let end
						if (eventFields.hasOwnProperty("Last Day")) {
							end = new Date(`${eventFields["Last Day"]} ${eventFields["End"]}`)
						} else {
							end = new Date(`${eventFields["Day"]} ${eventFields["End"]}`)
						}
						event["end"] = moment(end).format('yyyy-MM-DDTHH:mm')
					}
				}

				events.push(event)
			}

			res.json(events)
		} catch (error) {
			debug(error.stack);
			res.status(500).send(`Error getting events: \r\n\r\n${error.stack}`)
		}
	})()
})

apiRouter.route('/categories').get((req, res) => {
	;(async function call() {
		try {
			const response = await getCategories()
			const data = response
			res.json(data)
		} catch (error) {
			res.status(500).send(`${error.stack}`)
		}
	})()
})

async function getCategories() {
	try {
		debug('calling categories');
		const response = await axios.get(categoryQueryLink)
		const data = response.data
		return data
	} catch (error) {
		throw new Error(`Could not get cateogries:\n\n${error.stack}`)
	}
}

var dayOfWeek = {
    Sunday: [0],
    Monday: [1],
    Tuesday: [2],
    Wednesday: [3],
    Thursday: [4],
    Friday: [5],
    Saturday: [6]
}
  
module.exports = apiRouter;