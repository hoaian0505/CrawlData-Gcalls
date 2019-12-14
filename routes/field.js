const express = require('express');
const field_router = express.Router();
const {ObjectID}=require('mongodb');
const requestLink = require('request');
var cheerio = require('cheerio');
const normalize = require('normalize-text').normalizeWhitespaces;

  //save data to field database
  field_router.post('/field',async (request, response,next) => {
    try {
      var myPromise = () => {
        return new Promise((resolve, reject) => {
          var data = request.body;
          var _Tempid = new ObjectID().toString();
          data._id=_Tempid; //vì data nhận vào là object nên ko thể push lên = bth, thay vào đó gọi tên
          console.log(data.link);
          var FieldVal,pageVal;
            requestLink(data.link, function(error1,response1,body1){
              if (error1){
                console.log(error1);
              }else {
                $ = cheerio.load(body1);
                FieldVal = normalize($(body1).find('div#thongbaotim > div > h1').text());
                pageVal = normalize($(body1).find('div#paging > a:nth-last-of-type(2)').text());
              }
              console.log(FieldVal);
              console.log(pageVal);
              data.Field=FieldVal;
              data.TotalPages=pageVal;

              field.insertOne(data, (error, result) => {
                // if(error) {
                //     return response.status(500).send(error);
                // }
                // response.send(result);
                // console.log('da them 1 database trong collection field');
                error 
                ? reject(error) 
                : resolve(result);
              });
            });
        });
      };
      var result = await myPromise();   
        
      //continue execution
      console.log('da them 1 database trong collection field');
      response.json(result);
  
    } catch (e) {
      next(e)
    }
  });

  //get field database
  field_router.get('/field/', async (request, response,next) => {
    try {
      var myPromise = () => {
        return new Promise((resolve, reject) => {
          field.find({}).toArray((error, result) => {
              // if(error) {
              //     return response.status(500).send(error);
              // }
              // response.send(result);
              error 
              ? reject(error) 
              : resolve(result);
          });
        });
      };
      //await myPromise
      var result = await myPromise();   
      
      //continue execution
      response.json(result);
  
    } catch (e) {
      next(e)
    }
  });

  //get last TotalPage in field database
  field_router.get('/field/pagelast',async (request, response,next) => {
    try {
      var myPromise = () => {
        return new Promise((resolve, reject) => {
          var mysort = { _id: -1 };
          field.find().sort(mysort).limit(1).toArray(function(error, result)  {
              // if(error) {
              //     return response.status(500).send(error);
              // }
              // response.send(result[0].TotalPages);   
              error 
              ? reject(error) 
              : resolve(result[0].TotalPages);
          });
        });
      };
      //await myPromise
      var result = await myPromise();   
      
      //continue execution
      response.json(result);
  
    } catch (e) {
      next(e)
    }
  });

    //get last field in field database
  field_router.get('/field/fieldlast',async (request, response,next) => {
    try {
      var myPromise = () => {
        return new Promise((resolve, reject) => {
          var mysort = { _id: -1 };
          field.find().sort(mysort).limit(1).toArray(function(error, result)  {
              // if(error) {
              //     return response.status(500).send(error);
              // }
              // response.send(result[0].Field); 
              error 
              ? reject(error) 
              : resolve(result[0].Field);
          });
        });
      };
      //await myPromise
      var result = await myPromise();   
      
      //continue execution
      response.json(result);
  
    } catch (e) {
      next(e)
    }
  });

  //get all field in field database
  field_router.get('/field/allfields',async (request, response,next) => {
    try {
      var myPromise = () => {
        return new Promise((resolve, reject) => {
          field.find({}).toArray((error, result) => {
            // var FieldTable = [];
            // if(error) {
            //     return response.status(500).send(error);
            // }
            //   for (i=0;i<result.length;i++){
            //     FieldTable[i]=result[i].Field;   
            //   }
            // response.send(FieldTable);
            // console.log(FieldTable);
            if (error){
              reject(error);
            }else {
              var FieldTable = [];
              // result.map((data,i) => {FieldTable[i]=data[i].Field});
              for (i=0;i<result.length;i++){
                FieldTable[i]=result[i].Field;   
              }
              resolve(FieldTable);
            }
          });
        });
      };
      //await myPromise
      var result = await myPromise();   
      
      //continue execution
      console.log(result);
      response.json(result);
  
    } catch (e) {
      next(e)
    }
  });

  //delete field in field Database with id
  field_router.delete('/field/id/:id', async (request, response,next) => {
    try {
      var myPromise = () => {
        return new Promise((resolve, reject) => {
          var getid = request.params.id;
          field.deleteOne({_id: getid}, (error, result) => {
              // if(error) {
              //   return response.status(500).send(error);
              // }
              // response.send(result);
              // console.log('da xoa 1 database');
              error 
              ? reject(error) 
              : resolve(result);
          });
        });
      };
      //await myPromise
      var result = await myPromise();   
      
      //continue execution
      console.log('da xoa 1 database');
      response.json(result);
  
    } catch (e) {
      next(e)
    }
  });

  //delete field in field Database
  field_router.delete('/field/:field', async (request, response,next) => {
    try {
      var myPromise = () => {
        return new Promise((resolve, reject) => {
          var getField = request.params.field;
          field.deleteOne({Field: getField}, (error, result) => {
              // if(error) {
              //   return response.status(500).send(error);
              // }
              // response.send(result);
              // console.log(getField);
              error 
              ? reject(error) 
              : resolve(result);
          });
        });
      };
      //await myPromise
      var result = await myPromise();   
      
      //continue execution
      console.log('da xoa 1 database theo Linh Vuc');
      response.json(result);
  
    } catch (e) {
      next(e)
    }
  });

  //update field in field Database
  field_router.put('/field/:field', async (request, response,next) => {
    try {
      var myPromise = () => {
        return new Promise((resolve, reject) => {
          var getField = request.params.field;
          var data = request.body;
          field.updateOne({Field: getField},{$set: data}, (error, result) => {
              // if(error) {
              //   return response.status(500).send(error);
              // }
              // response.send(result);
              // console.log(getField);
              // console.log('da update 1 database theo Linh Vuc');
              error 
              ? reject(error) 
              : resolve(result);
          });
        });
      };
      //await myPromise
      var result = await myPromise();   
      
      //continue execution
      console.log('da update 1 database theo Linh Vuc');
      response.json(result);
  
    } catch (e) {
      next(e)
    }
  });

  //get TotalPages of field Database by field
  field_router.get('/field/page/:field', async (request, response,next) => {
    try {
      var myPromise = () => {
        return new Promise((resolve, reject) => {
          var getField = request.params.field;
          field.find({Field:getField}).toArray((error, result) => {
              // if(error) {
              //     return response.status(500).send(error);
              // }
              // response.send(result[0].TotalPages);
              // console.log(result[0].TotalPages);
              error 
              ? reject(error) 
              : resolve(result[0].TotalPages);
          });
        });
      };
      //await myPromise
      var result = await myPromise();   
      
      //continue execution
      response.json(result);
  
    } catch (e) {
      next(e)
    }
  });

  //return true-false when checked 
  field_router.get('/field/link/:link', async (request, response,next) => {
    try {
      var myPromise = () => {
        return new Promise((resolve, reject) => {
          var getTempLink = request.params.link;
          var getLink = getTempLink.replace(/`/gi, '/');
          field.find({link:getLink}).toArray((error, result) => {
              // if(error) {
              //     return response.status(500).send(error);
              // }
              // if (result.length == 0)
              // {
              //   response.send(false);
              //   console.log(getLink);
              // }
              // else{
              //   response.send(true);
              //   console.log(getLink);
              // }
              if (error){
                reject(error);
              }else {
                if (result.length == 0)
                {
                  resolve(false);
                  console.log(getLink);
                }
                else{
                  resolve(true);
                  console.log(getLink);
                }
              }
          });
        });
      };
      //await myPromise
      var result = await myPromise();   
        
      //continue execution
      response.json(result);
    
    } catch (e) {
      next(e)
    }
  });

// Exports cho biến field_router
module.exports = field_router;