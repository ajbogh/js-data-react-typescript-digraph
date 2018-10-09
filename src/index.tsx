import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Route } from 'react-router'
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './Home';
import User from './User';
import Workflow from './Workflow';

import registerServiceWorker from './registerServiceWorker';

import './index.css';

ReactDOM.render(
  <BrowserRouter>
    <App>
      <Route exact={true} path="/" component={Home} />
      <Route path="/users/:id" component={User} />
      <Route path="/workflow/:uuid" component={Workflow} />
    </App>
  </BrowserRouter>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
