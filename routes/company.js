const express = require('express');
const company_router = express.Router();
const {ObjectID}=require('mongodb');

//get data in company database
company_router.get('/company',async (request, response,next) => {
  try {
    var myPromise = () => {
      return new Promise((resolve, reject) => {
      company.find({}).toArray((error, result) => {
            // if(error) {
            //     return response.status(500).send(error);
            // }
            // response.send(result);
            error 
            ? reject(err) 
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

//update field in company database
company_router.put('/company/:field',async (request, response,next) => {
  try {
    var myPromise = () => {
      return new Promise((resolve, reject) => {
        var getField = request.params.field; 
        var data = request.body; 
          company.updateMany({Field: getField},{$set: data}, (error, result) => {
          // if(error) {
          //     return response.status(500).send(error);
          //   }
          //   response.send(result);
          //   console.log('da sua 1 database theo linh vuc');
          //   console.log(data);  
          error 
            ? reject(err) 
            : resolve(result);
          })
      })
    }

    //await myPromise
    var result = await myPromise();   
    
    //continue execution
    console.log('da sua 1 database theo linh vuc');
    response.json(result);

  } catch (e) {
    next(e)
  }
});
  
//delete data in company database by id
company_router.delete('/company/:id', async (request, response,next) => {
  try {
    var myPromise = () => {
      return new Promise((resolve, reject) => {
        var getid = request.params.id;
        //company.deleteOne({_id: ObjectID(getid)}, (error, result) => {
          company.deleteOne({_id: getid}, (error, result) => {
            // if(error) {
            //   return response.status(500).send(error);
            // }
            // response.send(result);
            // console.log('da xoa 1 database');
            error 
            ? reject(err) 
            : resolve(result);
          })
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
  
//delete data in company database by field
company_router.delete('/company/field/:field',async (request, response,next) => {
  try {
    var myPromise = () => {
      return new Promise((resolve, reject) => {
        var getField = request.params.field;
        //company.deleteOne({_id: ObjectID(getid)}, (error, result) => {
          company.deleteMany({Field: getField}, (error, result) => {
            // if(error) {
            //   return response.status(500).send(error);
            // }
            // response.send(result);
            // console.log(getField);
            // console.log('da xoa 1 database theo Linh Vuc');
            error 
            ? reject(err) 
            : resolve(result);
        })
      });
    };
    //await myPromise
    var result = await myPromise();   
    
    //continue execution
    console.log('da xoa 1 database Company theo Linh Vuc ');
    response.json(result);

  } catch (e) {
    next(e)
  }
});

//save data in company database
company_router.post('/company', async (request, response,next) => {
  try {
    var myPromise = () => {
      return new Promise((resolve, reject) => {
        var dataItems = request.body;
        console.log('Oke be de');
        var i=0;
        for (;i < dataItems.length; i++)
        {
            var _Tempid = new ObjectID().toString();
            //var data1 = { _id: _Tempid };
            dataItems[i]._id=_Tempid; //vì data nhận vào là object nên ko thể push lên = bth, thay vào đó gọi tên
            // console.log(i);
            // console.log('>>>>>>>>>>>>>');
            if ((i+1)==dataItems.length){
              company.insertMany(dataItems, (error, result) => {
                // if(error) {
                //   return response.status(500).send(error);
                // }
                // response.send(result);
                // console.log('da them toan bo database');
                error 
                ? reject(err) 
                : resolve(result);
              });
              break;
            }
        }
      })
    };
    //await myPromise
    var result = await myPromise();   
    
    //continue execution
    console.log('da them toan bo database');
    response.json(result);

  } catch (e) {
    next(e)
  }
});

//get full data in company database by field
company_router.get('/company/:field', async (request, response,next) => {
  try {
    var myPromise = () => {
      return new Promise((resolve, reject) => {
        var getField = request.params.field;
        company.find({Field:getField}).toArray((error, result) => {
            // if(error) {
            //     return response.status(500).send(error);
            // }
            // response.send(result);
            // console.log(getField);
            error 
            ? reject(err) 
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

//get full data in company database by field and page
company_router.get('/company/:field/:page', async (request, response,next) => {
  try {
    var myPromise = () => {
      return new Promise((resolve, reject) => {
        var getField = request.params.field;
        var getPage = request.params.page;
        company.find({Field:getField,Page:getPage}).toArray((error, result) => {
            // if(error) {
            //     return response.status(500).send(error);
            // }
            // response.send(result);
            // console.log(getField + ' Nam o trang '+getPage);
            error 
            ? reject(err) 
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

// Exports cho biến company_router
module.exports = company_router;