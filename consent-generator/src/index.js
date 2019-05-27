import React from 'react';
import { render } from "react-dom";
import { ConsentGenerator } from "./lib";

const App = () => (
    <div style={{ width: 640, margin: "15px auto" }}>
        <h1>CR Generator</h1>
        <ConsentGenerator formData={{"test": "lorem ipsum"}} />
    </div>
);

render(<App />, document.getElementById("root"));
