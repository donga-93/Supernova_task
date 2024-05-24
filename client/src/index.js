import React from "react";
import ReactDOM from "react-dom/client";
import ApolloProvider from './ApolloProvider';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';



const root = ReactDOM.createRoot(document.getElementById("root"));
// if you are rendering App as a normal component use this line:
// root.render(<React.StrictMode><App/></React.StrictMode>);
// the below line is specific to how the question is made:
root.render(<React.StrictMode>{ApolloProvider}</React.StrictMode>)