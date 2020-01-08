// actions.js
import {getDataByField,getDataByFieldAndPage,getPageByField} from './get';

export const LinhVucSelectOnChange = (event) => async dispatch => {
  dispatch({
    type: 'FIELD_SELECTED',
    payload: {selectedOptions : event} 
  });
  console.log('Linh Vuc dang chon: ',event);
  if (event != null){
    if (event.length !=0){
      console.log(' So Luong linh vuc dg chon: ',event.length);
      if (event.length==1)
      {
        dispatch({
          type:'SELECTED_ONE',
          payload: {
            listSelectedField:[],
            selectedField: event[0].value,
            selectedPage:'Toan Bo Database',
            items:[],
            isLoaded:true,
          }
        });
        var Temp=event[0].value;
        console.log('Linh vuc dg chon: ',Temp);
        dispatch(getDataByField(Temp));
        dispatch(getPageByField(Temp));
      }
      else
      {
        var Temp1=[];
        event.map((field,i) => Temp1[i]=field.value);
        console.log('Linh vuc dg chon: ',Temp1);
        dispatch({
          type:'SELECTED_MANY',
          payload: {
            listSelectedField:Temp1,
            pages:[],
            items:[],
            isLoaded:true,
            selectedField:'',
          }
        });
        Temp1.map((fieldGotten) => dispatch(getDataByField(fieldGotten)));
      }
    }
  }
  else
  {
    dispatch(Reload());
    dispatch({
      type:'NONE_SELECTED',
      payload: {
        listSelectedField:[],
        pages:[],
        items:[],
        selectedField:'',
      }
    });
  }
}

export const PageSelectOnChange = (event) => async (dispatch,getState) => {
  const {selectedField} = getState().appData;
  dispatch({
    type:'PAGE_SELECT_ON_CHANGE',
    payload: {
      selectedPage: event.target.value,
      items:[],
      isLoaded:true,
    }
  });
  var Temp=event.target.value;
  var LinhVuc=selectedField;
  dispatch(getDataByFieldAndPage(LinhVuc,Temp));
}

export const Reload = () => async dispatch => {
  dispatch({
    type:'RELOAD',
    payload:{
      isLoaded:false
    }
  })
}