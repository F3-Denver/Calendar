const express = require('express');
const debug = require('debug')('app:apiRouter');
const { MongoClient } = require('mongodb');
const isodate = require('isodate')

const apiRouter = express.Router();

apiRouter.route('/').get((req, res) => {
    const queryStart = req.query.start
	const queryEnd = req.query.end

	const a = isodate(queryStart)
	const b = isodate(queryEnd)

	if (queryStart == null || queryEnd == null){
		res.status(400).send('Request must include parameters "start" and "end".')
	}
 	debug('calling');

	const url =`mongodb+srv://f3denver:${process.env.EVENTDBPASSWORD}@events.5kscka4.mongodb.net/?retryWrites=true&w=majority`
	const dbName = 'Events'
	
	;(async function mongo() {
		let client
		try {
			client = await MongoClient.connect(url)
			debug('Connected to the mongo DB')
		
			const db = client.db(dbName)
		
			const response = await client.db('Events').collection('Events').find({
				$or:[
					{
						$and: [
							{ start: { $gte: isodate(queryStart) } },
							{ start: { $lt: isodate(queryEnd) } }
						]
					},
					{
						$and: [
							{ end: { $gte: isodate(queryStart) } },
							{ end: { $lt: isodate(queryEnd) } }
						]
					},
					{
						$and: [
							{ start: { $lt: isodate(queryStart) } },
							{ end: { $gte: isodate(queryEnd) } }
						]
					}
				]
			  }).toArray()
			res.json(response)
			client.close()
		} catch (error) {
			debug(error.stack);
			res.status(500).send(`Cannot connect\n\n${error.stack}`)
		}
		
	})();
});
  
  module.exports = apiRouter;