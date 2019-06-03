/**
 * Datafund Consent generator & viewer 
 * Licensed under the MIT license 
 * Created by Markus Zevnik, Tadej Fius, Èrt Ahlin 
 */

import React, { Component } from 'react';
import {
    Collapse,
    Navbar,
    NavItem,
    ListGroup,
    ListGroupItem,
    ListGroupItemHeading,
    ButtonGroup,
    Button,
    Nav,
    TabContent,
    TabPane,
    NavLink
} from 'reactstrap'

import {Link} from 'react-router-dom'
import logo from '../images/logo_black_alt.svg';
import Form from "react-jsonschema-form-bs4";
import JSONPretty from "react-json-pretty";
import {JsonTable} from 'react-json-to-html';
import _ from "lodash";
import jwt from "jsonwebtoken";
import uuidv4 from "uuid/v4";
import {JsonEditor} from 'jsoneditor-react';
import exportFromJSON from 'export-from-json'
import classnames from 'classnames';
import Loader from "react-loader-advanced";
import config from "../projectConfiguration";
import {ConsentViewer as ConsentViewer} from "consent-viewer";


const log = (type) => console.log.bind(console, type);
let reactJsonSchemaForm;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            schema: config.schema,
            uiSchema: config.uiSchema,
            formData: config.formData,
            defaultProperties: config.defaultProperties,
            cleanFormData: {},
            jwtToken: {},
            jwtTokenDecoded: {},
            schemaVisible: false,
            uiSchemaVisible: false,
            formDataVisible: false,
            jwtTokenEncodedVisible: false,
            jwtTokenDecodedVisible: false,
            projectConfigurationVisible: false,
            activeSchemaTab: '1',
            uiSchemaTab: '1',
            formDataTab: '1',
            algorithmTab: '1',
            loadingInProgress: false,
            mode: 'editor',
            secret: '',
            privateKey: '',
            signature: {}
        };

        this.onClean = this.onClean.bind(this);
        this.generateJwtHS256 = this.generateJwtHS256.bind(this);
        this.generateJwtRS256 = this.generateJwtRS256.bind(this);
        this.decodeJwt = this.decodeJwt.bind(this);
        this.verifyJwtHS256 = this.verifyJwtHS256.bind(this);
        this.verifyJwtRS256 = this.verifyJwtRS256.bind(this);

        this.onFormDataChange = this.onFormDataChange.bind(this);
        this.onSchemaChange = this.onSchemaChange.bind(this);
        this.onUiSchemaChange = this.onUiSchemaChange.bind(this);

        this.downloadProjectConfigFile = this.downloadProjectConfigFile.bind(this);
        this.onInputFileChange = this.onInputFileChange.bind(this);
        this.readDefaultProperties = this.readDefaultProperties.bind(this);
        this.onPrivateKeyChange = this.onPrivateKeyChange.bind(this);
    }

    componentDidMount() {
        this.generateUUID();
        this.readDefaultProperties();
    }

    generateUUID() {
        const _this = this;

        if (!_this.state.formData.consentReceiptID || _this.state.formData.consentReceiptID === '') {
            _this.state.formData.consentReceiptID = uuidv4();
            _this.forceUpdate();
        }
    }

    readDefaultProperties() {
        const _this = this;

        _this.setState({loadingInProgress: true});

        _.each(_this.state.defaultProperties, function (val, key) {

            if(_this.state.schema.properties[key]) {
                if (_this.state.schema.properties[key].default) {
                    delete _this.state.schema.properties[key].default;
                }
                _.assign(_this.state.schema.properties[key], {"default": val});
            }

            if (_this.state.formData[key]) {
                delete _this.state.formData[key];
            }
            _.assign(_this.state.formData, {[key]: val});
        });

        _this.setState({loadingInProgress: false});
        _this.forceUpdate();
    }

    onFormDataChange(val) {
        const _this = this;
        console.log("onFormDataChange", val);
        //
        _this.setState({
            formData: val.formData
        })
    }

    onPrivateKeyChange(val) {
        const _this = this;
        console.log("onChange", val);
        //
        _this.setState({
            privateKey: val
        });
    }

    onInputFileChange(e) {
        const _this = this;

        _this.setState({loadingInProgress: true});

        if (window.FileReader) {
            let file = e.target.files[0], reader = new FileReader();
            reader.onload = function (r) {
                console.log(r.target.result);
                console.log(r.target.result.substr(29));
                console.log(window.atob(r.target.result.substr(29)));

                let importedData = JSON.parse(window.atob(r.target.result.substr(29)));

                console.log(importedData);

                _this.state.schema = importedData[0].schema;
                _this.state.uiSchema = importedData[1].uiSchema;
                _this.state.formData = importedData[2].formData;
                _this.state.defaultProperties = importedData[3].defaultProperties;

                _this.forceUpdate();

                setTimeout(function () {
                    _this.readDefaultProperties();
                }, 1000);


                _this.setState({loadingInProgress: false});
            }
            reader.readAsDataURL(file);
            console.log(reader);
        } else {
            console.log('Soryy, your browser does\'nt support for preview');
        }
    }


    onClean(obj) {
        const _this = this;

        Object.keys(obj).forEach(function (key) {
            if (obj[key] && typeof obj[key] === 'object') _this.onClean(obj[key])
            else if (obj[key] == null) delete obj[key]
        });

        console.log(obj);
        _this.state.cleanFormData = obj;
        _this.forceUpdate();
    }

    generateJwtHS256() {
        const _this = this;

        _this.onClean(_this.state.formData);

        let jwtToken = jwt.sign(_this.state.cleanFormData, _this.state.secret);
        _this.setState({
            jwtToken: jwtToken,
            jwtTokenEncodedVisible: true,
        });
        console.log(jwtToken);
    }

    generateJwtRS256() {
        const _this = this;

        _this.onClean(_this.state.formData);

        console.log("PRIVATE KEY: ", _this.state.privateKey);
        console.log(_this.state.cleanFormData);

        let options = {
            issuer: 'issuer',
            subject: 'subject',
            audience: 'audience',
            expiresIn: "12h",
            algorithm: "RS256"
        };

        let jwtToken = jwt.sign(_this.state.cleanFormData, _this.state.privateKey, options);

        _this.setState({
            jwtToken: jwtToken,
            jwtTokenEncodedVisible: true,
        });

    }

    decodeJwt() {
        const _this = this;

        let decoded = jwt.decode(_this.state.jwtToken, {complete: true});

        _this.setState({
            jwtTokenDecodedVisible: true,
            jwtTokenDecoded: decoded
        });
    }

    verifyJwtHS256() {
        const _this = this;
        console.log("_this.state.formData.publicKey ", _this.state.formData.publicKey);

        let verifyOptions = {
            algorithm: "HS256"
        };


        try {
            let legit = jwt.verify(_this.state.jwtToken, _this.state.secret, verifyOptions);
            console.log("LEGIT", legit);
            _this.setState({
                signature: legit
            });
            alert("Signature VALID!");
        } catch (e) {
            alert("Invalid signature!");
        }
    }

    verifyJwtRS256() {
        const _this = this;

        console.log("_this.state.formData.publicKey ", _this.state.formData.publicKey);

        let verifyOptions = {
            issuer: 'issuer',
            subject: 'subject',
            audience: 'audience',
            expiresIn: "12h",
            algorithm: "RS256"
        };

        try {
            let legit = jwt.verify(_this.state.jwtToken, _this.state.formData.publicKey, verifyOptions);

            _this.setState({
                signature: legit
            });
            alert("Signature VALID!");
        } catch (e) {
            alert("Invalid signature!");
        }

    }

    onSchemaChange(val) {
        const _this = this;
        console.log(val);
        _this.setState({
            schema: val
        });
    }

    onUiSchemaChange(val) {
        const _this = this;
        console.log(val);
        _this.setState({
            uiSchema: val
        });
    }

    // onFormDataChange(val) {
    //     console.log(val);
    // }

    downloadProjectConfigFile() {
        const _this = this;

        let data = '[{"schema":' + JSON.stringify(_this.state.schema) + '},{"uiSchema":' + JSON.stringify(_this.state.uiSchema) + '},{"formData":' + JSON.stringify(_this.state.formData) + '},{"defaultProperties":' + JSON.stringify(_this.state.defaultProperties) + '}]';

        console.log("data", data);

        const fileName = 'CR_project_config';
        const exportType = 'json';
        exportFromJSON({data, fileName, exportType});
    }


    render() {
        const _this = this;
        const loadingText = <span><i className="mdi mdi-spin mdi-loading"></i> Loading ...</span>;

        return (
            <div>

                <Navbar color="faded" className="" light expand="lg">
                    <div className="container">

                        <Link className="navbar-brand" to="/"><img src={logo} alt={logo}
                                                                   className="img-fluid"/></Link>

                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav className="ml-auto" navbar>
                            </Nav>
                        </Collapse>
                    </div>
                </Navbar>

                <div className="container mainContent">

                    <div className="row">
                        <div className="col-md-6">
                            <div className="row">
                                <div className="col-md-12">

                                    <ListGroup>

                                        <ListGroupItem>
                                            <ListGroupItemHeading className="m-0" onClick={(e) => {
                                                _this.setState({schemaVisible: !_this.state.schemaVisible})
                                            }}><i
                                                className={_this.state.schemaVisible ? "fas text-muted fa-minus-square" : "fas text-muted fa-plus-square"}></i> JSON
                                                Schema</ListGroupItemHeading>
                                            <Collapse isOpen={_this.state.schemaVisible}>
                                                <div>


                                                    <Nav tabs className="mt-4">
                                                        <NavItem>
                                                            <NavLink
                                                                className={classnames({active: this.state.activeSchemaTab === '1'})}
                                                                onClick={() => {
                                                                    this.setState({activeSchemaTab: '1'});
                                                                }}>
                                                                JSON
                                                            </NavLink>
                                                        </NavItem>
                                                        <NavItem>
                                                            <NavLink
                                                                className={classnames({active: this.state.activeSchemaTab === '2'})}
                                                                onClick={() => {
                                                                    this.setState({activeSchemaTab: '2'});
                                                                }}>

                                                                JSON Editor
                                                            </NavLink>
                                                        </NavItem>
                                                    </Nav>
                                                    <TabContent activeTab={this.state.activeSchemaTab}>
                                                        <TabPane tabId="1">

                                                            <JSONPretty
                                                                className=""
                                                                json={_this.state.schema}
                                                                themeClassName="json-pretty"></JSONPretty>


                                                        </TabPane>
                                                        <TabPane tabId="2">

                                                            {!_.isEmpty(_this.state.schema, true) &&
                                                            <div>
                                                                <JsonEditor
                                                                    value={_this.state.schema}
                                                                    onChange={_this.onSchemaChange}
                                                                />

                                                                <a className="btn btn-primary">
                                                                    <i className="fa fa-check"> Confirm changes</i>
                                                                </a>


                                                            </div>
                                                            }

                                                        </TabPane>
                                                    </TabContent>


                                                </div>
                                            </Collapse>
                                        </ListGroupItem>

                                        <ListGroupItem>
                                            <ListGroupItemHeading className="m-0" onClick={(e) => {
                                                _this.setState({uiSchemaVisible: !_this.state.uiSchemaVisible})
                                            }}><i
                                                className={_this.state.uiSchemaVisible ? "fas text-muted fa-minus-square" : "fas text-muted fa-plus-square"}></i> UI
                                                Schema</ListGroupItemHeading>
                                            <Collapse isOpen={this.state.uiSchemaVisible}>
                                                <div>


                                                    <Nav tabs className="mt-4">
                                                        <NavItem>
                                                            <NavLink
                                                                className={classnames({active: this.state.uiSchemaTab === '1'})}
                                                                onClick={() => {
                                                                    this.setState({uiSchemaTab: '1'});
                                                                }}>
                                                                JSON
                                                            </NavLink>
                                                        </NavItem>
                                                        <NavItem>
                                                            <NavLink
                                                                className={classnames({active: this.state.uiSchemaTab === '2'})}
                                                                onClick={() => {
                                                                    this.setState({uiSchemaTab: '2'});
                                                                }}>

                                                                JSON Editor
                                                            </NavLink>
                                                        </NavItem>
                                                    </Nav>
                                                    <TabContent activeTab={this.state.uiSchemaTab}>
                                                        <TabPane tabId="1">

                                                            <JSONPretty
                                                                className=""
                                                                json={this.state.uiSchema}
                                                                themeClassName="json-pretty"></JSONPretty>


                                                        </TabPane>
                                                        <TabPane tabId="2">

                                                            {!_.isEmpty(_this.state.uiSchema, true) &&
                                                            <JsonEditor
                                                                value={_this.state.uiSchema}
                                                                onChange={_this.onUiSchemaChange}
                                                            />
                                                            }

                                                        </TabPane>
                                                    </TabContent>


                                                </div>
                                            </Collapse>
                                        </ListGroupItem>

                                        <ListGroupItem>
                                            <ListGroupItemHeading className="m-0" onClick={(e) => {
                                                _this.setState({formDataVisible: !_this.state.formDataVisible})
                                            }}><i
                                                className={_this.state.formDataVisible ? "fas text-muted fa-minus-square" : "fas text-muted fa-plus-square"}></i> Form
                                                Data</ListGroupItemHeading>
                                            <Collapse isOpen={this.state.formDataVisible}>
                                                <div>


                                                    <JSONPretty
                                                        className="p-2 mt-3"
                                                        json={this.state.formData}
                                                        themeClassName="json-pretty"></JSONPretty>


                                                    {!_.isEmpty(_this.state.formData, true) &&
                                                    <div>
                                                        <h5 className="mt-4">Encode</h5>
                                                        <Nav tabs>
                                                            <NavItem>
                                                                <NavLink
                                                                    className={classnames({active: this.state.algorithmTab === '1'})}
                                                                    onClick={() => {
                                                                        this.setState({algorithmTab: '1'});
                                                                    }}>
                                                                    HS256
                                                                </NavLink>
                                                            </NavItem>
                                                            <NavItem>
                                                                <NavLink
                                                                    className={classnames({active: this.state.algorithmTab === '2'})}
                                                                    onClick={() => {
                                                                        this.setState({algorithmTab: '2'});
                                                                    }}>
                                                                    RS256
                                                                </NavLink>
                                                            </NavItem>
                                                        </Nav>
                                                        <TabContent activeTab={this.state.algorithmTab}
                                                                    className="mt-3">
                                                            <TabPane tabId="1">

                                                                <div className="form-group"><label
                                                                    htmlFor="root_version">256 bit secret</label><input
                                                                    className="form-control" id="secret"
                                                                    label="version" required=""
                                                                    placeholder="insert secret"
                                                                    type="text" onChange={e => {
                                                                    _this.setState({secret: e.target.value});
                                                                }}/></div>


                                                                <a className="btn btn-success text-white mt-3 mb-3"
                                                                   onClick={(e) => {
                                                                       _this.generateJwtHS256()
                                                                   }}><i className="fas fa-certificate"></i> Encode JWT
                                                                    (HS256)</a>

                                                            </TabPane>
                                                            <TabPane tabId="2">

                                                                <div className="form-group"><label
                                                                    htmlFor="root_version">RSA Private Key</label>
                                                                    <textarea
                                                                        className="form-control d-block mb-3"
                                                                        placeholder="insert private key"
                                                                        rows={10}
                                                                        onChange={e => {
                                                                            _this.onPrivateKeyChange(e.target.value)
                                                                        }}
                                                                        defaultValue={_this.state.privateKey}></textarea>
                                                                </div>

                                                                <a className="btn btn-success text-white mt-3 mb-3"
                                                                   onClick={(e) => {
                                                                       _this.generateJwtRS256()
                                                                   }}><i className="fas fa-certificate"></i> Encode JWT
                                                                    (RS256)
                                                                </a>

                                                            </TabPane>
                                                        </TabContent>
                                                    </div>
                                                    }

                                                </div>
                                            </Collapse>
                                        </ListGroupItem>

                                        <ListGroupItem
                                            className={_.isEmpty(_this.state.jwtToken, true) ? "disabled" : ""}>
                                            <ListGroupItemHeading className="m-0" onClick={(e) => {
                                                _this.setState({jwtTokenEncodedVisible: !_this.state.jwtTokenEncodedVisible})
                                            }}><i
                                                className={_this.state.jwtTokenEncodedVisible ? "fas text-muted fa-minus-square" : "fas text-muted fa-plus-square"}></i> JWT
                                                Token (encoded)</ListGroupItemHeading>
                                            {!_.isEmpty(_this.state.jwtToken, true) &&
                                            <Collapse isOpen={this.state.jwtTokenEncodedVisible}>
                                                <div>

                                                    <pre
                                                        className="p-4 mt-3 text-break bg-light">{this.state.jwtToken}</pre>


                                                    <div>
                                                        <a className="btn btn-success text-white mt-3" onClick={(e) => {
                                                            _this.decodeJwt()
                                                        }}><i className="fas fa-certificate"></i> Decode JWT</a><br/>
                                                    </div>


                                                    <h5 className="mt-4">Verify signature</h5>

                                                    <Nav tabs>
                                                        <NavItem>
                                                            <NavLink
                                                                className={classnames({active: this.state.algorithmTab === '1'})}
                                                                onClick={() => {
                                                                    this.setState({algorithmTab: '1'});
                                                                }}>
                                                                HS256
                                                            </NavLink>
                                                        </NavItem>
                                                        <NavItem>
                                                            <NavLink
                                                                className={classnames({active: this.state.algorithmTab === '2'})}
                                                                onClick={() => {
                                                                    this.setState({algorithmTab: '2'});
                                                                }}>
                                                                RS256
                                                            </NavLink>
                                                        </NavItem>
                                                    </Nav>
                                                    <TabContent activeTab={this.state.algorithmTab} className="mt-3">
                                                        <TabPane tabId="1">

                                                            <div className="form-group"><label
                                                                htmlFor="root_version">256 bit secret</label><input
                                                                className="form-control" id="secret"
                                                                label="version" required="" placeholder="insert secret"
                                                                type="text" onChange={e => {
                                                                _this.setState({secret: e.target.value});
                                                            }}/></div>


                                                            <a className="btn btn-success text-white mt-3"
                                                               onClick={(e) => {
                                                                   _this.verifyJwtHS256()
                                                               }}><i className="fas fa-certificate"></i> Verify
                                                                Signature (HS256)</a>

                                                        </TabPane>
                                                        <TabPane tabId="2">

                                                            <div className="form-group"><label
                                                                htmlFor="root_version">RSA Public Key</label> <textarea
                                                                className="form-control d-block mb-3"
                                                                placeholder="insert private key"
                                                                rows={10}
                                                                onChange={e => {
                                                                    _this.state.formData.publicKey = e.target.value;
                                                                    _this.forceUpdate()
                                                                }}
                                                                defaultValue={_this.state.formData.publicKey}></textarea>
                                                            </div>

                                                            <a className="btn btn-success text-white mt-3"
                                                               onClick={(e) => {
                                                                   _this.verifyJwtRS256()
                                                               }}><i className="fas fa-certificate"></i> Verify
                                                                Signature (RS256)</a>

                                                        </TabPane>
                                                    </TabContent>

                                                    {!_.isEmpty(_this.state.signature, true) &&
                                                    <JSONPretty
                                                        className="p-2 mt-3"
                                                        json={this.state.signature}
                                                        themeClassName="json-pretty"></JSONPretty>
                                                    }

                                                </div>
                                            </Collapse>
                                            }
                                        </ListGroupItem>

                                        <ListGroupItem
                                            className={_.isEmpty(_this.state.jwtTokenDecoded, true) ? "disabled" : ""}>
                                            <ListGroupItemHeading className="m-0" onClick={(e) => {
                                                _this.setState({jwtTokenDecodedVisible: !_this.state.jwtTokenDecodedVisible})
                                            }}><i
                                                className={_this.state.jwtTokenDecodedVisible ? "fas text-muted fa-minus-square" : "fas text-muted fa-plus-square"}></i> JWT
                                                Token (decoded)</ListGroupItemHeading>
                                            {!_.isEmpty(_this.state.jwtTokenDecoded, true) &&
                                            <Collapse isOpen={this.state.jwtTokenDecodedVisible}>
                                                <div>
                                                    <JSONPretty
                                                        className="p-2 mt-3"
                                                        json={this.state.jwtTokenDecoded}
                                                        themeClassName="json-pretty"></JSONPretty>
                                                </div>
                                            </Collapse>
                                            }
                                        </ListGroupItem>

                                        <ListGroupItem>
                                            <ListGroupItemHeading className="m-0" onClick={(e) => {
                                                _this.setState({projectConfigurationVisible: !_this.state.projectConfigurationVisible})
                                            }}><i
                                                className={_this.state.projectConfigurationVisible ? "fas text-muted fa-minus-square" : "fas text-muted fa-plus-square"}></i> Project
                                                Configuration</ListGroupItemHeading>

                                            <Collapse isOpen={this.state.projectConfigurationVisible}>


                                                <div>

                                                    <JSONPretty
                                                        className="p-2 mt-3"
                                                        json={this.state.defaultProperties}
                                                        themeClassName="json-pretty"></JSONPretty>

                                                    <a className="btn btn-primary mt-3 mb-2"
                                                       onClick={_this.downloadProjectConfigFile}><i
                                                        className="fa fa-download"></i> Download Project Configuration
                                                        File</a>

                                                    <hr className="mb-4"/>

                                                    <div className="mb-3">
                                                        <label className="btn btn-primary d-inline" htmlFor={"file"}><i
                                                            className="fa fa-upload"></i> Upload Project Configuration
                                                            File <input id="file" className="mt-4" type="file"
                                                                        accept=".json,application/json"
                                                                        onChange={_this.onInputFileChange} style={{
                                                                width: '0px',
                                                                height: '0px',
                                                                overflow: 'hidden'
                                                            }}/></label>
                                                    </div>


                                                </div>
                                                {/*<a className="btn btn-primary mt-2"><i className="fa fa-upload"></i> Upload Project Configuration File</a>*/}
                                            </Collapse>
                                        </ListGroupItem>


                                    </ListGroup>


                                </div>

                            </div>
                        </div>

                        <div className="col-md-6">


                            <ButtonGroup className="mt-2 mb-3">
                                <Button className={classnames({active: this.state.mode === 'editor'})}
                                        onClick={e => this.setState({mode: 'editor'})}>CR Editor</Button>
                                <Button className={classnames({active: this.state.mode === 'viewer'})}
                                        onClick={e => this.setState({mode: 'viewer'})}>CR Viewer</Button>
                            </ButtonGroup>

                            {_this.state.mode === 'editor' &&
                            <div className="card card-body bg-light mb-5">

                                <Loader
                                    show={_this.state.loadingInProgress}
                                    contentBlur={1}
                                    backgroundStyle={{backgroundColor: 'rgba(255,255,255,0.6)'}}
                                    foregroundStyle={{color: '#000000'}}
                                    message={loadingText}
                                >

                                    <Form
                                        ref={(form) => {
                                            reactJsonSchemaForm = form;
                                        }}
                                        schema={this.state.schema}
                                        formData={this.state.formData}
                                        uiSchema={this.state.uiSchema}
                                        onChange={this.onFormDataChange}
                                        onSubmit={log("submitted")}
                                        onError={log("errors")}/>

                                </Loader>

                            </div>
                            }

                            {_this.state.mode === 'viewer' &&
                            <div className="card card-body bg-light mb-5">

                                <h4 className="mt-1">Consent receipt viewer</h4>

                                <ConsentViewer type="text" data={this.state.jwtTokenDecoded}/>

                                {/*<div className="jsonViewer">*/}
                                {/*    <JsonTable json={this.state.jwtTokenDecoded}/>*/}
                                {/*</div>*/}

                                <JSONPretty
                                    className="p-2 mt-3"
                                    json={this.state.jwtTokenDecoded}
                                    themeClassName="json-pretty"></JSONPretty>

                            </div>
                            }


                        </div>
                    </div>

                </div>

            </div>
        );
    }
}

export default App;
