// const axios = require('axios');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongo = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const {ObjectID}=require('mongodb');
const request1 = require('request');
const request2 = require('request-promise');
const normalize = require('normalize-text').normalizeWhitespaces;
const axios = require('axios');
var cheerio = require('cheerio');

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

app.listen(port, function () {
    console.log('App listening on port: ' + port);
    mongo.connect(url, { useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
        if (err) {
          console.error(err)
        }
        db = client.db('mydb');
        collection = db.collection('personnel');
        linhvuc = db.collection('linhvuc');
        console.log('Connected to database');
    });    
});


app.get('/personnel/get', (request, response) => {
    collection.find({}).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
  });

  app.post('/personnel/get', (request, response) => {
    var data = request.body;
    var _Tempid = new ObjectID().toString();
    var data1 = { _id: _Tempid };
    data._id=_Tempid; //vì data nhận vào là object nên ko thể push lên = bth, thay vào đó gọi tên
  
    //request.body= JSON.stringify(data);
    collection.insertOne(data, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
        //response.render('personnel/get',{
        //  datas : result
        //});
        console.log('da them 1 database');
        console.log(_Tempid);
        //console.log(data);
    });
  });
  
  app.put('/personnel/get/:linhvuc', (request, response) => {
    var getLinhVuc = request.params.linhvuc; 
    var data = request.body; 
    //collection.updateOne({_id: ObjectID(getid)},{$set: data}, (error, result) => {
    collection.updateMany({LinhVuc: getLinhVuc},{$set: data}, (error, result) => {
      if(error) {
          return response.status(500).send(error);
        }
        response.send(result);
        console.log('da sua 1 database theo linh vuc');
        console.log(data);  
    })
  });
  
  app.delete('/personnel/get/:id', (request, response) => {
    var getid = request.params.id;
    //collection.deleteOne({_id: ObjectID(getid)}, (error, result) => {
    collection.deleteOne({_id: getid}, (error, result) => {
        if(error) {
          return response.status(500).send(error);
        }
        response.send(result);
        console.log('da xoa 1 database');
    })
  });
  
  app.delete('/personnel/linhvuc/:linhvuc',function(request, response) {
    var getLinhVuc = request.params.linhvuc;
    //collection.deleteOne({_id: ObjectID(getid)}, (error, result) => {
    collection.deleteMany({LinhVuc: getLinhVuc}, (error, result) => {
        if(error) {
          return response.status(500).send(error);
        }
        response.send(result);
        console.log(getLinhVuc);
        console.log('da xoa 1 database theo Linh Vuc');
    })
  });

  // CRAWL DATA EXAMPLE

  var count=0;

  app.get('/getlink/:page',async function(req,res){
    var data;
    const dataTable = []; 
    const linkurl = [];
    /////////////
    var getPage = req.params.page;
    var linkUrl1;
    var mysort = { _id: -1 };
    linhvuc.find().sort(mysort).limit(1).toArray(function(error, result) {
      if(error) {
        return result.status(500).send(error);
      }
      //response.send(result);   
      linkUrl1=result[0].link+'?page='+getPage;
      console.log(linkUrl1);
    //////////////

      request1(linkUrl1,function(error1,response1,body1){
      //request2(linkUrl1).then(function(error1,response1,body1){
      if (error1){
          console.log(error1);
        }else {
          $ = cheerio.load(body1);
          let linhVucVal = normalize($(body1).find('div#thongbaotim > div > h1').text());
          var ds = $(body1).find('h2.company_name > a');
          count=0;
          var countMax=ds.length;
          ds.each(async function(i,e){
            try{
              linkurl[i]  = e['attribs']['href'];

              const data1 = await getThongTinFromURL(linkurl[i],getPage,linhVucVal,data,count);

              dataTable[i]=data1; 
              //console.log('DONE');
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


  function getThongTinFromURL(obj,getPage,linhVucVal,data){
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
            // let HoTenPerVal = normalize($(body1).find('div#listing_detail_right > div:first-of-type > div:nth-of-type(3) > div:last-of-type').text());
            // let EmailPerVal = normalize($(body1).find('div#listing_detail_right > div:first-of-type > div:last-of-type > div:last-of-type').text());
            // let TelPerVal = normalize($(body1).find('div#listing_detail_right > div:first-of-type > div:nth-last-of-type(2) > div:last-of-type').text());
            
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
              Trang : getPage,
              LinhVuc : linhVucVal,
              TenCongTy : tenCongTyVal,
              DiaChi : diaChiVal,
              SoDienThoai : TelVal,
              Email : EmailVal,
              Website : WebsiteVal,
              expand:[{
                HoTenNguoiLienHe: HoTenPerVal,
                EmailNguoiLienHe: EmailPerVal,
                SoDienThoaiNguoiLienHe: TelPerVal,
                SoDiDongNguoiLienHe: PhonePerVal
              }]
            }
          }
          else{
            data = {
              Trang : getPage,
              LinhVuc : linhVucVal,
              TenCongTy : tenCongTyVal,
              DiaChi : diaChiVal,
              SoDienThoai : TelVal,
              Email : EmailVal,
              Website : WebsiteVal,
              expand:[{
                HoTenNguoiLienHe: HoTenPerVal,
                EmailNguoiLienHe: EmailPerVal,
                SoDienThoaiNguoiLienHe: TelPerVal,
                SoDiDongNguoiLienHe: PhonePerVal
              }]
            }
          }
          count=count+1;
          resolve(data);

        }                
      })
    });
  }

  app.get('/getlinkvuc',(req,res) => {
    request1('https://trangvangvietnam.com/categories/486634/can-ho-van-phong.html', function(error1,response1,body1){
      if (error1){
        console.log(error1);
      }else {
        $ = cheerio.load(body1);
        let pageVal = normalize($(body1).find('div#paging > a:nth-last-of-type(2)').text());
        console.log(pageVal);
        res.send(pageVal);
      }
    })
  });



  app.post('/savedata', (request, response) => {
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
          collection.insertMany(dataItems, (error, result) => {
            if(error) {
              return response.status(500).send(error);
            }
            response.send(result);
            console.log('da them toan bo database');
          });
          break;
        }
    }
  });

  app.get('/personnel/get', (request, response) => {
    collection.find({}).toArray((error, result) => {
        if(error) {
             return response.status(500).send(error);
        }
        response.send(result);
    });
  });

  app.get('/personnel/get/:linhvuc', (request, response) => {
    var getLinhVuc = request.params.linhvuc;
    collection.find({LinhVuc:getLinhVuc}).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
        console.log(getLinhVuc);
    });
  });

  app.get('/personnel/get/:linhvuc/:page', (request, response) => {
    var getLinhVuc = request.params.linhvuc;
    var getTrang = request.params.page;
    collection.find({LinhVuc:getLinhVuc,Trang:getTrang}).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
        console.log(getLinhVuc + ' Nam o trang '+getTrang);
    });
  });

  
  app.post('/linhvuc/get', (request, response) => {
    var data = request.body;
    var _Tempid = new ObjectID().toString();
    data._id=_Tempid; //vì data nhận vào là object nên ko thể push lên = bth, thay vào đó gọi tên
    console.log(data.link);
    var linhVucVal,pageVal;
      request1(data.link, function(error1,response1,body1){
        if (error1){
          console.log(error1);
        }else {
          $ = cheerio.load(body1);
          linhVucVal = normalize($(body1).find('div#thongbaotim > div > h1').text());
          pageVal = normalize($(body1).find('div#paging > a:nth-last-of-type(2)').text());
        }
        console.log(linhVucVal);
        console.log(pageVal);
        data.LinhVuc=linhVucVal;
        data.TongSoTrang=pageVal;

        linhvuc.insertOne(data, (error, result) => {
          if(error) {
              return response.status(500).send(error);
          }
          response.send(result);
          console.log('da them 1 database trong collection linhvuc');
        });
      })
  });

  app.get('/linhvuc/get', (request, response) => {
    linhvuc.find({}).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
  });

  app.get('/linhvuc/pagelast', (request, response) => {
    var mysort = { _id: -1 };
    linhvuc.find().sort(mysort).limit(1).toArray(function(error, result)  {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result[0].TongSoTrang);   
    });
  });

  app.get('/linhvuc/linhvuclast', (request, response) => {
    var mysort = { _id: -1 };
    linhvuc.find().sort(mysort).limit(1).toArray(function(error, result)  {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result[0].LinhVuc);   
    });
  });

  app.get('/linhvuc/linhvuc',(request, response) => {
    linhvuc.find({}).toArray((error, result) => {
      var linhVucTable = [];
      if(error) {
          return response.status(500).send(error);
      }
        for (i=0;i<result.length;i++){
          linhVucTable[i]=result[i].LinhVuc;   
        }
      response.send(linhVucTable);
      console.log(linhVucTable);
  });
  });

  app.delete('/linhvuc/get/:id', (request, response) => {
    var getid = request.params.id;
    //collection.deleteOne({_id: ObjectID(getid)}, (error, result) => {
    linhvuc.deleteOne({_id: getid}, (error, result) => {
        if(error) {
          return response.status(500).send(error);
        }
        response.send(result);
        console.log('da xoa 1 database');
    })
  });

  app.delete('/linhvuc/linhvuc/:linhvuc', (request, response) => {
    var getLinhVuc = request.params.linhvuc;
    //collection.deleteOne({_id: ObjectID(getid)}, (error, result) => {
    linhvuc.deleteOne({LinhVuc: getLinhVuc}, (error, result) => {
        if(error) {
          return response.status(500).send(error);
        }
        response.send(result);
        console.log(getLinhVuc);
        console.log('da xoa 1 database theo Linh Vuc');
    })
  });

  app.put('/linhvuc/linhvuc/:linhvuc', (request, response) => {
    var getLinhVuc = request.params.linhvuc;
    var data = request.body;
    //collection.deleteOne({_id: ObjectID(getid)}, (error, result) => {
    linhvuc.updateOne({LinhVuc: getLinhVuc},{$set: data}, (error, result) => {
        if(error) {
          return response.status(500).send(error);
        }
        response.send(result);
        console.log(getLinhVuc);
        console.log('da update 1 database theo Linh Vuc');
    })
  });

  app.get('/linhvuc/page/:linhvuc', (request, response) => {
    var getLinhVuc = request.params.linhvuc;
    linhvuc.find({LinhVuc:getLinhVuc}).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result[0].TongSoTrang);
        console.log(result[0].TongSoTrang);
    });
  });

  app.get('/linhvuc/link/:linhvuc', (request, response) => {
    var getLinhVuc = request.params.linhvuc;
    var getLink = getLinhVuc.replace(/`/gi, '/');
    linhvuc.find({link:getLink}).toArray((error, result) => {
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