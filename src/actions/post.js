import axios from 'axios';
const normalize = require('normalize-text').normalizeWhitespaces;
import {getLink,getField,getLastPage,getLastField} from './get';
var x='';

export const getAllData = (i,n) => async dispatch => {
    var TempUrl='/getlink/'+i;
    axios.get(TempUrl)
    .then(res => dispatch( saveDataCompany(res.data) ))
    .then(()=>
      {if (i<n){
        this.getAllData(i+1,n);
      }
      else{
        alert('Da load xong toan bo database');
      }})
    .catch(error => console.log(error))
  }
  
  export const saveDataCompany = (obj) => async dispatch => { 
    console.log('Dang chay ham Luu Thong Tin');
    axios.post('/company',obj)
    .then(console.log('Da chay xong ham luu thong tin'));
  }
  
  export const saveData = (event) => async dispatch => {
    dispatch(getAllData(1,event));
    dispatch({
      type:'SAVE_DATA',
      payload:{
        isAdded:false
      }
    })
  }

  export const saveLink = () => async dispatch => {
    x=normalize(document.getElementById('linkInput').value);
    console.log('duong link: ',x);
    x=x.substring(0,x.indexOf(".html"));
    x=x.replace(/ /g,'');
    console.log('duong link: ',x);
    if (x!=""){
      var z='/';
      var k=new RegExp(z,'gi');
      var y=x.replace(k,'`');
      var Temp = '/field/link/'+y;
      axios.get(Temp)
      .then(res =>
        {if (res.data==false){
          axios.post('/field',{link:x})
          .then(res => console.log(res))
          .then(() => dispatch({
                              type: 'SAVE_LINK',
                              payload:{
                                isLoaded:true,
                                items:[]
                              }
                            }))
          .then(() => dispatch(getLink()))
          .then(() => dispatch(getField()))
          .then(() => dispatch(getLastPage()))
          .then(()=> document.getElementById('linkInput').value='')
          .then(()=> dispatch(getLastField()))
          .catch(error => console.log(error));
        }
        else{
          alert('Thong tin can lay da duoc lay tu truoc!');
      }})
      .catch(error => console.log(error));
    }
    else{
      alert('Vui long nhap du thong tin');
    }
  }