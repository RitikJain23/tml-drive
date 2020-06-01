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
import axios from "axios";
import history from "../history";
import configs from "../../../config/config.json";
import storage from "local-storage-fallback";
import * as alertActions from "../alert/actions";
import * as objectsActions from "../objects/actions";
import * as bucketActions from "../buckets/actions";
import { getCurrentBucket } from "../buckets/selectors";
import { getCurrentPrefix } from "../objects/selectors";
import { minioBrowserPrefix } from "../constants";
import web from "../web";
import { obj } from "through2";
import Axios from "axios";

export const ADD = "uploads/ADD";
export const UPDATE_PROGRESS = "uploads/UPDATE_PROGRESS";
export const STOP = "uploads/STOP";
export const SHOW_ABORT_MODAL = "uploads/SHOW_ABORT_MODAL";

export const add = (slug, size, name) => ({
  type: ADD,
  slug,
  size,
  name
});

export const updateProgress = (slug, loaded) => ({
  type: UPDATE_PROGRESS,
  slug,
  loaded
});

export const stop = slug => ({
  type: STOP,
  slug
});

export const showAbortModal = () => ({
  type: SHOW_ABORT_MODAL,
  show: true
});

export const hideAbortModal = () => ({
  type: SHOW_ABORT_MODAL,
  show: false
});

let requests = {};

export const addUpload = (xhr, slug, size, name) => {
  return function(dispatch) {
    requests[slug] = xhr;
    dispatch(add(slug, size, name));
  };
};

export const abortUpload = slug => {
  return function(dispatch) {
    const xhr = requests[slug];
    if (xhr) {
      xhr.abort();
    }
    dispatch(stop(slug));
    dispatch(hideAbortModal());
  };
};

export const apiValidation=()=>{
  return function(dispatch) {
  if(storage.getItem("token")){
    //console.log(storage.getItem("Auth_Token"))
    var token=storage.getItem("Auth_Token")
    //var token="hjdgj"
    axios.post("https://eguruskin.api.tatamotors/api/districts/", {
    "state": {
    "code": "UP"
    }
    } ,{headers:{"Authorization" : `Bearer ${token}`}}).then(response => {
      console.log(response.status)
          if (response.status == 401 || response.status == 403) {
            console.log("Wyd man")
            return "ABCD"
          }
          else if (response.status == 200) {
            console.log("Good job man"+ response.data)
            if(response.data){
            console.log("good job")
            return "EFGH"
            }
          else{
            console.log("bad job")
            return "GO to hjdhsjdc"
          }
          }
      
    }).catch(error=>{
      console.log("Wyd man")
      dispatch(
        alertActions.set({
          type: "danger",
          message: "Please re-login"
        })
      );
      throw new Error("Hey");
    })
  }
  else{
    history.push("/login");
    throw new Error("nmsanfm")
  }
} 
}

export const createFolder=(enteredname) =>{
  return function(dispatch, getState) {
    const state = getState();
    const currentBucket = getCurrentBucket(state) || "Home";
    const currentPrefix = getCurrentPrefix(state);
    //console.log("Heyyyyyyyyyyyyy  "+currentBucket+"  --"+currentPrefix)
    //console.log()
    var user_name=enteredname
    
    user_name=user_name+'/'
    // console.log("HHHHHHHHHHHHHHHHHHH"+ user_name)
    var AWS = require('aws-sdk');
    //AWS.config.region = 'ap-south-1';
    AWS.config.accessKeyId=configs.accessKey;
    AWS.config.secretAccessKey= configs.secretKey;
    AWS.config.region = 'ap-south-1';
    AWS.config.bucketName=configs.bucketName;
    var s3Client = new AWS.S3();

    var params = { Bucket: configs.bucketName, Key: currentBucket+"/"+currentPrefix+user_name, Body:'body does not matter' };

  s3Client.putObject(params, function (err, data) {
    if (err) {
      console.log("Error creating the folder: ", err);
    } else {
      dispatch(
        alertActions.set({
          type: "success",
          message: "Folder " + enteredname + " Created Successfully."
        })
      );
      if(currentPrefix){
        var newStr = currentPrefix.substring(0, currentPrefix.length-1);
        var newStr1=newStr.split("/")
        var newStr2=newStr1[(newStr1.length)-1]
        // console.log("What "+ newStr2)
        // console.log("Successfully created a folder on S3 ");
        //dispatch(bucketActions.selectBucket(currentBucket+" / "+currentPrefix));
        document.getElementById(newStr2).click();
      }
      else{
        document.getElementById(storage.getItem("Username")).click();
      }
      }
  });
}
}

