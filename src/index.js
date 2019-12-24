import React from 'react';
import ReactDOM from 'react-dom';
// import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import Select from 'react-select';
import { BallBeat } from 'react-pure-loaders';
import './Style.css';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import {IoMdTrash,IoMdCreate,IoMdCheckmarkCircleOutline} from 'react-icons/io';
import '../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

const normalize = require('normalize-text').normalizeWhitespaces;

var x='';

export default class Index extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
        items:[],
        lists:[],
        pages:[],
        selectedField:'', // only contains val
        listSelectedField:[], // only contains val
        selectedOptions:[], //It's not a good idea, but can run, it contains all info, inc:val + label
        selectedPage:"",
        isLoaded:false,
        isAdded:false,
      }  
  }

  CellFormatter(cell, row){
    return (<div><p title={cell}>{cell}</p></div>);
  }

  WebsiteFormatter(cell, row) {
    var str=cell;
    var link=[];
    var n=0;
    var temp=str.indexOf(";");
    if (temp != -1)
    {
      while ((temp != -1) && n<2)
      {
        n=n+1;
        link[n]=str.substring(0,str.indexOf(";"));
        var replacedStr = link[n]+';';
        console.log('REPLACE STRING: ',replacedStr);
        str=str.replace(replacedStr,'');
        console.log('real STRING: ',str);
        temp=str.indexOf(";");
        console.log('TEMP: ',temp);
      }
      link[n+1]=normalize(str);
      return (
        <div>
        {link.map((tempLink) => <div><a title={tempLink} href={"http://"+tempLink} target="_blank">{tempLink}</a></div>)}
        </div>
      );
    }
    else
    {
      return (<div><a title={cell} href={"http://"+cell} target="_blank">{cell}</a></div>);
    }
  }

  getLink() {
    axios.get('/getlink/1')
    .then(res => {
      this.setState({
          isAdded: true,
          items: res.data,
      })
    })
    .catch(error => console.log(error));
  }

  
  getAllData(i,n) {
        var TempUrl='/getlink/'+i;
        axios.get(TempUrl)
        .then(res => {this.saveDataCompany(res.data)})
        .then(()=>
          {if (i<n){
            this.getAllData(i+1,n);
          }
          else{
            alert('Da load xong toan bo database');
          }})
        .catch(error => console.log(error))
  }

  getField() {
    var Temp=[];
    axios.get('/field/allfields')
    .then(res => {(res.data).map((data1,i) => Temp[i]={value:data1,label:data1})
    })

    .then(()=>  this.setState({
           lists:Temp,       
    }))
    .then(()=>console.log('List linh Vuc: ',this.state.lists))
    .then(() => console.log(Temp))
    .catch(error => console.log(error));
  }

  getPageByField(obj) {
    var TempUrl = '/field/page/'+obj;
    axios.get(TempUrl)
    //.then(res =>{console.log(res.data)})
    .then(res => {
      var TempPages=[];
      for(var j=1;j<=Number(res.data);j++){
          TempPages[j]=j;
      };
      this.setState({
        pages: TempPages,       
      })
    })
    .catch(error => console.log(error));
  }

  getLastPage() {
    axios.get('/field/pagelast')
    .then(res => {
      var TempPages=[];
      for(var j=1;j<=Number(res.data);j++){
          TempPages[j]=j;
      };
      this.setState({
        pages: TempPages,       
      })
    })
    .catch(error => console.log(error));
  }
  
  getLastField() {
    axios.get('/field/fieldlast')
    .then(res => {
      this.setState({
        selectedField: res.data,     
        selectedOptions: {value:res.data,label:res.data},
        selectedPage: '1',  
      })
    })
    .catch(error => console.log(error));
  }

  getDataByField(obj){
    var TempUrl='/company/'+obj;
    axios.get(TempUrl)
    .then(res => {
      this.setState({
          items: this.state.items.concat(res.data)
      })
    })
    .then(console.log(TempUrl))
    .catch(error => console.log(error));
  }

  getDataByFieldAndPage(obj,temp){
    if (temp=='Toan Bo Database'){
      var TempUrl='/company/'+obj;
    }
    else{
      var TempUrl='/company/'+obj+'/'+temp;
    }
    axios.get(TempUrl)
    .then(res => {
      this.setState({
          items: res.data,
      })
    })
    .then(console.log(TempUrl))
    .catch(error => console.log(error));
  }

  saveDataCompany(obj) { 
      console.log('Dang chay ham Luu Thong Tin');
      axios.post('/company',obj)
      .then(console.log('Da chay xong ham luu thong tin'));
  }

  saveLink(){
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
          .then(() => this.setState({
                              isLoaded:true,
                              items:[]
                            }))
          .then(() => this.getLink())
          .then(() => this.getField())
          .then(() => this.getLastPage())
          .then(()=> document.getElementById('linkInput').value='')
          .then(()=> this.getLastField())
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
  
  DeleteCompanyByField(){
    if (this.state.selectedField!=''){
      var TempUrl='/company/field/'+this.state.selectedField;
      axios.delete(TempUrl)
        .then(res => this.DeleteFieldByField(this.state.selectedField))
        .then(() => document.getElementById('LinhVucInput').style.visibility='hidden')
        .then(() => document.getElementById('btnUpdate').style.visibility='hidden')
        .then(() =>document.getElementById('dropDownLinhVuc').value='')
        .then(() => this.getField())
        .catch(error => console.log(error));
      }
      else if (this.state.listSelectedField!=[]){
        this.state.listSelectedField.map((data) => {
          var TempEachUrl='/company/field/'+data;
          axios.delete(TempEachUrl)
          .then(res => this.DeleteFieldByField(data))
          .then(() => this.getField())
          .catch(error => console.log(error));
        });
        document.getElementById('LinhVucInput').style.visibility='hidden';
        document.getElementById('btnUpdate').style.visibility='hidden';
      }
      else {
        alert('Vui lòng chọn lĩnh vực để xoá');
      }
  }

  DeleteFieldByField(obj){
    var TempUrl='/field/'+obj;
    axios.delete(TempUrl)
    .then(res => alert('Đã xoá lĩnh vực ' + obj))
    .then(() => {
        this.setState({
          selectedField:'',
          selectedOptions:[],
          items:[],
        })
    })
    .catch(error => console.log(error));
  }

  UpdateCompanyByField(){
      var TempUrl='/company/'+this.state.selectedField;
      x=normalize(document.getElementById('LinhVucInput').value);
      if ((x!="") && (this.state.selectedField!='')){
        axios.put(TempUrl,{Field : x})
        .then(res => this.UpdateFieldByField())
        .then(() => document.getElementById('LinhVucInput').style.visibility='hidden')
        .then(() => document.getElementById('btnUpdate').style.visibility='hidden')
        .catch(error => console.log(error));
      }
      else{
        alert('Vui lòng nhập đủ thông tin');
      }
  }

  UpdateFieldByField(){
    var TempUrl='/field/'+this.state.selectedField;
    x=normalize(document.getElementById('LinhVucInput').value);
    axios.put(TempUrl,{Field : x})
    .then(() => alert('Đã update lĩnh vực ' + this.state.selectedField))
    .then(() => this.getField())
    .then(() => document.getElementById('LinhVucInput').value='')
    .then(() => {
        this.setState({
          selectedField:'',
          selectedOptions:[],
          items:[],
        })
    })
    .catch(error => console.log(error));
  }


  LinhVucSelectOnChange(event){
    this.setState({ selectedOptions : event});
    console.log('Linh Vuc dang chon: ',this.state.selectedOptions);
    if (event != null){
      console.log(' So Luong linh vuc dg chon: ',event.length);
      if (event.length==1)
      {
        this.setState({
          listSelectedField:[],
          selectedField: event[0].value,
          selectedPage:'Toan Bo Database',
          items:[],
          isLoaded:true,
        });
        var Temp=event[0].value;
        console.log('Linh vuc dg chon: ',Temp);
        this.getDataByField(Temp);
        this.getPageByField(Temp);
      }
      else
      {
        var Temp1=[];
        event.map((field,i) => Temp1[i]=field.value);
        console.log('Linh vuc dg chon: ',Temp1);
        this.setState({
          listSelectedField:Temp1,
          pages:[],
          items:[],
          isLoaded:true,
          selectedField:'',
        });
        Temp1.map((fieldGotten) => this.getDataByField(fieldGotten));
      }
    }
    else
    {
      this.setState({
        listSelectedField:[],
        pages:[],
        items:[],
        selectedField:'',
      });
    }
    // if (Temp!='Gia Tri Khong Ton Tai'){
    //   this.getPageByField(Temp);
    // }else{
    //   this.setState({
    //     pages:[],
    //     isLoaded:false,
    //   });
    // }
  }

  PageSelectOnChange(event){
    this.setState({
      selectedPage: event.target.value,
      items:[],
      isLoaded:true,
    });
    var Temp=event.target.value;
    var LinhVuc=this.state.selectedField;
    this.getDataByFieldAndPage(LinhVuc,Temp);
  }

  UpdateTrueFalse(){
      document.getElementById('LinhVucInput').style.visibility='visible';
      document.getElementById('btnUpdate').style.visibility='visible';
  }

  componentDidMount() {
      this.getField();
      document.getElementById('btnGet').onclick=this.saveLink.bind(this);
      document.getElementById('btnDel').onclick=this.DeleteCompanyByField.bind(this);
      document.getElementById('btnUpdate').onclick=this.UpdateCompanyByField.bind(this);
      document.getElementById('btnUpdateAsk').onclick=this.UpdateTrueFalse.bind(this);
  }

  componentDidUpdate(nextProps, nextState) {
    if ((this.state.items.length > 0) && (this.state.isAdded))
    {
      this.getAllData(1,this.state.pages.length-1);
      this.setState({isAdded:false});
    }
    if ((this.state.items.length > 0) && (this.state.isLoaded)) 
    {
      this.setState({isLoaded:false});
    }

  }


  render() {
    var {isLoaded,items,lists,pages} = this.state;

    const options = {
      expandRowBgColor:  '#687864',
      noDataText: <BallBeat
                    color={'#4f4f4f'}
                    loading={isLoaded}
                  />
    };

    const selectRow = {
      mode: 'checkbox',  // multi select
      bgColor: '#e3e3e3',
      className: 'CustomSelectRow',
      hideSelectColumn: true,  // enable hide selection column.
      clickToSelect: true,  // click to select, default is false
      clickToExpand: true  // click to expand row, default is false
    };


      return (
      <div className="App container-fluid"> 

          <div className="Center">
              <input className="Nhap" type="text" id="linkInput" placeholder="Nhap duong link muon lay thong tin"/>
              <br></br>
              <button id="btnGet" >CRAWL DATA</button>
          </div>
          <div className="cung1hang">
              <Select id="dropDownLinhVuc"
                isMulti
                value={this.state.selectedOptions}
                onChange={this.LinhVucSelectOnChange.bind(this)}
                options={lists}
              />
              {/* <select multiple className="SelectBox" id="dropDownLinhVuc" value={this.state.selectedField} onChange={this.LinhVucSelectOnChange.bind(this)} placeholder="Nhập lĩnh vực abc">
                    <option value='Gia Tri Khong Ton Tai'> -- Chọn Lĩnh Vực -- </option>
                    {this.state.lists.map((list) => <option key={list} value={list}>{list}</option>)}
              </select>  */}
                <IoMdTrash className="icon" id="btnDel"/>
                <IoMdCreate className="icon" id="btnUpdateAsk"/>
          </div>

          <br></br>
          <div className="cung1hang">
            <input className="ThayDoi" type="text" id="LinhVucInput" style={{width:400+'px'}} placeholder="Nhap ten linh vuc muon doi"/>
            <IoMdCheckmarkCircleOutline className="icon" id="btnUpdate"/>
          </div>
          <br></br>
          <div className="Right">
              <select className="SelectBox" id="dropDownPage" value={this.state.selectedPage} onChange={this.PageSelectOnChange.bind(this)}>
                    <option value='Toan Bo Database'> -- Tất cả Trang -- </option>
                    {this.state.pages.map((page) => <option key={page} value={page}>Trang {page}</option>)}
              </select>
          </div>
          <div>
          <BootstrapTable data={items} striped hover multiColumnSort={ 9 } exportCSV={ true } pagination 
          headerStyle={ { color:'#fff',background:'#31708E'} }
          options={ options }
          containerStyle={{width: '100%',overflow: 'scroll'}}
          selectRow={ selectRow }>
            <TableHeaderColumn row='0' colSpan='10' dataSort csvHeader='Company' headerAlign='center'>Thông tin Công Ty</TableHeaderColumn>
            <TableHeaderColumn row='1' width='250' isKey dataField='CompanyName' headerAlign='center' dataSort={true} tdStyle={ { whiteSpace: 'normal',border: 'black 1px solid' } } filter={ { type: 'RegexFilter', placeholder: 'Enter a text' } }>Tên Công Ty</TableHeaderColumn>
            <TableHeaderColumn row='1' dataField='_id'  tdStyle={ { whiteSpace: 'normal' } } hidden>id</TableHeaderColumn>
            <TableHeaderColumn row='1'  width='300'  dataField='Adress' headerAlign='center' dataSort={true} tdStyle={ { whiteSpace: 'normal',border: 'black 1px solid' } } filter={ { type: 'RegexFilter', placeholder: 'Enter a text' } }>Địa Chỉ</TableHeaderColumn>
            <TableHeaderColumn row='1'  width='100' dataField='Field' headerAlign='center' dataSort={true} tdStyle={ { whiteSpace: 'normal' ,border: 'black 1px solid'} } filter={ { type: 'RegexFilter', placeholder: 'Enter a text' } }>Lĩnh Vực</TableHeaderColumn>
            <TableHeaderColumn row='1'  width='150' dataField='Tel' headerAlign='center' dataSort={true} tdStyle={ { whiteSpace: 'normal',border: 'black 1px solid' } } filter={ { type: 'RegexFilter', placeholder: 'Enter a phone' } }>Số Điện Thoại</TableHeaderColumn>
            <TableHeaderColumn row='1'  width='150' dataField='Email' headerAlign='center' dataSort={true} tdStyle={ { whiteSpace: 'normal',border: 'black 1px solid' } } dataFormat={this.CellFormatter} filter={ { type: 'RegexFilter', placeholder: 'Enter an email' } }>Email</TableHeaderColumn>
            <TableHeaderColumn row='1'  width='150' dataField='Website' headerAlign='center' dataSort={true} tdStyle={ { whiteSpace: 'normal',border: 'black 1px solid' } } dataFormat={this.WebsiteFormatter} filter={ { type: 'RegexFilter', placeholder: 'Enter a text' } }>Website</TableHeaderColumn>
            <TableHeaderColumn row='1'  width=  '200'  dataField='NameContact' headerAlign='center' dataSort={true} tdStyle={ { whiteSpace: 'normal',border: 'black 1px solid' } } filter={ { type: 'RegexFilter', placeholder: 'Enter a text' } }>Họ Tên Người Liên Hệ</TableHeaderColumn>
            <TableHeaderColumn row='1'  width='150'  dataField='EmailContact' headerAlign='center' dataSort={true} tdStyle={ { whiteSpace: 'normal',border: 'black 1px solid' } } dataFormat={this.CellFormatter} filter={ { type: 'RegexFilter', placeholder: 'Enter a email' } }>Email Người Liên Hệ</TableHeaderColumn>
            <TableHeaderColumn row='1'  width='150'  dataField='TelContact' headerAlign='center' dataSort={true} tdStyle={ { whiteSpace: 'normal',border: 'black 1px solid' } } filter={ { type: 'RegexFilter', placeholder: 'Enter a phone' } }>Số điện thoại Người Liên Hệ</TableHeaderColumn>
            <TableHeaderColumn row='1'  width='150'  dataField='CellPhoneContact' headerAlign='center' dataSort={true} tdStyle={ { whiteSpace: 'normal',border: 'black 1px solid' } } filter={ { type: 'RegexFilter', placeholder: 'Enter a phone' } }>Số di động Người Liên Hệ</TableHeaderColumn>
            </BootstrapTable>
          </div>
      </div>);
  }
}

ReactDOM.render(<Index />, document.getElementById('root'));
