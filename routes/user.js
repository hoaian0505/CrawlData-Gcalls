const express = require('express');
const user_router = express.Router();
const {ObjectID}=require('mongodb');
const normalize = require('normalize-text').normalizeWhitespaces;

  //code user database
  user_router.route('/')
    .get(async (req,res) => {
        try {
            console.log('Chay collection user');
			const result = await user.find({}).toArray();
            return Promise.resolve(res.json(result[0]));
		} catch (error) {
			return Promise.reject(error.message);
        }

    })
    .post(async (req,res) => {
        try {
            var _Tempid = new ObjectID().toString();
            var data = req.body;
            data._id =_Tempid;
            console.log('DATA =',data);
            console.log('INPUT DATA= ',req.body);
			await user.insertOne(data);
			return await data;
		} catch (error) {
			return Promise.reject(error.message);
		}
    })
    user_router.route('/:id')
    .delete(async (req,res) => {
        try {
            var id = req.params.id;
            //await user.insertOne(data);
            await  user.deleteOne({_id: id});
			return Promise.resolve(res.json({ success: true }));
		} catch (error) {
			return Promise.reject(error.message);
		}
    })

// Exports cho biến field_router
module.exports = user_router;