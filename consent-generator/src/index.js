import React from 'react';
import { render } from "react-dom";
import { ConsentGenerator } from "./lib";

const App = () => (
    <div style={{ width: 640, margin: "15px auto" }}>
        <h1>CR Generator</h1>
        <ConsentGenerator formData={{"test": "lorem ipsum"}} APIroot={"http://localhost:5000/api/v1/"} />
    </div>
);

render(<App />, document.getElementById("root"));
