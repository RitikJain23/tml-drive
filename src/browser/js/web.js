/*
 * MinIO Cloud Storage (C) 2016, 2018 MinIO, Inc.
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

import React from "react";
import { Login } from "./browser/Login"
import axios from "axios";
import JSONrpc from "./jsonrpc";
import Moment from "moment";
import storage from "local-storage-fallback";
import { resolve } from "url";
import { Static } from "react-bootstrap/lib/FormControl";

class respo extends React.Component {
  static displayName = 'resp';
  static tobe=0;

  state = 0;

  
}



class Web {
  
  constructor(props) {
    //super(props);
    // this.state={
    //   flag:"false"
    // }
    
    //this.clickMe = this.clickMe.bind(this)
    this.JSONrpc = new JSONrpc();
    
  }
  //this.a=0;
  // componentDidMount(){
  //   //this.clickMe = this.clickMe.bind(this);
  //   this.setState({flag: 'true'}, () => console.log("tTTTTTT "+this.state.flag))
  // }
  //componentDidUpdate(){}
  // clickMe () {
  //   console.log("wasssup")
  //   this.setState({
  //   flag:"true"   //
  //   })
  // }
  makeCall(method, options) {
    return this.JSONrpc.call(
      method,
      {
        params: options
      },
      storage.getItem("token")
    )
      .catch(err => {
        if (err.status === 401) {
          //console.log("HHHHHeeeey")
          storage.removeItem("token");
          location.reload();
          throw new Error("Please re-login.");
        }
        if (err.status)
        //console.log("HHHHHeeeey")
          throw new Error(`Server returned error [${err.status}]`);
        throw new Error(err.message);
      })
      .then(res => {
        let json = res;
        let result = json.result;
        let error = json.error;
        if (error) {
          throw new Error(error.message);
        }
        if (!Moment(result.uiVersion).isValid()) {
          throw new Error("Invalid UI version in the JSON-RPC response");
        }
        if (
          result.uiVersion !== currentUiVersion &&
          currentUiVersion !== "MINIO_UI_VERSION"
        ) {
          storage.setItem("newlyUpdated", true);
          location.reload();
        }
        return result;
      });
  }
  
  




  apiValidation(){
  //return !!storage.getItem("token");
  //var flg=false 
    // if(storage.getItem("token")){
    //   //a=1
    var token=storage.getItem("Auth_Token");
    //var token="hjdgj"
    
      
      const options = {
        url: 'https://eguruskin.api.tatamotors/api/districts/',
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization':`Bearer ${token}`
        },
        data: {
          
            "state": {
            "code": "UP"
            
            
        }
      }};
      

      axios(options)


        .then(response => {
           //console.log("gwhcgwdjwgdewqi"+respo.state);
           respo.state=response.status
           return respo.state
          
        }
        

       
        
        );

        //console.log('respodespo ' + respo.state)

        //console.log(response)

        return respo.state

      //  axios.post("", ,{headers:{"Authorization" : }}).then(response => {
      //    console.log(response.status)
        // this.state.flag="true"
        // this.setState({
        //   flag: "true"
        // });
          //this.clickMe()
          //console.log("flag:"+this.state.flag)
          // console.log("flag")
          // flg=true
          // console.log("flgi:"+flg)
          // return response.data
          //return flg
          
          
      
    // }).catch(error=>{
    //   console.log("Flag :")
    //   return false
      // dispatch(
      //   alertActions.set({
      //     type: "danger",
      //     message: "Please re-login"
      //   })
      // );

      //throw new Error("Hey");
    }
    // console.log("flgf:"+flg)
    // flg=true
    // return flg
    //})
    //}
    // else{
    //   //this.state.flag="false"
    //   //console.log("Flag:"+this.state.flag)
    //   console.log("flag:"+a)
    //   console.log("Wyd man")
      
    //   //console.log("Flag :"+this.state.flag)
    //   return false;
    // }
    //return false
  //}
  LoggedIn(){
    return !!storage.getItem("token");
    //return true
    var resp=0
    
    resp=this.apiValidation()
    console.log('hi')
    console.log(resp)
    if(resp ==200)
    return true
    else
    return false
    // let value=this.makeCall("TokenInfo");
    // console.log("Value: "+JSON.stringify(value))
    // return this.makeCall("TokenInfo");
    //return this.makeCall("Login", "j").then(res => {
      //storage.setItem("token", `${res.token}`);
      //return res;
    
  }
  // LoggedIn(){
  //   let res=(async () => {
  //     return this.LoggIn();
  // })();
  // console.log("Res2 "+res)
  // return res
  // }
  // async LoggedIn1() {
  //   //return !!storage.getItem("token");
  //   //console.log("Login: "+Login)
  //   let resp=await this.apiValidation()
  //   console.log("Res1 "+resp)
  //   return resp
     // storage.setItem("token", `${res.token}`);
     

   // return this.apiValidation();
    //console.log(!!storage.getItem("token"))
    
  //   if(storage.getItem("token")){
  //   //console.log(storage.getItem("Auth_Token"))
  //   var token=storage.getItem("Auth_Token")
  //   //var token="hjdgj"
  //   axios.post("https://eguruskin.api.tatamotors/api/districts/", {
  //   "state": {
  //   "code": "UP"
  //   }
  //   } ,{headers:{"Authorization" : `Bearer ${token}`}}).then(response => {
  //     //console.log(response.status)
  //         if (response.status == 401 || response.status == 403) {
  //           //console.log("Wyd man")
  //           return false
  //         }
  //         else if (response.status == 200) {
  //           //console.log("Good job man"+ response.data)
  //           if(response.data){
  //           console.log("good job")
  //           return !!storage.getItem("token");
  //           }
  //         else{
  //           //console.log("bad job")
  //           return false
  //         }
  //         }
      
  //   }).catch(error=>{
  //     console.log("Wyd man")
  //     return false
  //     // dispatch(
  //     //   alertActions.set({
  //     //     type: "danger",
  //     //     message: "Please re-login"
  //     //   })
  //     // );

  //     //throw new Error("Hey");
  //   })
  // }
  // else{
  //   //history.push("/login");
  //   throw new Error("nmsanfm")
  // }
 

  //}

  Login(args) {
    return this.makeCall("Login", args).then(res => {
      storage.setItem("token", `${res.token}`);
      return res;
    });
  }

  Logout() {
    axios.post("https://eguruskin.api.tatamotors/api/logout/", {
    
    } ,{headers:{"Authorization" : `Bearer ${storage.getItem("Auth_Token")}`}}).then(response => {
      //console.log(response.status+"gdhwgdwh")
      
    }).catch(error=>{
      //console.log("Wyd man")
      //throw new Error("Hey");
    })
    respo.state=0;
    storage.removeItem("token");
    storage.removeItem("region");
    storage.removeItem("Username");
    storage.removeItem("Auth_Token");
    // storage.removeItem("AccessKeyId");
    // storage.removeItem("SecretAccessKey");
    // storage.removeItem("BucketName");
  }

  ServerInfo() {
    return this.makeCall("ServerInfo");
  }

  StorageInfo() {
    return this.makeCall("StorageInfo");
  }

  ListBuckets() {
    return this.makeCall("ListBuckets");
  }

  MakeBucket(args) {
    return this.makeCall("MakeBucket", args);
  }

  DeleteBucket(args) {
    return this.makeCall("DeleteBucket", args);
  }

  ListObjects(args) {
    return this.makeCall("ListObjects", args);
  }

  ListObjectsRecursive(args) {
    return this.makeCall("ListObjectsRecursive", args);
  }

  PresignedGet(args) {
    return this.makeCall("PresignedGet", args);
  }

  PresignedGetObj(args) {
    return this.makeCall("PresignedGetObj", args);
  }

  PresignedPutObject(args) {
    return this.makeCall("PresignedPutObject", args);
  }

  PutObjectURL(args) {
    return this.makeCall("PutObjectURL", args);
  }

  PutObject(args) {
    return this.makeCall("PutObject", args);
  }

  FputObject(args) {
    return this.makeCall("FputObject", args);
  }

  RemoveObject(args) {
    return this.makeCall("RemoveObject", args);
  }

  GetAuth() {
    return this.makeCall("GetAuth");
  }

  GenerateAuth() {
    return this.makeCall("GenerateAuth");
  }

  SetAuth(args) {
    return this.makeCall("SetAuth", args).then(res => {
      storage.setItem("token", `${res.token}`);
      return res;
    });
  }

  CreateURLToken() {
    return this.makeCall("CreateURLToken");
  }

  GetBucketPolicy(args) {
    return this.makeCall("GetBucketPolicy", args);
  }

  SetBucketPolicy(args) {
    return this.makeCall("SetBucketPolicy", args);
  }

  ListAllBucketPolicies(args) {
    return this.makeCall("ListAllBucketPolicies", args);
  }

  getObjectStat(args) {
    return this.makeCall("GetObjectStat", args);
  }

  getEndpointAndBucketName(args) {
    return this.makeCall("GetEndpointAndBucketName", args);
  }

  getWidgetQueryResult(args) {
    return this.makeCall("GetWidgetQueryResult", args);
  }

  GetPartialObject(args) {
    return this.makeCall("GetPartialObject", args);
  }
}
const web = new Web();

export default web;
