const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
// const mongo = require('mongodb').MongoClient;
// const url = 'mongodb://localhost:27017';
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://tomasnguyen0505:An551998@companydata-cb920.mongodb.net/test?retryWrites=true&w=majority";
const requestLink = require('request');
const normalize = require('normalize-text').normalizeWhitespaces;
var cheerio = require('cheerio');
const companyRoute = require('./routes/company');
const fieldRoute = require('./routes/field');

const app = express();
const port = process.env.PORT || 5555;
const DIST_DIR = path.join(__dirname, './dist'); // NEW
const HTML_FILE = path.join(DIST_DIR, 'index.html'); // NEW

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
     extended:true,
 }))

app.use(express.static(DIST_DIR)); // NEW

MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, connectTimeoutMS:120000}, (err, client) => {
  if (err) {
    console.error(err)
  }

  db = client.db('mydb');
  company = db.collection('company');
  field = db.collection('field');
  console.log('Connected to database');

  app.listen(port, function () {
    console.log('App listening on port: ' + port);
  
  });
}); 


app.get('/', (req, res) => {
    res.sendFile(HTML_FILE); // EDIT
});
  // CRAWL DATA EXAMPLE

  var count=0;

  //get data of link input
  app.get('/getlink/:page',async function(req,res,next){
  try {
    var myPromise = () => {
      return new Promise((resolve, reject) => {

          var data;
          const dataTable = []; 
          const linkurl = [];
          /////////////
          var getPage = req.params.page;
          var linkUrl1;
          var mysort = { _id: -1 };
          field.find().sort(mysort).limit(1).toArray(function(error, result) {
            if (error){
              reject(error);
            }else {
              //response.send(result);   
              linkUrl1=result[0].link+'?page='+getPage;
              console.log(linkUrl1);
              //////////////

              requestLink(linkUrl1,function(error1,response1,body1){
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
                        //res.send(dataTable);
                        resolve(dataTable);
                        console.log('DONE');
                      }
                    } catch (error) {
                      console.error('ERROR:');
                      console.error(error);
                    }
                  });    
                }
              })          
            }
          })
      });
    }
      //await myPromise
      var result = await myPromise();   
      
      //continue execution
      res.json(result);     

    } catch (e) {
      next(e)
    }
  });

  function getThongTinFromURL(obj,getPage,FieldVal,data){
    return new Promise((resolve,reject) => {
      requestLink(obj,function(error2,response2,body2){
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
              NameContact: HoTenPerVal,
              EmailContact: EmailPerVal,
              TelContact: TelPerVal,
              CellPhoneContact: PhonePerVal
              // expand:[{
              //   NameContact: HoTenPerVal,
              //   EmailContact: EmailPerVal,
              //   TelContact: TelPerVal,
              //   CellPhoneContact: PhonePerVal
              // }]
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
              NameContact: HoTenPerVal,
              EmailContact: EmailPerVal,
              TelContact: TelPerVal,
              CellPhoneContact: PhonePerVal
              // expand:[{
              //   NameContact: HoTenPerVal,
              //   EmailContact: EmailPerVal,
              //   TelContact: TelPerVal,
              //   CellPhoneContact: PhonePerVal
              // }]
            }
          }
          count=count+1;
          resolve(data);

        }                
      })
    });
  }
  
app.use('',companyRoute);
app.use('',fieldRoute);



// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

