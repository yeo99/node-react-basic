import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// App을 Provider를 이용하여 Redux에 연결해줘야함
import { Provider } from 'react-redux';
import 'antd/dist/antd.css';
import { applyMiddleware, createStore } from 'redux';
import promiseMiddleWare from 'redux-promise';
import ReduxThunk from 'redux-thunk';
import Reducer from './_reducer';

// 그냥 store는 객체밖에 못받기 때문에, promise와 function도 받을 수 있도록 함
const createStoreWithMiddleWare = applyMiddleware(promiseMiddleWare, ReduxThunk)(createStore)
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider
    store={createStoreWithMiddleWare(Reducer,
        // Redux Dev Tools Extension 사용 가능하도록
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
      )}
  >
    <App />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();