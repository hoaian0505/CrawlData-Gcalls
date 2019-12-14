// const axios = require('axios');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongo = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const {ObjectID}=require('mongodb');
const request1 = require('request');
const normalize = require('normalize-text').normalizeWhitespaces;
var cheerio = require('cheerio');
const companyRoute = require('./routes/company');

const app = express();
const port = process.env.PORT || 5555;
const DIST_DIR = path.join(__dirname, './dist'); // NEW
const HTML_FILE = path.join(DIST_DIR, 'index.html'); // NEW

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
     extended:true,
 }))

app.use(express.static(DIST_DIR)); // NEW

app.get('/', (req, res) => {
    res.sendFile(HTML_FILE); // EDIT
});

app.use('',companyRoute);

app.listen(port, function () {
    console.log('App listening on port: ' + port);
    mongo.connect(url, { useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
        if (err) {
          console.error(err)
        }
        db = client.db('mydb');
        company = db.collection('company');
        field = db.collection('field');
        console.log('Connected to database');
    });    
});

// //get data in company database
// app.get('/company', (request, response) => {
//   company.find({}).toArray((error, result) => {
//         if(error) {
//             return response.status(500).send(error);
//         }
//         response.send(result);
//     });
//   });
  
//   //update field in company database
//   app.put('/company/:field', (request, response) => {
//     var getField = request.params.field; 
//     var data = request.body; 
//     //company.updateOne({_id: ObjectID(getid)},{$set: data}, (error, result) => {
//       company.updateMany({Field: getField},{$set: data}, (error, result) => {
//       if(error) {
//           return response.status(500).send(error);
//         }
//         response.send(result);
//         console.log('da sua 1 database theo linh vuc');
//         console.log(data);  
//     })
//   });
  
//     //delete data in company database by id
//   app.delete('/company/:id', (request, response) => {
//     var getid = request.params.id;
//     //company.deleteOne({_id: ObjectID(getid)}, (error, result) => {
//       company.deleteOne({_id: getid}, (error, result) => {
//         if(error) {
//           return response.status(500).send(error);
//         }
//         response.send(result);
//         console.log('da xoa 1 database');
//     })
//   });
  
//   //delete data in company database by field
//   app.delete('/company/field/:field',function(request, response) {
//     var getField = request.params.field;
//     //company.deleteOne({_id: ObjectID(getid)}, (error, result) => {
//       company.deleteMany({Field: getField}, (error, result) => {
//         if(error) {
//           return response.status(500).send(error);
//         }
//         response.send(result);
//         console.log(getField);
//         console.log('da xoa 1 database theo Linh Vuc');
//     })
//   });



//   //save data in company database
//   app.post('/company', (request, response) => {
//     var dataItems = request.body;
//     console.log('Oke be de');
//     var i=0;
//     for (;i < dataItems.length; i++)
//     {
//         var _Tempid = new ObjectID().toString();
//         //var data1 = { _id: _Tempid };
//         dataItems[i]._id=_Tempid; //vì data nhận vào là object nên ko thể push lên = bth, thay vào đó gọi tên
//         // console.log(i);
//         // console.log('>>>>>>>>>>>>>');
//         if ((i+1)==dataItems.length){
//           company.insertMany(dataItems, (error, result) => {
//             if(error) {
//               return response.status(500).send(error);
//             }
//             response.send(result);
//             console.log('da them toan bo database');
//           });
//           break;
//         }
//     }
//   });

//   //get full data in company database by field
//   app.get('/company/:field', (request, response) => {
//     var getField = request.params.field;
//     company.find({Field:getField}).toArray((error, result) => {
//         if(error) {
//             return response.status(500).send(error);
//         }
//         response.send(result);
//         console.log(getField);
//     });
//   });

