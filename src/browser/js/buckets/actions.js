/*
 * Minio Cloud Storage (C) 2018 Minio, Inc.
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

//import {Login} from "../browser/Login";
import storage from "local-storage-fallback";
import web from "../web";
import history from "../history";
import * as alertActions from "../alert/actions";
import * as objectsActions from "../objects/actions";
import * as editorActions from "../editor/actions";
import * as commonActions from "../browser/actions";
import { pathSlice } from "../utils";
import { getCurrentBucket } from "./selectors";

export const SET_LIST = "buckets/SET_LIST";
export const ADD = "buckets/ADD";
export const REMOVE = "buckets/REMOVE";
export const SET_FILTER = "buckets/SET_FILTER";
export const SET_CURRENT_BUCKET = "buckets/SET_CURRENT_BUCKET";
export const SHOW_MAKE_BUCKET_MODAL = "buckets/SHOW_MAKE_BUCKET_MODAL";
export const SHOW_BUCKET_POLICY = "buckets/SHOW_BUCKET_POLICY";
export const SET_POLICIES = "buckets/SET_POLICIES";
export const SHOW_MANAGE_DEVICE_EDITOR = "bucket/SHOW_MANAGE_DEVICE_EDITOR";
export const SET_LOGOUT = "common/SET_LOGOUT";
export const SET_LIST_META = "buckets/SET_LIST_META";
export const SET_ENDPOINT_BUCKET_NAME = "buckets/SET_ENDPOINT_BUCKET_NAME";


//console.log("YYYYYYYYYYYYYYYYYYY  "+ storage.getItem("Username"))

export const fetchBuckets = () => {
  return function(dispatch) {
    return web.ListBuckets().then(res => {
      const buckets = res.buckets ? res.buckets.map(bucket => bucket.name) : [];
      dispatch(getEndpointAndBucket());
      dispatch(setList(buckets));
      dispatch(commonActions.fetchServerObjectList());
      dispatch(addBucketMetaData());
      const { bucket, prefix } = pathSlice(history.location.pathname);
      // console.log("HEHEHEHEH "+bucket+"--"+prefix.replace('/',''))
      // console.log("dhwjufhw "+prefix)
      // const old_prefix=prefix 
      //const trimmed_prefix=prefix.substr(0,prefix.length-1)
      // console.log("trimmedprefix: "+trimmed_prefix+" prefix:"+prefix)
      if (buckets.length > 0) {
        if (
          bucket == "configuration" &&
          prefix &&
          buckets.indexOf(prefix) > -1
        ) {
          // Device editor mode
          dispatch(selectBucket(prefix));
          dispatch(editorActions.fetchSchemaFiles(prefix));
        } else if (bucket && buckets.indexOf(bucket) > -1) {
          // Device browser mode
          dispatch(selectBucket(bucket, prefix));
        } else if (bucket == "configuration" && prefix == "") {
          // Simple editor mode
        } else {
          dispatch(selectBucket(storage.getItem("Username")));
        }
      } else if (bucket != "configuration") {
        //if(prefix)
        dispatch(selectBucket(storage.getItem("Username")));
        //else
        //dispatch(selectBucket(storage.getItem("Username")));
        history.replace("/");
      } else {
        return;
      }
    });
  };
};

export const addBucketMetaData = () => {
  return function(dispatch, getState) {
    if (getState().buckets.list.length > 0) {
      const buckets = getState().buckets.list;
      let bucketsMeta = [];

      for (let i = 0; i < buckets.length; i++) {
        let deviceName = "";
        let deviceGroup = "";
        let deviceSubgroup = "";
        let deviceMetaFiltered = {};

        if (
          getState().browser.serverConfig &&
          getState().browser.serverConfig.devicemeta &&
          getState().browser.serverConfig.devicemeta.devices
        ) {
          deviceMetaFiltered = getState().browser.serverConfig.devicemeta.devices.filter(
            p => p.serialno === buckets[i]
          )[0];
        }

        if (deviceMetaFiltered && deviceMetaFiltered.name) {
          deviceName = deviceMetaFiltered.name;
        }
        if (deviceMetaFiltered && deviceMetaFiltered.group) {
          deviceGroup = deviceMetaFiltered.group;
        }
        if (deviceMetaFiltered && deviceMetaFiltered.subgroup) {
          deviceSubgroup = deviceMetaFiltered.subgroup;
        }

        bucketsMeta[i] =
          buckets[i] + " " + deviceName + (deviceGroup.length ? " | " : "") + deviceGroup + (deviceSubgroup.length ? " | " : "") + deviceSubgroup;
      }

      dispatch(setListMeta(bucketsMeta));
    }
  };
};

export const fetchBucketsPostUpload = createdBucket => {
  
  return function(dispatch) {
    
    return web.ListBuckets().then(res => {
      
      const buckets = res.buckets ? res.buckets.map(bucket => bucket.name) : [];
      dispatch(setList(buckets));
      dispatch(addBucketMetaData());
      
      if (buckets.length > 0) {
        //console.log("tytytytyt")
        const createdBucketArray = createdBucket.split("/").slice(0, -1);
        console.log("createdBucket: "+createdBucket+"cretedBucketArray:"+ createdBucketArray)
        if (createdBucket && createdBucketArray.length) {
          // && buckets.indexOf(createdBucket) > -1
          dispatch(selectBucket(createdBucketArray.join("/")));
        } else {
          dispatch(selectBucket(storage.getItem("Username")));
        }
      } else {
        dispatch(selectBucket(""));
        history.replace("/");
      }
    });
  };
};

export const setList = buckets => {
  return {
    type: SET_LIST,
    buckets
  };
};

export const setListMeta = bucketsMeta => {
  return {
    type: SET_LIST_META,
    bucketsMeta
  };
};

export const setFilter = filter => {
  return {
    type: SET_FILTER,
    filter
  };
};

export const selectBucket = (bucket, prefix) => {
  return function(dispatch) {
    dispatch(alertActions.clear());
    dispatch(setCurrentBucket(bucket));
    dispatch(objectsActions.selectPrefix(prefix || ""));
  };
};

export const setCurrentBucket = bucket => {
  return {
    type: SET_CURRENT_BUCKET,
    bucket: bucket
  };
};

export const makeBucket = bucket => {
  return function(dispatch) {
    return web
      .MakeBucket({
        bucketName: bucket
      })
      .then(() => {
        dispatch(addBucket(bucket));
        dispatch(selectBucket(bucket));
      })
      .catch(err =>
        dispatch(
          alertActions.set({
            type: "danger",
            message:
              err.message == "Failed to fetch"
                ? "Bucket creation is only possible in this tool for servers running on Minio - for e.g. AWS, please manually create a bucket via the console"
                : err.message
          })
        )
      );
  };
};

export const deleteBucket = bucket => {
  return function(dispatch) {
    return web
      .DeleteBucket({
        bucketName: bucket
      })
      .then(() => {
        dispatch(
          alertActions.set({
            type: "info",
            message: "Bucket '" + bucket + "' has been deleted."
          })
        );
        dispatch(removeBucket(bucket));
        dispatch(fetchBuckets());
      })
      .catch(err => {
        dispatch(
          alertActions.set({
            type: "danger",
            message: err.message
          })
        );
      });
  };
};

export const addBucket = bucket => ({
  type: ADD,
  bucket
});

export const removeBucket = bucket => ({
  type: REMOVE,
  bucket
});

export const showMakeBucketModal = () => ({
  type: SHOW_MAKE_BUCKET_MODAL,
  show: true
});

export const hideMakeBucketModal = () => ({
  type: SHOW_MAKE_BUCKET_MODAL,
  show: false
});

export const fetchPolicies = bucket => {
  return function(dispatch) {
    return web
      .ListAllBucketPolicies({
        bucketName: bucket
      })
      .then(res => {
        let policies = res.policies;
        if (policies) dispatch(setPolicies(policies));
        else dispatch(setPolicies([]));
      })
      .catch(err => {
        dispatch(
          alertActions.set({
            type: "danger",
            message: err.message
          })
        );
      });
  };
};

export const setPolicies = policies => ({
  type: SET_POLICIES,
  policies
});

export const showBucketPolicy = () => ({
  type: SHOW_BUCKET_POLICY,
  show: true
});

export const hideBucketPolicy = () => ({
  type: SHOW_BUCKET_POLICY,
  show: false
});

export const userLogout = () => ({
  type: SET_LOGOUT
});

export const getEndpointAndBucket = () => {
  return function(dispatch) {
    return web
      .getEndpointAndBucketName()
      .then(res => {
        const {
          savedEndpoint: { bucketName, endPoint }
        } = res;
        dispatch(setEndpointAndBucket(bucketName, endPoint));
      })
      .catch(err => {
        console.log("Error to fetch saved bucket details", err.message);
      });
  };
};

export const setEndpointAndBucket = (bucketName, endPoint) => {
  return {
    type: SET_ENDPOINT_BUCKET_NAME,
    endPoint,
    bucketName
  };
};