export const createFile= file =>{
  return function(dispatch, getState) {
    //dispatch(apiValidation())
    
    const state = getState();
    const currentBucket = getCurrentBucket(state) || "Home";
    const currentPrefix = getCurrentPrefix(state);
    //console.log("Heyyyyyyyyyyyyy  "+currentBucket+"  --"+currentPrefix)
    //console.log(file)
    
    // console.log("HHHHHHHHHHHHHHHHHHH"+ user_name)
    var AWS = require('aws-sdk');
    //AWS.config.region = 'ap-south-1';
    AWS.config.accessKeyId=configs.accessKey;
    AWS.config.secretAccessKey= configs.secretKey;
    AWS.config.region = 'ap-south-1';
    AWS.config.bucketName=configs.bucketName;
    var s3Client = new AWS.S3();

    var params = { Bucket: configs.bucketName, Key: currentBucket+"/"+currentPrefix+file.name,  Body:file };

    
    s3Client.putObject(params, function (err, data) {
      if (err) {
        //console.log("Error creating the file: ", err);
      } 
      // else {
      //   dispatch(
      //     alertActions.set({
      //       type: "success",
      //       message: "File "+file.name + " uploaded successfully."
      //     })
      //   );
      //   if(currentPrefix){
      //     var newStr = currentPrefix.substring(0, currentPrefix.length-1);
      //     var newStr1=newStr.split("/")
      //     var newStr2=newStr1[(newStr1.length)-1]
      //     // console.log("What "+ newStr2)
      //     // console.log("Successfully created a folder on S3 ");
      //     //dispatch(bucketActions.selectBucket(currentBucket+" / "+currentPrefix));
      //     document.getElementById(newStr2).click();
      //   }
      //   else{
      //     document.getElementById(storage.getItem("Username")).click();
      //   }
      //   }
    }).on('httpUploadProgress', function(evt) {
      //console.log("Uploading :: " + parseInt((evt.loaded * 100) / evt.total)+'%');
      dispatch(
        alertActions.set({
          type: "success",
          message: "Uploading :: " + parseInt((evt.loaded * 100) / evt.total)+'%'
        })
      );
      }).send(function(err, data) {
        
        dispatch(
          alertActions.set({
            type: "success",
            message: "File "+file.name + " uploaded successfully."
          })
        );
        if(currentPrefix){
          var newStr = currentPrefix.substring(0, currentPrefix.length-1);
          var newStr1=newStr.split("/")
          var newStr2=newStr1[(newStr1.length)-1]
          // console.log("What "+ newStr2)
          // console.log("Successfully created a folder on S3 ");
          //dispatch(bucketActions.selectBucket(currentBucket+" / "+currentPrefix));
          document.getElementById(newStr2).click();
        }
        else{
          document.getElementById(storage.getItem("Username")).click();
        };
      });
    //console.log(storage.getItem("Auth_Token"))
  
  
}
}

// TODO: Improve logic for upload files && select prefix throughout the tool
export const uploadFile = file => {
  return function(dispatch, getState) {
    // var file_name=(file.name)
    //   console.log(file_name)
    //   //const { showAlert} = this.props
    //   var message =""
    //   if(file_name.includes('_')){
    //     message="File contains '_' "
    //   }
    //   if (message) {
    //     dispatch(
    //       alertActions.set({
    //         type: "danger",
    //         message: "Filename contains '_'. This character is not allowed. Please rename the file "
    //       })
    //     );
    //     return
    //   }
    const state = getState();
    const currentBucket = getCurrentBucket(state) || "Home";
    const currentPrefix = getCurrentPrefix(state);
    const objectName = `${currentPrefix}${file.name}`;
    
    const slug = `${currentBucket}-${currentPrefix}-${file.name}`;

    web
      .PresignedPutObject({
        bucketName: currentBucket,
        objectName: objectName,
        expiry: 24 * 60 * 60
      })
      .then(res => {
        //console.log("Res "+res.url)
        let xhr = new XMLHttpRequest();
        xhr.open("PUT", res.url, true);
        dispatch(addUpload(xhr, slug, file.size, file.name));
        xhr.onload = function(event) {
          //console.log("xhr.status "+xhr.status)
          if (xhr.status == 401 || xhr.status == 403) {
            dispatch(hideAbortModal());
            dispatch(stop(slug));
            dispatch(
              alertActions.set({
                type: "danger",
                message: "Unauthorized request."
              })
            );
          }
          if (xhr.status == 500) {
            dispatch(hideAbortModal());
            dispatch(stop(slug));
            dispatch(
              alertActions.set({
                type: "danger",
                message: xhr.responseText
              })
            );
          }
          if (xhr.status == 200) {
            dispatch(hideAbortModal());
            dispatch(stop(slug));
            dispatch(
              alertActions.set({
                type: "success",
                message: "File '" + file.name + "' uploaded successfully."
              })
            );
            //dispatch(window.location.reload(true));
            //dispatch(bucketName("RCHAUDHARY"));
            //dispatch(history.push("/RCHAUDHARY"));
            if(currentPrefix){
              var newStr = currentPrefix.substring(0, currentPrefix.length-1);
              var newStr1=newStr.split("/")
              var newStr2=newStr1[(newStr1.length)-1]
              // console.log("What "+ newStr2)
              // console.log("Successfully created a file on S3 ");
              //dispatch(bucketActions.selectBucket(currentBucket+" / "+currentPrefix));
              document.getElementById(newStr2).click();
            }
            else{
              document.getElementById(storage.getItem("Username")).click();
            }
            const objectPath =
              currentBucket == "Home"
                ? objectName.split("_")[0]
                : `${currentBucket}/${objectName.split("_")[0]}`;
                //console.log("hfgshfgs "+currentPrefix)
            //dispatch(bucketActions.fetchBucketsPostUpload(objectPath));
          }
        };

        xhr.upload.addEventListener("error", event => {
          dispatch(stop(slug));
          dispatch(
            alertActions.set({
              type: "danger",
              message: "Error occurred uploading '" + file.name + "'."
            })
          );
        });

        xhr.upload.addEventListener("progress", event => {
          if (event.lengthComputable) {
            let loaded = event.loaded;
            let total = event.total;
            dispatch(updateProgress(slug, loaded));
          }
        });

        xhr.send(file);
      })
      .catch(e => {
        dispatch(
          alertActions.set({
            type: "danger",
            message: e.message
          })
        );
      });
  };
};
