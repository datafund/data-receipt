/**
 * Datafund Consent generator & viewer 
 * Licensed under the MIT license 
 * Created by Markus Zevnik, Tadej Fius, Èrt Ahlin 
 */

import React, { Component } from "react";
import {JsonTable} from 'react-json-to-html';
import _ from "lodash";
import "./ConsentViewer.css";

export default class ConsentViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data ? this.props.data : {}
        }

        console.log(this.props);
        console.log(props);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            data: nextProps.data
        })
    }


    render() {

        return (
            <div className="consentViewerContainer">
                {!_.isEmpty(this.state.data) &&
                <JsonTable json={this.state.data}/>
                }

                {_.isEmpty(this.state.data) &&
                    <em>Cosent Recepeit data not available.</em>
                }
            </div>
        )

    }

}
