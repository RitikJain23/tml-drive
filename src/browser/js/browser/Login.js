/*
 * Minio Cloud Storage (C) 2016, 2018 Minio, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import configs from "../../../config/config.json";
import storage from "local-storage-fallback";
import React from "react";
import { connect } from "react-redux";
import logo from "../../img/logo.png";
import Alert from "../alert/Alert";
import * as actionsAlert from "../alert/actions";
import * as actionsBrowser from "./actions";
import InputGroup from "./InputGroup";
import web from "../web";
import { Redirect } from "react-router-dom";
import history from "../history";
import axios from "axios";


// export const  Username = () => {
//   console.log(this.state.username)
//   return this.state.username
// }
// export var Username
// console.log("HAHAHAHAH "+ Username)
export class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accessKey: "",
      secretKey: "",
      endPoint: "",
      bucketName: "",
    "app_name": "com.tatamotors.epc",
      "app_version": "",
      "device_id": "",
      username:"",
      password:""
    };
    this.handlemousePress = this.handlemousePress.bind(this);
    // LIVE DEMO
  }
  
  folder_creation(username){
    var user_name=username
    
    user_name=user_name+'/'
    // console.log("HHHHHHHHHHHHHHHHHHH"+ user_name)
    var AWS = require('aws-sdk');
    //AWS.config.region = 'ap-south-1';
    AWS.config.accessKeyId=configs.accessKey;
    AWS.config.secretAccessKey= configs.secretKey;
    AWS.config.region = 'ap-south-1';
    AWS.config.bucketName=configs.bucketName;
    var s3Client = new AWS.S3();

    var params = { Bucket: configs.bucketName, Key: user_name, Body:'body does not matter' };

  s3Client.putObject(params, function (err, data) {
    if (err) {
      //console.log("Error creating the folder: ", err);
    } else {
      //console.log("Successfully created a folder on S3");

      }
  });
  }
  login_s3bucket(){
    const { showAlert} = this.props;
    //console.log("The button was clicked "+this.state.username+" "+
    //this.state.password);
    // this.setState({
    //   username: (this.state.username).toUpperCase()
    // });
    axios.post("https://eguruskin.api.tatamotors/api/epc/app/login/",this.state).then(response => {
      //console.log("Heyyyyy "+JSON.stringify(response.data.token.access_token));
      var token=response.data.token.access_token;
      storage.setItem("Auth_Token",token);
    
    if(response.data.token){
      storage.setItem("Username", (this.state.username).toUpperCase());
      this.setState({
      accessKey: configs.accessKey,
      secretKey: configs.secretKey,
      endPoint: configs.endPoint,
      bucketName:configs.bucketName

    });
    // storage.setItem("AccessKeyId", response.data.accesskey);
    // storage.setItem("SecretAccessKey", response.data.secretkey);
    // storage.setItem("BucketName", response.data.bucketname);
    this.folder_creation((this.state.username).toUpperCase());
    this.handleSubmit();

    }
    
  
  }).catch(error=>{showAlert("danger", "Wrong username or password")})
    //console.log("Hiiii")
    //axios.post("https://mydrive.home.tatamotors:3000/login",this.state).then(response => {
    //Username=this.state.username  
    
    

  }
  login_auth(event){
    event.preventDefault();
    const { showAlert} = this.props;
    var message =""
    if(!this.state.username){
      message="Empty username"
    }
    if(!this.state.password){
      message="Empty password"
    }
    if(!this.state.username && !this.state.password){
      message="Empty credentials"
    }
    if (message) {
      showAlert("danger", message);
      return;
    }
    //console.log("heeee "+this.state.username)
    axios.post("https://mydrive.home.tatamotors/nodeapi/login",this.state).then(response => {
      //console.log("HIIIII "+ this.username+"   "+response.name)
      //console.log("HIIIII "+JSON.stringify(response))
      if(!response.data.errCode){
        this.login_s3bucket();
      }
      
      else{
        showAlert("danger", "Wrong username or password")
      }
    }).catch(error=>{showAlert("danger", "Wrong username or password")})
    
    
  }

  configureGeneral(e) {
    //e.preventDefault();
    history.push("/configuration");
  }

  // Handle field changes

  userNameChange(e) {
    this.setState({
      username: e.target.value
    });
    //console.log("username "+this.state.username)
  }

  passWordChange(e) {
    this.setState({
      password: e.target.value
    });
  }

  accessKeyChange(event) {
    //console.log("Inside access")
    this.setState({
      accessKey: event
    });
  }

  secretKeyChange(event) {
    this.setState({
      secretKey: event
    });
  }

  endPointChange(event) {
    //console.log("Inside end poi")
    this.setState({
      endPoint: event
    });
  }

  bucketNameChange(event) {
    this.setState({
      bucketName: event
    });
  }

  handleSubmit(event) {
    //event.preventDefault();

    // console.log("I am in handle");
    // console.log(this.state.accessKey);    
    // console.log(this.state.secretKey);
    // console.log(this.state.endPoint);    
    // console.log(this.state.bucketName);
    // console.log("I am in handle");
    const { showAlert, history } = this.props;
    let message = "";
    if (this.state.username === "") {
      message = "Username cannot be empty";
    }
    if (this.state.password =="") {
      message = "Password can't be empty";
    }
    if (this.state.accessKey === "") {
      message = "Access Key cannot be empty";
    }
    if (this.state.secretKey === "") {
      message = "Secret Key cannot be empty";
    }
    if (this.state.endPoint === "") {
      message = "End point cannot be empty";
    }
    if (
      this.state.endPoint.substring(0, 5) == "http:" &&
      location.protocol == "https:"
    ) {
      message =
        "A http:// server cannot be accessed via a https:// browser frontend";
    }
    if (
      this.state.endPoint.substring(0, 5) != "http:" &&
      this.state.endPoint.substring(0, 6) != "https:"
    ) {
      message =
        "Please add http:// or https:// in front of your endpoint";
    }
    if (this.state.bucketName === "") {
      message = "Bucket Name is required";
    }

    if (message) {
      showAlert("danger", message);
      return;
    }
    //console.log(this.state.secretKey )
    web
      .Login({
        accessKey: this.state.accessKey,
        secretKey: this.state.secretKey,
        endPoint: this.state.endPoint,
        bucketName: this.state.bucketName,
    // accessKey :'AKIAUONXKV2US5QHTYNO',
    // secretKey :'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',
    // endPoint :'https://signin.aws.amazon.com',
    // bucketName :'ritik-intern'
        // username: this.state.username,
        // password: this.state.password 
      })
      .then(res => {
        //console.log("I am in web");
        history.push("/");
      })
      .catch(e => {
        showAlert("danger", e.message);
      });
  }
  // twoCalls=e =>{
    
    
  // }
  componentWillMount() {
    const { clearAlert } = this.props;
    // Clear out any stale message in the alert of previous page
    clearAlert();
    document.body.classList.add("is-guest");
    document.addEventListener('click', this.handlemousePress);
  }

  componentWillUnmount() {
    document.body.classList.remove("is-guest");
    document.removeEventListener('click', this.handlemousePress);
  }
  handlemousePress(event){
    //console.log("HEHEHEHEH");
  }
  render() {



    const { clearAlert, alert } = this.props;
    if (web.LoggedIn()) {
      return <Redirect to={"/"} />;
    }
    let alertBox = <Alert {...alert} onDismiss={clearAlert} />;
    // Make sure you don't show a fading out alert box on the initial web-page load.
    if (!alert.message) alertBox = "";
    return (
            
    
      








      <div className="login login-custom">
        <img src={logo} style={{ width: "12%", maxHeight: "60px", float:"right", paddingTop:"20px",paddingRight:"20px"}} />
        {/* <div style={{width:"100%",height:"10%"}} > 

<div style={{width:"50%" , float:"left"}}>
left

  
</div>
<div style={{width:"50%", float:"right"}}>
right

  
</div>

</div> */}
        
        
        <div className="l-wrap"> 
          
          
        {alertBox}
          <form onSubmit={this.login_auth.bind(this)} noValidate>
            <br />
            <br />
            <br />
            

            <InputGroup
              value={this.state.username}
              onChange={this.userNameChange.bind(this)}
              className="ig-dark"
              label="Username"
              id="userName"
              name="userName"
              type="text"
              spellCheck="false"
              required="required"
              autoComplete="endPoint"
            />

              <InputGroup
              value={this.state.password}
              onChange={this.passWordChange.bind(this)}
              className="ig-dark"
              label="Password"
              id="passWord"
              name="endpoint"
              type="password"
              spellCheck="false"
              required="required"
              autoComplete="endPoint"
            />
            
            {/* <button onClick={(e)=>{e.preventDefault(); this.login_auth() }}>SUBMIT
            </button> */}
           
            <button className="lw-btn" type="submit">
              <i className="fa fa-sign-in" />
            </button> 

          







            {/* <InputGroup
              value={this.state.endPoint}
              onChange={this.endPointChange.bind(this)}
              className="ig-dark"
              label="End Point"
              id="endPoint"
              name="endpoint"
              type="text"
              spellCheck="false"
              required="required"
              autoComplete="endPoint"
            />
            <InputGroup
              value={this.state.accessKey}
              onChange={this.accessKeyChange.bind(this)}
              className="ig-dark"
              label="Access Key"
              id="accessKey"
              name="username"
              type="text"
              spellCheck="false"
              required="required"
              autoComplete="username"
            />
            <InputGroup
              value={this.state.secretKey}
              onChange={this.secretKeyChange.bind(this)}
              className="ig-dark"
              label="Secret Key"
              id="secretKey"
              name="password"
              type="password"
              spellCheck="false"
              required="required"
              autoComplete="new-password"
            />

            <InputGroup
              value={this.state.bucketName}
              onChange={this.bucketNameChange.bind(this)}
              className="ig-dark"
              label="Bucket Name"
              id="bucketName"
              name="bucketName"
              type="text"
              spellCheck="false"
              required="required"
              autoComplete="bucketName"
            />

            <button className="lw-btn" type="submit">
              <i className="fa fa-sign-in" />
            </button>  */}
          </form>
        </div>
        {/* <a
          href=""
          onClick={this.configureGeneral.bind(this)}
          className="btn btn-simple-editor simple-editor-btn-position"
        >
          Simple Editor
        </a> */}

        {/* <div className="l-footer">
          <a className="lf-logo" href="">
            <img src={logo} alt="" />
          </a>
        </div> */}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    showAlert: (type, message) =>
      dispatch(actionsAlert.set({ type: type, message: message })),
    clearAlert: () => dispatch(actionsAlert.clear()),
    login: (accessKey, secretKey, endPoint, bucketName) =>{
      dispatch(login(accessKey, secretKey, endPoint, bucketName))
    }
  };

 
};
module.exports = connect(
  state => state,
  mapDispatchToProps
)(Login);
