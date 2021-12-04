import React from 'react'
import { BrowserRouter  as Router, Switch, Route, Redirect } from 'react-router-dom';
import Bills from './pages/bills/Bills';

export default function App() {

  return (
    <>
    <Router>
      <Switch>
        <Route path='/' exact component={Bills} />
      </Switch>
    </Router>
    </>
  );

}
