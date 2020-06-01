/*
 * Minio Cloud Storage (C) 2016, 2017, 2018 Minio, Inc.
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
import Alert from "../alert/Alert";
import storage from "local-storage-fallback";
import axios from "axios";
import * as actionsAlert from "../alert/actions";
import React from "react";
import { connect } from "react-redux";
import { Dropdown } from "react-bootstrap";
import * as browserActions from "./actions";
import * as actionsBuckets from "../buckets/actions";
import * as actionsEditor from "../editor/actions";
import * as actionsEditorTools from "../editorTools/actions"
import web from "../web";
import history from "../history";

export class BrowserDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.logout = this.logout.bind(this);
    this.handlemousePress = this.handlemousePress.bind(this);
  }

  componentDidMount() {
    const { fetchServerInfo } = this.props;
    fetchServerInfo();
    document.addEventListener('click', this.handlemousePress);
  }
  // componentWillMount() {
  //   const { clearAlert } = this.props;
  //   // Clear out any stale message in the alert of previous page
  //   clearAlert();
  //   document.body.classList.add("is-guest");
  //   document.addEventListener('click', this.handlemousePress);
  // }

  componentWillUnmount() {
    //document.body.classList.remove("is-guest");
    document.removeEventListener('click', this.handlemousePress);
  }
  handlemousePress(event){
    //event.preventDefault()
    //var a=1
    let loggedIn = web.LoggedIn();
    //console.log("HEHEHEHEH1 "+loggedIn);
    // if(a==1){
    //   event.preventDefault()
    // }
    const { showAlert} = this.props;
    var message ="Please login again"
    if (message) {
      //showAlert("danger", message);
      // web.Logout();
      // history.replace("/login");
      //return;
    }

    var token=storage.getItem("Auth_Token")
    //var token="hjdgj"
    axios.post("https://eguruskin.api.tatamotors/api/districts/", {
    "state": {
    "code": "UP"
    }
    } ,{headers:{"Authorization" : `Bearer ${token}`}}).then(response => {
      //console.log(response.status)
      
    }).catch(error=>{
      //console.log("Wyd man")
      showAlert("danger", message);
      web.Logout();
      history.replace("/login");
      //throw new Error("Hey");
    })
    //return false
  }

  fullScreen(e) {
    e.preventDefault();
    let el = document.documentElement;
    if (el.requestFullscreen) {
      el.requestFullscreen();
    }
    if (el.mozRequestFullScreen) {
      el.mozRequestFullScreen();
    }
    if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    }
    if (el.msRequestFullscreen) {
      el.msRequestFullscreen();
    }
  }

  logout(e) {
    e.preventDefault();
    this.props.userLogout();
    web.Logout();
    history.replace("/login");
  }

  configureGeneral(e) {
    e.preventDefault();
    this.props.selectBucket("Home");
    this.props.resetFiles();
    history.push("/configuration/");

    this.props.publicUiSchemaFiles();
    if(!this.props.editorSchemaSidebarOpen){
      this.props.toggleEditorSchemaSideBar()
    }

  }
  home(e){
      e.preventDefault();
      document.getElementById(storage.getItem("Username")).click();
  }
  dashboard(e) {
    e.preventDefault();
    history.push("/status-dashboard/");
  }

  render() {
    const { serverInfo } = this.props;
    return (
      <li>
        <Dropdown pullRight id="top-right-menu">
          <Dropdown.Toggle noCaret>
            <i className="fa fa-reorder" />
          </Dropdown.Toggle>
          <Dropdown.Menu className="dropdown-menu-right">
            <li>
              <a href="" onClick={this.fullScreen}>
                Fullscreen <i className="fa fa-expand" />
              </a>
            </li>
            <li>
              <a href="" onClick={this.home.bind(this)}>
                Home <i className="pie-icon"/>
              </a>
            </li>
            {/* <li>
              <a href="" onClick={this.configureGeneral.bind(this)}>
                Simple editor <i className="fa fa-cog" />
              </a>
            </li> */}
          
            <li>
              <a href="" id="logout" onClick={this.logout}>
                Sign out <i className="fa fa-sign-out" />
              </a>
            </li>
          </Dropdown.Menu>
        </Dropdown>
      </li>
    );
  }
}

const mapStateToProps = state => {
  return {
    serverInfo: state.browser.serverInfo,
    editorSchemaSidebarOpen: state.editorTools.editorSchemaSidebarOpen
  };
};

const mapDispatchToProps = dispatch => {
  return {
    showAlert: (type, message) =>
      dispatch(actionsAlert.set({ type: type, message: message })),
    fetchServerInfo: () => dispatch(browserActions.fetchServerInfo()),
    selectBucket: (bucket, prefix) =>
      dispatch(actionsBuckets.selectBucket(bucket)),
    resetFiles: () => dispatch(actionsEditor.resetFiles()),
    publicUiSchemaFiles: () => dispatch(actionsEditor.publicUiSchemaFiles()),
    toggleEditorSchemaSideBar: () => dispatch(actionsEditorTools.toggleEditorSchemaSideBar()),
    userLogout: () => dispatch(actionsBuckets.userLogout())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowserDropdown);
