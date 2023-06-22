const express = require('express');
const debug = require('debug')('app:apiRouter');
const axios = require('axios').default

const apiRouter = express.Router();

apiRouter.route('/events').get((req, res) => {

	;(async function call() {
		const url =`https://sheets.googleapis.com/v4/spreadsheets/${process.env.EVENTDBID}/values/Events?key=${process.env.EVENTDBKEY}`

		try {
			debug('calling events');
			const response = await axios.get(url)
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

				let title
				if (eventFields.hasOwnProperty('Title')) {
					title = eventFields["Title"]
				} else {
					title = "undefined"
				}
				event['title'] = title

				let color
				if (eventFields.hasOwnProperty("Category")) {
					const category = eventFields["Category"]
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
				
				if (eventFields.hasOwnProperty('Location')) {
					event["extendedProps"] = {"location": eventFields["Location"]}
				}
				
				const allDay = eventFields["All Day"] == "TRUE"
				event["allDay"] = allDay

				if (eventFields.hasOwnProperty("Recurring Day")) {
					// Recurring
					
					event["daysOfWeek"] = dayOfWeek[eventFields["Recurring Day"]]

					if (eventFields.hasOwnProperty("Day")){
						event["startRecur"] = new Date(eventFields["Day"])
					}

					if (eventFields.hasOwnProperty("Last Day")) {
						const lastDay = new Date(eventFields["Last Day"])
						event["end"] = lastDay.setDate(lastDay.getDate() + 1)
					}

					if (!allDay) {
						
						if (!eventFields.hasOwnProperty("Start")) {
							res.status(400).send(`Issue in the event database. Contact admin. Event with title '${title}' does not have a value in the Start column. Start needs to be provided if Reccuring Day is set and All Day is not TRUE.`)
						}

						if (!eventFields.hasOwnProperty("End")) {
							res.status(400).send(`Issue in the event database. Contact admin. Event with title '${title}' does not have a value in the End column. End needs to be provided if Reccuring Day is set and All Day is not TRUE.`)
						}

						event["startTime"] = eventFields["Start"]
						event["endTime"] = eventFields["End"]
					} 

				} else {
					// Non-Recurring

					if (!eventFields.hasOwnProperty("Day")) {
						res.status(400).send(`Issue in the event database. Contact admin. Event with title '${title}' does not have a value in the Day column.`)
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
							res.status(400).send(`Issue in the event database. Contact admin. Event with title '${title}' does not have a value in the Start column.`)
						}

						if (!eventFields.hasOwnProperty("End")) {
							res.status(400).send(`Issue in the event database. Contact admin. Event with title '${title}' does not have a value in the End column.`)
						}

						event["start"] = new Date(`${eventFields["Day"]} ${eventFields["Start"]}`)

						let end
						if (eventFields.hasOwnProperty("Last Day")) {
							end = new Date(`${eventFields["Last Day"]} ${eventFields["End"]}`)
						} else {
							end = new Date(`${eventFields["Day"]} ${eventFields["End"]}`)
						}
						event["end"] = end
					}
				}

				events.push(event)
			}

			res.json(events)
		} catch (error) {
			debug(error.stack);
			res.status(500).send(`Cannot connect\n\n${error.stack}`)
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
		const response = await axios.get(process.env.CATEGORIESENDPOINT)
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