//   //get full data in company database by field and page
//   app.get('/company/:field/:page', (request, response) => {
//     var getField = request.params.field;
//     var getPage = request.params.page;
//     company.find({Field:getField,Page:getPage}).toArray((error, result) => {
//         if(error) {
//             return response.status(500).send(error);
//         }
//         response.send(result);
//         console.log(getField + ' Nam o trang '+getPage);
//     });
//   });

  // CRAWL DATA EXAMPLE

  var count=0;

  //get data of link input
  app.get('/getlink/:page',async function(req,res){
    var data;
    const dataTable = []; 
    const linkurl = [];
    /////////////
    var getPage = req.params.page;
    var linkUrl1;
    var mysort = { _id: -1 };
    field.find().sort(mysort).limit(1).toArray(function(error, result) {
      if(error) {
        return result.status(500).send(error);
      }
      //response.send(result);   
      linkUrl1=result[0].link+'?page='+getPage;
      console.log(linkUrl1);
    //////////////

      request1(linkUrl1,function(error1,response1,body1){
      if (error1){
          console.log(error1);
        }else {
          $ = cheerio.load(body1);
          let FieldVal = normalize($(body1).find('div#thongbaotim > div > h1').text());
          var ds = $(body1).find('h2.company_name > a');
          count=0;
          var countMax=ds.length;
          ds.each(async function(i,e){
            try{
              linkurl[i]  = e['attribs']['href'];

              const data1 = await getThongTinFromURL(linkurl[i],getPage,FieldVal,data,count);

              dataTable[i]=data1; 
              if (count == countMax) {
                res.send(dataTable);
                console.log('DONE');
              }
            } catch (error) {
              console.error('ERROR:');
              console.error(error);
          }
          });    
        }
      })
      // .then(()=>res.send(dataTable))
      // .then(()=>console.log('DONE'))

      });
    });


  function getThongTinFromURL(obj,getPage,FieldVal,data){
    return new Promise((resolve,reject) => {
      request1(obj,function(error2,response2,body2){
        if (error2){
          reject(error2);
        }else {
          $ = cheerio.load(body2);
          let tenCongTyVal = $(body2).find('div.tencongty > h1').text();
          let diaChiVal = normalize($(body2).find('div.diachi_chitietcongty > div:first-of-type  p').text());
          let TelVal = normalize($(body2).find('div.diachi_chitietcongty > div  span').text());
          let EmailVal = $(body2).find('div.text_email > p > a').text();
          let WebsiteVal = $(body2).find('div.text_website > p').text();
          
          if ($(body2).find('div#listing_detail_right > div:first-of-type').hasClass('banladoanhnghiep') != true)
          {
            var HoTenPerVal,EmailPerVal,TelPerVal,PhonePerVal;
            var kt=false;
            var dss= $(body2).find('div#listing_detail_right > div:first-of-type > div > div:nth-of-type(2)');
            dss.each(function(i1,e1){
              if (kt==false){
                if ($(this).find('p').text()=='Họ tên:'){
                    HoTenPerVal=normalize($(this).next().find('p').text());
                    }
                else if ($(this).find('p').text()=='Di động:'){
                  PhonePerVal=normalize($(this).next().find('p').text());
                  }
                else if ($(this).find('p').text()=='Email:'){
                  kt=true;
                  EmailPerVal=normalize($(this).next().find('p').text());
                  }
                else if ($(this).find('p').text()=='Điện thoại:'){
                  TelPerVal=normalize($(this).next().find('p').text());
                }
              }
              else
              {
                return;
              }
            })

            data = {
              Page : getPage,
              Field : FieldVal,
              CompanyName : tenCongTyVal,
              Adress : diaChiVal,
              Tel : TelVal,
              Email : EmailVal,
              Website : WebsiteVal,
              expand:[{
                NameContact: HoTenPerVal,
                EmailContact: EmailPerVal,
                TelContact: TelPerVal,
                CellPhoneContact: PhonePerVal
              }]
            }
          }
          else{
            data = {
              Page : getPage,
              Field : FieldVal,
              CompanyName : tenCongTyVal,
              Adress : diaChiVal,
              Tel : TelVal,
              Email : EmailVal,
              Website : WebsiteVal,
              expand:[{
                NameContact: HoTenPerVal,
                EmailContact: EmailPerVal,
                TelContact: TelPerVal,
                CellPhoneContact: PhonePerVal
              }]
            }
          }
          count=count+1;
          resolve(data);

        }                
      })
    });
  }


  //save data to field database
  app.post('/field', (request, response) => {
    var data = request.body;
    var _Tempid = new ObjectID().toString();
    data._id=_Tempid; //vì data nhận vào là object nên ko thể push lên = bth, thay vào đó gọi tên
    console.log(data.link);
    var FieldVal,pageVal;
      request1(data.link, function(error1,response1,body1){
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
          if(error) {
              return response.status(500).send(error);
          }
          response.send(result);
          console.log('da them 1 database trong collection field');
        });
      })
  });

  //get field database
  app.get('/field/', (request, response) => {
    field.find({}).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
  });

  //get last TotalPage in field database
  app.get('/field/pagelast', (request, response) => {
    var mysort = { _id: -1 };
    field.find().sort(mysort).limit(1).toArray(function(error, result)  {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result[0].TotalPages);   
    });
  });

    //get last field in field database
  app.get('/field/fieldlast', (request, response) => {
    var mysort = { _id: -1 };
    field.find().sort(mysort).limit(1).toArray(function(error, result)  {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result[0].Field);   
    });
  });

  //get all field in field database
  app.get('/field/allfields',(request, response) => {
    field.find({}).toArray((error, result) => {
      var FieldTable = [];
      if(error) {
          return response.status(500).send(error);
      }
        for (i=0;i<result.length;i++){
          FieldTable[i]=result[i].Field;   
        }
      response.send(FieldTable);
      console.log(FieldTable);
  });
  });

  //delete field in field Database with id
  app.delete('/field/id/:id', (request, response) => {
    var getid = request.params.id;
    //company.deleteOne({_id: ObjectID(getid)}, (error, result) => {
    field.deleteOne({_id: getid}, (error, result) => {
        if(error) {
          return response.status(500).send(error);
        }
        response.send(result);
        console.log('da xoa 1 database');
    })
  });

  //delete field in field Database
  app.delete('/field/:field', (request, response) => {
    var getField = request.params.field;
    field.deleteOne({Field: getField}, (error, result) => {
        if(error) {
          return response.status(500).send(error);
        }
        response.send(result);
        console.log(getField);
        console.log('da xoa 1 database theo Linh Vuc');
    })
  });

  //update field in field Database
  app.put('/field/:field', (request, response) => {
    var getField = request.params.field;
    var data = request.body;
    field.updateOne({Field: getField},{$set: data}, (error, result) => {
        if(error) {
          return response.status(500).send(error);
        }
        response.send(result);
        console.log(getField);
        console.log('da update 1 database theo Linh Vuc');
    })
  });

  //get TotalPages of field Database by field
  app.get('/field/page/:field', (request, response) => {
    var getField = request.params.field;
    field.find({Field:getField}).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result[0].TotalPages);
        console.log(result[0].TotalPages);
    });
  });

  //return true-false when check 
  app.get('/field/link/:link', (request, response) => {
    var getTempLink = request.params.link;
    var getLink = getTempLink.replace(/`/gi, '/');
    field.find({link:getLink}).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        if (result.length == 0)
        {
          response.send(false);
          console.log(getLink);
        }
        else{
          response.send(true);
          console.log(getLink);
        }
    });
  });