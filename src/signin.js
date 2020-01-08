import React from 'react';
import { connect } from 'react-redux';
import {getUser} from './actions/get';
import './Style.css';

class Signin extends React.Component {
    constructor(props) {
        super(props); 
    }
    
    checkUserPassword(){
        const {appData} = this.props;
        var user = document.getElementById('inputUser').value;
        var password = document.getElementById('inputPassword').value;
        console.log('USER: ',user);
        console.log('PASSWORD: ',password);
        if ((user == appData.User) &&
            (password == appData.Password))
        {
            localStorage.setItem('loggedIn',true);
            this.props.history.push("/app/home");
        }
        else
        {
            alert('Wrong User or Password, please try again!!');
        }
    }

    componentDidMount() {
        const {getUser} = this.props;
        const loggedIn=Boolean(localStorage.getItem('loggedIn') == 'true');
        if (loggedIn==true){
          this.props.history.push("/app/home");
        }
        getUser();
    }

    render() {
        return (
          <div class="container-fluid">
            <header className="Tittle">SIGN IN</header>
            <form class="form-horizontal">
              <div class="form-group">
                <label class="col-sm-2 control-label"> User name</label>
                <div class="col-sm-10">
                  <input type="text" class="form-control"  id="inputUser" placeholder="User Name" required autoFocus />
                </div>
              </div>
              <div class="form-group">
                <label class="col-sm-2 control-label"> Password</label>
                <div class="col-sm-10">
                  <input type="password" class="form-control" id="inputPassword" placeholder="Password" required />
                </div>
              </div> 
              <div class="form-group">
                <div class="col-sm-offset-2 col-sm-10">
                  <button type="submit" class="btn btn-default" onClick={this.checkUserPassword.bind(this)}>Sign in</button>
                </div>
              </div>  
            </form>
            <footer><h3>Copyright © 2019 GCALLS ®</h3></footer>
          </div>
        )
    }
}

function mapStateToProps (state) {
    return {
      appData: state.appData
    }
  }

  function mapDispatchToProps (dispatch) {
    return {
      getUser: () => dispatch(getUser())
    }
  }

export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(Signin)