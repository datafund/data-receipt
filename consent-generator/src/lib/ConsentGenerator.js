/**
 * Datafund Consent generator & viewer 
 * Licensed under the MIT license 
 * Created by Markus Zevnik, Tadej Fius, Èrt Ahlin 
 */

import React, { Component } from "react";
import JSONPretty from "react-json-pretty";
import _ from "lodash";
import jwt from "jsonwebtoken";
import axios from 'axios';
import fileDownload from 'js-file-download';
import "./ConsentGenerator.css";

export default class ConsentGenerator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: this.props.formData ? this.props.formData : {},
            APIroot: this.props.APIroot ? this.props.APIroot : 'http://localhost:5000/api/v1/',
            verifyOptions: this.props.verifyOptions ? this.props.verifyOptions : {},
            cleanFormData: {},
            algorithmTab: '1',
            privateKey: ''
        }

        this.generateJwtRS256 = this.generateJwtRS256.bind(this);
        this.decodeJwt = this.decodeJwt.bind(this);
        this.verifyJwtRS256 = this.verifyJwtRS256.bind(this);
        this.onClean = this.onClean.bind(this);
        this.getPublicKey = this.getPublicKey.bind(this);
        this.downloadJwtCrFile = this.downloadJwtCrFile.bind(this);

        console.log(this.props);
        console.log(props);
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

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            formData: nextProps.formData
        })
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

        axios.post(_this.state.APIroot + 'token', _this.state.cleanFormData, {headers: {}})
            .then(function (response) {
                // TODO: check response type
                console.log("RESPONSE", response);

                _this.setState({
                    jwtToken: response.data.token
                });
            })
            .catch(function (error) {
                alert("Network error!");
                throw error
            })

    }

    decodeJwt() {
        const _this = this;

        let decoded = jwt.decode(_this.state.jwtToken, {complete: true});

        _this.setState({
            jwtTokenDecodedVisible: true,
            jwtTokenDecoded: decoded
        });
    }

    verifyJwtRS256() {
        const _this = this;

        console.log("_this.state.formData.publicKey ", _this.state.formData.publicKey);

        try {
            let legit = jwt.verify(_this.state.jwtToken, _this.state.formData.publicKey, _this.state.verifyOptions);

            _this.setState({
                signature: legit
            });
            alert("Signature VALID!");
        } catch (e) {
            alert("Invalid signature!");
        }

    }


    getPublicKey() {
        const _this = this;

        axios.get(_this.state.APIroot + 'publicKey', {headers: {}})
            .then(function (response) {

                console.log("RESPONSE", response);

                _this.setState({ formData: { ..._this.state.formData, publicKey: response.data.key} });
            })
            .catch(function (error) {
                alert("Network error!");
                throw error
            })
    }

    downloadJwtCrFile() {
        const _this = this;

        fileDownload(_this.state.jwtToken, 'file.JWT.CR');
    }


    render() {
        const _this = this;

        return (
            <div>
                {!_.isEmpty(this.state.formData) &&

                <div>
                    <h5 className="mt-4">Form Data</h5>

                    <JSONPretty
                        className="p-2 mt-3"
                        json={this.state.formData}
                        themeClassName="json-pretty"></JSONPretty>


                    {!_.isEmpty(_this.state.formData, true) &&
                    <div>
                        <h5 className="mt-4">Encode</h5>

                        <a className="btn btn-success text-white mt-3 mb-3"
                           onClick={(e) => {
                               _this.generateJwtRS256()
                           }}><i className="fas fa-certificate"></i> Encode JWT
                            (RS256)
                        </a>


                        <div>

                            {!_.isEmpty(_this.state.jwtToken) &&
                                <div>
                                    <pre className="p-4 mt-3 text-break bg-light">{_this.state.jwtToken}</pre>

                                    <div>
                                        <a className="btn btn-success text-white mt-3" onClick={(e) => {
                                            _this.decodeJwt()
                                        }}><i className="fas fa-certificate"></i> Decode JWT</a><br/>

                                    </div>
                                </div>
                            }



                            <hr/>

                            {!_.isEmpty(_this.state.jwtTokenDecoded) &&
                            <div>
                                <h5 className="mt-4">Decode</h5>

                                <div>

                                    <JSONPretty
                                        className="p-2 mt-3"
                                        json={this.state.jwtTokenDecoded}
                                        themeClassName="json-pretty"></JSONPretty>


                                    <a className="btn btn-secondary mt-2 text-white" onClick={this.downloadJwtCrFile}> Download JWT.CR</a>
                                </div>


                            <hr/>

                            <h5 className="mt-4">Verify signature</h5>


                            <div className="form-group"><label
                                htmlFor="root_version">RSA Public Key <a className="btn btn-sm btn-secondary ml-4 text-white" onClick={this.getPublicKey}> Get Public Key</a></label> <textarea
                                className="form-control d-block mb-3"
                                placeholder="insert public key"
                                rows={10}
                                onChange={e => {
                                    _this.state.formData.publicKey = e.target.value;
                                    _this.forceUpdate()
                                }}
                                defaultValue={_this.state.formData.publicKey} value={_this.state.formData.publicKey}></textarea>
                            </div>

                            <a className="btn btn-success text-white mt-3"
                               onClick={(e) => {
                                   _this.verifyJwtRS256()
                               }}><i className="fas fa-certificate"></i> Verify
                                Signature (RS256)</a>


                            {!_.isEmpty(_this.state.signature, true) &&
                            <JSONPretty
                                className="p-2 mt-3"
                                json={this.state.signature}
                                themeClassName="json-pretty"></JSONPretty>
                            }

                            </div>
                            }

                        </div>


                    </div>
                    }
                </div>

                }

                {_.isEmpty(this.state.formData) &&
                <em>Form data not available.</em>
                }
            </div>)

    }

}
