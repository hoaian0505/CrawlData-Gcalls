import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Select from 'react-select';
import './Style.css';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import {IoMdTrash,IoMdCreate,IoMdCheckmarkCircleOutline} from 'react-icons/io';

var x='';


class BSTable extends React.Component {
  render() {
    if (this.props.data) {
      return (
        <BootstrapTable data={ this.props.data }>
          <TableHeaderColumn row='0' colSpan='4' dataSort csvHeader='Contact' headerAlign='center' >Thông tin Người Liên Hệ</TableHeaderColumn>
          <TableHeaderColumn row='1'  isKey={true} dataField='HoTenNguoiLienHe' width='25%' headerAlign='center' dataSort={true} filter={ { type: 'RegexFilter', placeholder: 'Enter a text' } }>Ho Ten Nguoi Lien He</TableHeaderColumn>
          <TableHeaderColumn row='1'  dataField='EmailNguoiLienHe' width='25%' headerAlign='center' dataSort={true} filter={ { type: 'RegexFilter', placeholder: 'Enter a email' } }>Email Nguoi Lien He</TableHeaderColumn>
          <TableHeaderColumn row='1'  dataField='SoDienThoaiNguoiLienHe' width='25%' headerAlign='center' dataSort={true} filter={ { type: 'RegexFilter', placeholder: 'Enter a phone' } }>So Dien Thoai Nguoi Lien He</TableHeaderColumn>
          <TableHeaderColumn row='1'  dataField='SoDiDongNguoiLienHe' width='25%' headerAlign='center' dataSort={true} filter={ { type: 'RegexFilter', placeholder: 'Enter a phone' } }>So Di Dong Nguoi Lien He</TableHeaderColumn>
        </BootstrapTable>);
    } else {
      return (<p>Không có thông tin về bộ phận liên hệ</p>);
    }
  }
}

