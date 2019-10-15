import React, { } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Navbar from '../pages/navbar/Navbar';
import LandingPage from '../pages/LandingPage';
import NewsfeedPage from '../pages/NewsfeedPage';
import FriendsPage from '../pages/FriendsPage';
import ProfilePage from '../pages/ProfilePage';
import NotFoundPage from '../pages/404-page/NotFoundPage';

import Alert from '../components-page/alert/Alert';
import PrivateRoute from '../components-page/private-route/PrivateRoute';

// *************************** APP ROUTER *************************** //
const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Alert />
      <Switch>
        <Route exact path='/' component={LandingPage} />
        <PrivateRoute exact path='/newsfeed' component={NewsfeedPage} />
        <PrivateRoute exact path='/friends' component={FriendsPage} />
        <PrivateRoute exact path='/profile/:id' component={ProfilePage} />
        <Route component={NotFoundPage} />
      </Switch>
    </BrowserRouter>
  )
};

export default App;