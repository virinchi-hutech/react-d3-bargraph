import React from 'react';
import { Switch, Route, Router } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import BarChart from './shared/bargraph/Bargraph';
import BarchartGrouped from './shared/BarchartGrouped/BarchartGrouped';
import {history} from './history'
const data2 = require('./sampledata2.json')
const data1 = require('./sampledata.json')
function App() {
  return (
    <div className="App">
      <Router history={history}>
        <Switch>
          <Route path="/group">
            <BarchartGrouped
              data={data2}
                history={history}
            ></BarchartGrouped>
          </Route>
          <Route path="/">
            <BarChart
              history={history}
              data={data1}>
            </BarChart>
          </Route>
        </Switch>
      </Router>

    </div>
  );
}

export default App;