export default class Index extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
        items:[],
        lists:[],
        pages:[],
        selectedLinhVuc:"",
        selectedPage:"",
        isLoaded:false,
        isAdded:false,
      }  
  }

  isExpandableRow(row) {
    return true;
  }

  expandComponent(row) {
    return (
      <BSTable data={ row.expand } />
    );
  }

  getLink() {
    axios.get('/getlink/1')
    .then(res => {
      this.setState({
          isLoaded: true,
          isAdded: true,
          items: res.data,
      })
    })
    .catch(error => console.log(error));
  }

  
  getAllData(i,n) {
        var TempUrl='/getlink/'+i;
        axios.get(TempUrl)
        .then(res => {this.luuThongTin(res.data)})
        .then(()=>
          {if (i<n){
            this.getAllData(i+1,n);
          }
          else{
            alert('Da load xong toan bo database');
          }})
        .catch(error => console.log(error))
  }

  getLinhVuc() {
    axios.get('/linhvuc/linhvuc')
    .then(res => {
      this.setState({
          lists: res.data,       
      })
    })
    .then(res=>console.log(this.state.lists))
    //.then(console.log(this.state.options))
    .catch(error => console.log(error));
  }

  getPageWithLinhVuc(obj) {
    var TempUrl = '/linhvuc/page/'+obj;
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
    axios.get('/linhvuc/pagelast')
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
  
  getLastLinhVuc() {
    axios.get('/linhvuc/linhvuclast')
    .then(res => {
      this.setState({
        selectedLinhVuc: res.data,     
        selectedPage: '1',  
      })
    })
    .catch(error => console.log(error));
  }

  getDataWithLinhVuc(obj){
    var TempUrl='/personnel/get/'+obj;
    axios.get(TempUrl)
    .then(res => {
      this.setState({
          items: res.data,
      })
    })
    .then(console.log(TempUrl))
    .catch(error => console.log(error));
  }

  getDataWithPage(obj,temp){
    if (temp=='Toan Bo Database'){
      var TempUrl='/personnel/get/'+obj;
    }
    else{
      var TempUrl='/personnel/get/'+obj+'/'+temp;
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

  luuThongTin(obj) { 
      console.log('Dang chay ham Luu Thong Tin');
      axios.post('/savedata',obj)
      .then(console.log('Da chay xong ham luu thong tin'));
  }

  luuLink(){
    x=document.getElementById('linkInput').value;
    x=x.substring(0,x.indexOf(".html"));
    if (x!=""){
      var z='/';
      var k=new RegExp(z,'gi');
      var y=x.replace(k,'`');
      var Temp = '/linhvuc/link/'+y;
      axios.get(Temp)
      .then(res =>
        {if (res.data==false){
          axios.post('/linhvuc/get',{link:x})
          .then(res => console.log(res))
          .then(() => this.getLink())
          .then(() => this.getLinhVuc())
          .then(() => this.getLastPage())
          .then(()=> document.getElementById('linkInput').value='')
          .then(()=> this.getLastLinhVuc())
          .catch(error => console.log(error));
        }
        else{
          alert('Thong tin can lay da duoc lay tu truoc!');
      }})
      .catch(error => console.log(error));
      // if (Check==false){
      //   axios.post('/linhvuc/get',{link:x})
      //   .then(res => console.log(res))
      //   .then(() => this.getLink())
      //   .then(() => this.getLinhVuc())
      //   .then(() => this.getLastPage())
      //   .then(()=> document.getElementById('linkInput').value='')
      //   .then(()=> this.getLastLinhVuc())
      //   .catch(error => console.log(error));
      // }
    }
    else{
      alert('Vui long nhap du thong tin');
    }
  }
  
  XoaPersonnel(){
    var TempUrl='/personnel/linhvuc/'+this.state.selectedLinhVuc;
    if (this.state.selectedLinhVuc!='Gia Tri Khong Ton Tai'){
      axios.delete(TempUrl)
      .then(res => this.XoaLinhVuc())
      .catch(error => console.log(error));
    }
    else{
      alert('Vui lòng chọn lĩnh vực để xoá');
    }
  }

  XoaLinhVuc(){
    var TempUrl='/linhvuc/linhvuc/'+this.state.selectedLinhVuc;
    axios.delete(TempUrl)
    .then(res => alert('Đã xoá lĩnh vực ' + this.state.selectedLinhVuc))
    .then(res => this.getLinhVuc())
    .then(res => {
        this.setState({
          selectedLinhVuc: 'Gia Tri Khong Ton Tai',
          items:[],
        })
    })
    .catch(error => console.log(error));
  }

  UpdatePersonnel(){
    var TempUrl='/personnel/get/'+this.state.selectedLinhVuc;
    x=document.getElementById('LinhVucInput').value;
    if ((x!="") && (this.state.selectedLinhVuc!='Gia Tri Khong Ton Tai')){
      axios.put(TempUrl,{LinhVuc : x})
      .then(res => this.UpdateLinhVuc())
      .catch(error => console.log(error));
    }
    else{
      alert('Vui lòng nhập đủ thông tin');
    }
  }

  UpdateLinhVuc(){
    var TempUrl='/linhvuc/linhvuc/'+this.state.selectedLinhVuc;
    x=document.getElementById('LinhVucInput').value;
    axios.put(TempUrl,{LinhVuc : x})
    .then(() => alert('Đã update lĩnh vực ' + this.state.selectedLinhVuc))
    .then(() => this.getLinhVuc())
    .then(() => document.getElementById('LinhVucInput').value='')
    .then(() => {
        this.setState({
          selectedLinhVuc: 'Gia Tri Khong Ton Tai',
          items:[],
        })
    })
    .catch(error => console.log(error));
  }

  LinhVucSelectOnChange(event){
    this.setState({
      selectedLinhVuc: event.target.value,
      selectedPage:'Toan Bo Database',
    });
    var Temp=event.target.value;
    this.getDataWithLinhVuc(Temp);
    if (Temp!='Gia Tri Khong Ton Tai'){
      this.getPageWithLinhVuc(Temp);
    }else{
      this.setState({pages:[]});
    }
  }

  PageSelectOnChange(event){
    this.setState({selectedPage: event.target.value});
    var Temp=event.target.value;
    var LinhVuc=this.state.selectedLinhVuc;
    this.getDataWithPage(LinhVuc,Temp);
  }

  UpdateTrueFalse(){
      document.getElementById('LinhVucInput').style.visibility='visible';
      document.getElementById('btnUpdate').style.visibility='visible';
  }

  componentDidMount() {
      this.getLinhVuc();
      document.getElementById('btnGet').onclick=this.luuLink.bind(this);
      document.getElementById('btnDel').onclick=this.XoaPersonnel.bind(this);
      document.getElementById('btnUpdate').onclick=this.UpdatePersonnel.bind(this);
      document.getElementById('btnUpdateAsk').onclick=this.UpdateTrueFalse.bind(this);
  }

  componentDidUpdate(nextProps, nextState) {
    if ((this.state.items.length > 0) && (this.state.isAdded))
    {
      this.getAllData(1,this.state.pages.length-1);
      this.setState({isAdded:false});
    }
  }


  render() {
    const options = {
      expandRowBgColor:  '#5085A5'
    };

    const selectRow = {
      mode: 'checkbox',  // multi select
      bgColor: '#40a9ff',
      hideSelectColumn: true,  // enable hide selection column.
      clickToSelect: true,  // click to select, default is false
      clickToExpand: true  // click to expand row, default is false
    };

    var {isLoaded,items,lists,pages} = this.state;
      return (
      <div className="App">
          <div className="Center">
              <input className="Nhap" type="text" id="linkInput" placeholder="Nhap duong link muon lay thong tin"/>
              <br></br>
              <button id="btnGet" >CRAWL DATA</button>
          </div>
          <div className="cung1hang">
              <select className="SelectBox" id="dropDownLinhVuc" value={this.state.selectedLinhVuc} onChange={this.LinhVucSelectOnChange.bind(this)}>
                    <option value='Gia Tri Khong Ton Tai'> -- Chọn Lĩnh Vực -- </option>
                    {this.state.lists.map((list) => <option key={list} value={list}>{list}</option>)}
              </select> 
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
          expandableRow={ this.isExpandableRow }
          expandComponent={ this.expandComponent }
          selectRow={ selectRow }>
            <TableHeaderColumn  row='0' width='20%' rowSpan='2'  dataField='TenCongTy' dataAlign='center' dataSort={true} tdStyle={ { whiteSpace: 'normal' } } filter={ { type: 'RegexFilter', placeholder: 'Enter a text' } }>Ten Cong Ty</TableHeaderColumn>
            <TableHeaderColumn   row='0' rowSpan='2'  dataField='_id' isKey={true} tdStyle={ { whiteSpace: 'normal' } } hidden>id</TableHeaderColumn>
            <TableHeaderColumn row='0' colSpan='5' dataSort csvHeader='Company' headerAlign='center'>Thông tin Công Ty</TableHeaderColumn>
            <TableHeaderColumn    row='1'  width='25%'  dataField='DiaChi' headerAlign='center' dataSort={true} tdStyle={ { whiteSpace: 'normal' } } filter={ { type: 'RegexFilter', placeholder: 'Enter a text' } }>Dia Chi</TableHeaderColumn>
            <TableHeaderColumn  row='1'  width='10%' dataField='LinhVuc' headerAlign='center' dataSort={true} tdStyle={ { whiteSpace: 'normal' } } filter={ { type: 'RegexFilter', placeholder: 'Enter a text' } }>Linh Vuc</TableHeaderColumn>
            <TableHeaderColumn  row='1'  width='15%' dataField='SoDienThoai' headerAlign='center' dataSort={true} tdStyle={ { whiteSpace: 'normal' } } filter={ { type: 'RegexFilter', placeholder: 'Enter a phone' } }>So Dien Thoai</TableHeaderColumn>
            <TableHeaderColumn row='1'  width='15%' dataField='Email' headerAlign='center' dataSort={true} tdStyle={ { whiteSpace: 'normal' } } filter={ { type: 'RegexFilter', placeholder: 'Enter a email' } }>Email</TableHeaderColumn>
            <TableHeaderColumn  row='1'  width='15%' dataField='Website' headerAlign='center' dataSort={true} tdStyle={ { whiteSpace: 'normal' } } filter={ { type: 'RegexFilter', placeholder: 'Enter a text' } }>Website</TableHeaderColumn>
            </BootstrapTable>
          </div>
      </div>);
  }
}

ReactDOM.render(<Index />, document.getElementById('root'));
