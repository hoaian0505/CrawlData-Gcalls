import React from 'react';
import ReactDOM from 'react-dom';
import '../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import Select from 'react-select';
import { BallBeat } from 'react-pure-loaders';
import './Style.css';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import {IoMdTrash,IoMdCreate,IoMdCheckmarkCircleOutline,IoIosLogOut} from 'react-icons/io';
import { connect } from 'react-redux';
import {LinhVucSelectOnChange,PageSelectOnChange,Reload} from './actions/actions';
import {getField} from './actions/get';
import {saveLink,saveData} from './actions/post';
import {DeleteCompanyByField} from './actions/delete';
import {UpdateCompanyByField} from './actions/put';

const normalize = require('normalize-text').normalizeWhitespaces;

var x='';
 
class App extends React.Component {

  constructor(props) {
      super(props); 
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
        // console.log('REPLACE STRING: ',replacedStr);
        str=str.replace(replacedStr,'');
        // console.log('real STRING: ',str);
        temp=str.indexOf(";");
        // console.log('TEMP: ',temp);
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

  UpdateTrueFalse(){
      document.getElementById('LinhVucInput').style.visibility='visible';
      document.getElementById('btnUpdate').style.visibility='visible';
  }

  LogOut(){
    localStorage.setItem('loggedIn',false);
    this.props.history.push("/");
  }

  componentDidMount() {
      const {getField,saveLink,DeleteCompanyByField,UpdateCompanyByField,appData} = this.props;
      const loggedIn=Boolean(localStorage.getItem('loggedIn') == 'true');
      if (loggedIn==false){
        this.props.history.push("/");
      }
      getField();
      document.getElementById('btnGet').onclick=saveLink.bind(this);
      document.getElementById('btnDel').onclick=DeleteCompanyByField.bind(this);
      document.getElementById('btnLogOut').onclick=this.LogOut.bind(this);
      document.getElementById('btnUpdate').onclick=UpdateCompanyByField.bind(this);
      document.getElementById('btnUpdateAsk').onclick=this.UpdateTrueFalse.bind(this);
      console.log(appData.lists);
  }

  componentDidUpdate(nextProps, nextState) {
    const {saveData,Reload,appData} = this.props;
    if ((appData.items.length > 0) && (appData.isAdded))
    {
      saveData(appData.pages.length-1);
    }
    if ((appData.items.length > 0) && (appData.isLoaded)) 
    {
      Reload();
    }
  }


  render() {
    const {appData,LinhVucSelectOnChange,PageSelectOnChange} = this.props;
    const loggedIn=Boolean(localStorage.getItem('loggedIn') == 'true');

    const options = {
      expandRowBgColor:  '#687864',
      noDataText: <BallBeat
                    color={'#4f4f4f'}
                    loading={appData.isLoaded}
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
          <header className="Tittle">
              CRAWL DATA PROJECT
              <IoIosLogOut className="iconLogOut" id="btnLogOut"/>
          </header>
          <div className="Center">
              <input className="Nhap" type="text" id="linkInput" placeholder="Nhap duong link muon lay thong tin"/>
              <br></br>
              <button id="btnGet" >CRAWL DATA</button>
          </div>
          <div className="cung1hang">
              <Select id="dropDownLinhVuc"
                isMulti
                value={appData.selectedOptions}
                onChange={LinhVucSelectOnChange.bind(this)}
                options={appData.lists}
              />
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
              <select className="SelectBox" id="dropDownPage" value={appData.selectedPage} onChange={PageSelectOnChange.bind(this)}>
                    <option value='Toan Bo Database'> -- Tất cả Trang -- </option>
                    {appData.pages.map((page) => <option key={page} value={page}>Trang {page}</option>)}
              </select>
          </div>
          <div>
          <BootstrapTable data={appData.items} striped hover multiColumnSort={ 9 } exportCSV={ true } pagination 
          headerStyle={ { color:'#fff',background:'#31708E'} }
          options={ options }

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
        <footer><h3>Copyright © 2019 GCALLS ®</h3></footer>
      </div>);
  }
}

function mapStateToProps (state) {
  return {
    appData: state.appData
  }
}

function mapDispatchToProps (dispatch) {
  return {
    saveLink: (e) => dispatch(saveLink(e)),
    DeleteCompanyByField: (e) => dispatch(DeleteCompanyByField(e)),
    UpdateCompanyByField: (e) => dispatch(UpdateCompanyByField(e)),
    LinhVucSelectOnChange: (e) => dispatch(LinhVucSelectOnChange(e)),
    PageSelectOnChange: (e) => dispatch(PageSelectOnChange(e)),
    saveData: (e) => dispatch(saveData(e)),
    Reload: () => dispatch(Reload()),
    getField: () => dispatch(getField())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
