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
import * as alertActions from "../alert/actions";
import * as actionsAlert from "../alert/actions";
import { getCurrentBucket } from "../buckets/selectors";
import { getCurrentPrefix } from "../objects/selectors";
import * as Path from "../objects/Path";
import React from "react";
import { connect } from "react-redux";
import { Dropdown, OverlayTrigger, Tooltip } from "react-bootstrap";
import web from "../web";
import * as actionsBuckets from "../buckets/actions";
import * as uploadsActions from "../uploads/actions";
import { getPrefixWritable } from "../objects/selectors";
import { pathJoin } from "../utils";

export const MainActions = ({
  showAlert,
  prefixWritable,
  uploadFile,
  createFile,
  createFolder,
  showMakeBucketModal
}) => {
  const uploadTooltip = <Tooltip id="tt-upload-file">Upload file</Tooltip>;
  const createTooltip = <Tooltip id="tt-create-folder">Create Folder</Tooltip>;
  const makeBucketTooltip = (
    <Tooltip id="tt-create-bucket">Create bucket</Tooltip>
  );
  const onFileUpload = e => {
    e.preventDefault();
    
    //console.log("hello")
    let files = e.target.files;
    let filesToUploadCount = files.length;
    for (let i = 0; i < filesToUploadCount; i++) {
      //var file_name=(files.item(i)).name
      // console.log(file_name)
      // //const { showAlert} = this.props
      // var message =""
      // if(file_name.includes('_')){
      //   message="File contains '_' "
      // }
      // if (message) {
      //   dispatch(
      //     alertActions.set({
      //       type: "success",
      //       message: "File '" + file.name + "' uploaded successfully."
      //     })
      //   );
      // }
      uploadFile(files.item(i));
    }
    e.target.value = null;
  };

  const onFolderCreate= e => {
    e.preventDefault();
    const enteredName = prompt('Enter the name of the folder')
    if(enteredName){
      var specialchar=["*","<",">","/",":","?","|","'","\""]
      for(var i=0;i<specialchar.length;i++){
        if(enteredName.includes(specialchar[i])){
          showAlert("danger", "Invalid Folder name");
          return;
        }
      }
      createFolder(enteredName);
    }
    
    
}

  const loggedIn = web.LoggedIn();

  if (loggedIn || prefixWritable) {
    return (
      <Dropdown dropup className="feb-actions" id="fe-action-toggle">
        <Dropdown.Toggle noCaret className="feba-toggle">
          <span>
            <i className="fa fa-plus" />
          </span>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <OverlayTrigger placement="left" overlay={uploadTooltip}>
            <a href="#" className="feba-btn feba-upload">
              <input
                type="file"
                onChange={onFileUpload}
                style={{ display: "none" }}
                id="file-input"
                multiple={true}
              />
              <label htmlFor="file-input">
                {" "}
                <i className="fa fa-cloud-upload" />{" "}
              </label>
            </a>
          </OverlayTrigger>
          <OverlayTrigger placement="left" overlay={createTooltip}>
            <a href="#" className="feba-btn feba-upload">
              <input
                type="button"
                onClick={onFolderCreate}
                style={{ display: "none" }}
                id="folder-input"
                multiple={true}
              />
              <label htmlFor="folder-input">
                {" "}
                <i className="fa fa-folder" />{" "}
              </label>
            </a>
          </OverlayTrigger>
        </Dropdown.Menu>
      </Dropdown>
    );
  } else {
    return <noscript />;
  }
};

const mapStateToProps = state => {
  return {
    prefixWritable: getPrefixWritable(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    showAlert: (type, message) =>
      dispatch(actionsAlert.set({ type: type, message: message })),
    createFolder:enteredName=>dispatch(uploadsActions.createFolder(enteredName)),
    createFile:file=>dispatch(uploadsActions.createFile(file)),
    uploadFile: file => dispatch(uploadsActions.uploadFile(file)),
    showMakeBucketModal: () => dispatch(actionsBuckets.showMakeBucketModal())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainActions);
