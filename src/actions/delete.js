import axios from 'axios';
import {getField} from './get';

export const DeleteCompanyByField = () => async (dispatch,getState) => {
    const {selectedField,listSelectedField} = getState().appData;
    if (selectedField!=''){
      var TempUrl='/company/field/'+selectedField;
      axios.delete(TempUrl)
        .then(res => dispatch(DeleteFieldByField(selectedField)))
        .then(() => document.getElementById('LinhVucInput').style.visibility='hidden')
        .then(() => document.getElementById('btnUpdate').style.visibility='hidden')
        .then(() =>document.getElementById('dropDownLinhVuc').value='')
        .then(() => dispatch(getField()))
        .catch(error => console.log(error));
      }
      else if (listSelectedField!=[]){
        listSelectedField.map((data) => {
          var TempEachUrl='/company/field/'+data;
          axios.delete(TempEachUrl)
          .then(res => dispatch(DeleteFieldByField(data)))
          .then(() => dispatch(getField()))
          .catch(error => console.log(error));
        });
        document.getElementById('LinhVucInput').style.visibility='hidden';
        document.getElementById('btnUpdate').style.visibility='hidden';
      }
      else {
        alert('Vui lòng chọn lĩnh vực để xoá');
      }
  }
  
  export const  DeleteFieldByField =(obj) => async dispatch => {
    var TempUrl='/field/'+obj;
    axios.delete(TempUrl)
    .then(res => alert('Đã xoá lĩnh vực ' + obj))
    .then(() => {
        dispatch({
          type:'DELETE_FIELD_BY_FIELD',
          payload: {
            selectedField:'',
            selectedOptions:[],
            items:[],
          }
        })
    })
    .catch(error => console.log(error));
  }