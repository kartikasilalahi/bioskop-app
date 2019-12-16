import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter} from 'react-router-dom';
import {createStore,applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import Reducer from './redux/reducer'
import thunk from 'redux-thunk'

const store=createStore(Reducer,{},applyMiddleware(thunk))

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
, document.getElementById('root'));

serviceWorker.unregister();
