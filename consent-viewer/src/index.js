/**
 * Datafund Consent generator & viewer 
 * Licensed under the MIT license 
 * Created by Markus Zevnik, Tadej Fius, Èrt Ahlin 
 */

import React from 'react';
import { render } from "react-dom";
import { ConsentViewer } from "./lib";

const App = () => (
    <div style={{ width: 640, margin: "15px auto" }}>
        <h1>CR Viewer</h1>
        <ConsentViewer data={{"test": "lorem ipsum"}} />
    </div>
);

render(<App />, document.getElementById("root"));
