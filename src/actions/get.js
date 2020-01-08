import axios from 'axios';

export const getLink = () => async dispatch => {
    await axios.get('/getlink/1')
    .then(res => {
      dispatch({
          type: 'GET_LINK',
          payload: {
            isAdded: true,
            items: res.data,
          }
      });
    })
    .catch(error => console.log(error));
  }
  
  export const getField = () => async dispatch => {
    var Temp=[];
    axios.get('/field/allfields')
    .then(res => {  (res.data).map((data1,i) => Temp[i]={value:data1,label:data1})  })
    .then(()=>  {
      dispatch({
        type: 'GET_FIELD',
        payload: {  lists: Temp  }
      })
    })
    .then(() => console.log(Temp))
    .catch(error => console.log(error));
  }
  
  export const getPageByField = (obj) => async dispatch => {
    var TempUrl = '/field/page/'+obj;
    var TempPages=[];
    axios.get(TempUrl)
    .then(res => {
        for(var j=1;j<=Number(res.data);j++)  { TempPages[j]=j;  }
    })
    .then(() => {
      dispatch({
        type: 'GET_PAGE_BY_FIELD',
        payload: {  data: TempPages  }
      })
    })
    .catch(error => console.log(error));
  }
  
  export const  getLastPage = () => async dispatch => {
    var TempPages=[];
    axios.get('/field/pagelast')
    .then(res => {
        for(var j=1;j<=Number(res.data);j++)  { TempPages[j]=j;  }
    })
    .then(() => {
      dispatch({
        type: 'GET_LAST_PAGE',
        payload: {  data: TempPages  }
      })
    })
    .catch(error => console.log(error));
  }
  
  export const  getLastField = () => async dispatch => {
    axios.get('/field/fieldlast')
    .then(res => {
      dispatch({
        type: 'GET_LAST_FIELD',
        payload: {
          selectedField: res.data,     
          selectedOptions: {value:res.data,label:res.data},
          selectedPage: '1',  
        }
      })
    })
    .catch(error => console.log(error));
  }
  
  export const  getDataByField = (obj) => async dispatch => {
    var TempUrl='/company/'+obj;
    axios.get(TempUrl)
    .then(res => {
      dispatch({
        type: 'GET_DATA_BY_FIELD',
        payload: {  data: res.data  }
      })
    })
    .catch(error => console.log(error));
  }
  
  export const getDataByFieldAndPage = (obj,temp) => async dispatch => {
    if (temp=='Toan Bo Database'){
      var TempUrl='/company/'+obj;
    }
    else{
      var TempUrl='/company/'+obj+'/'+temp;
    }
    axios.get(TempUrl)
    .then(res => {
      dispatch({
        type: 'GET_DATA_BY_FIELD_AND_PAGE',
        payload: {  data: res.data  }
      })
    })
    .then(console.log(TempUrl))
    .catch(error => console.log(error));
  }

  export const  getUser = () => async dispatch => {
    axios.get('/user/')
    .then(res => {
      dispatch({
        type: 'GET_USER',
        payload: {
          User: res.data.User,     
          Password: res.data.Password, 
        }
      })
    })
    .catch(error => console.log(error));
  }