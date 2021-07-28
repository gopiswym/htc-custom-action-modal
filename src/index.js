import './style/index.css';
import React from 'react';
import App from './components/app';
import 'bootstrap/dist/css/bootstrap.min.css';
import "core-js/stable";
import "regenerator-runtime/runtime"; 

function swymCallbackFn() {
    console.log('on load react');
    React.render(<App />, document.getElementById("wishlist-items-react-container"));
}

if(!window.SwymCallbacks) {
  window.SwymCallbacks = [];
}

window.SwymCallbacks.push(swymCallbackFn);

//export default App;
