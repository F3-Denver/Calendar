const express = require('express');
const debug = require('debug')('app:apiRouter');
const { MongoClient } = require('mongodb');

const apiRouter = express.Router();

apiRouter.route('/').get((req, res) => {
    const start = req.query.start
	const end = req.query.end

	if (start == null || end == null){
		res.status(401).send('Request must include parameters "start" and "end".')
	}
	
	const url = `mongodb+srv://f3denver:${process.env.EVENTDBPASSWORD}@events.5kscka4.mongodb.net/?retryWrites=true&w=majority`
  
    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected to the mongo DB');
		
		const query = { id: 1 }
		const response = await client.db('Events').collection('Events').find({
			date: {
				$gte: start,
				$lt: end,
		  	}}).toArray()
		res.json(response)
      } catch (error) {
        debug(error.stack);
      } finally {
		client.close();
	  }
    })();
  });
  
  module.exports = apiRouter;