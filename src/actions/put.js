import axios from 'axios';
const normalize = require('normalize-text').normalizeWhitespaces;
import {getField} from './get';
var x='';

export const UpdateCompanyByField = () => async (dispatch,getState) => {
    const {selectedField} = getState().appData;
      var TempUrl='/company/'+selectedField;
      x=normalize(document.getElementById('LinhVucInput').value);
      if ((x!="") && (selectedField!='')){
        axios.put(TempUrl,{Field : x})
        .then(res => dispatch(UpdateFieldByField()))
        .then(() => document.getElementById('LinhVucInput').style.visibility='hidden')
        .then(() => document.getElementById('btnUpdate').style.visibility='hidden')
        .catch(error => console.log(error));
      }
      else{
        alert('Vui lòng nhập đủ thông tin');
      }
  }
  
  export const UpdateFieldByField = () => async (dispatch,getState) => {
    const {selectedField} = getState().appData;
    var TempUrl='/field/'+selectedField;
    x=normalize(document.getElementById('LinhVucInput').value);
    axios.put(TempUrl,{Field : x})
    .then(() => alert('Đã update lĩnh vực ' + selectedField))
    .then(() => dispatch(getField()))
    .then(() => document.getElementById('LinhVucInput').value='')
    .then(() => {
        dispatch({
          type:'UPDATE_FIELD_BY_FIELD',
          payload: {
            selectedField:'',
            selectedOptions:[],
            items:[],
          }
        })
    })
    .catch(error => console.log(error));
  }
  