import React, { useEffect } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { store } from '../redux/store';
import { loadUser } from '../redux/auth/auth.actions';

import Navbar from '../pages/navbar/Navbar';
import LandingPage from '../pages/LandingPage';
import NewsfeedPage from '../pages/NewsfeedPage';
import FriendsPage from '../pages/FriendsPage';
import ProfilePage from '../pages/ProfilePage';
import ProfileEditPage from '../pages/ProfileEditPage';
import UsersPage from '../pages/UsersPage';
import NotFoundPage from '../pages/404-page/NotFoundPage';

import Alert from '../components-page/alert/Alert';
import PrivateRoute from '../components-page/private-route/PrivateRoute';

// *************************** APP ROUTER *************************** //
const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <Alert />
      <Switch>
        <Route exact path='/' component={LandingPage} />
        <PrivateRoute exact path='/newsfeed' component={NewsfeedPage} />
        <PrivateRoute exact path='/friends' component={FriendsPage} />
        <PrivateRoute exact path='/profile/edit' component={ProfileEditPage} />
        <PrivateRoute exact path='/profile/:id' component={ProfilePage} />
        <PrivateRoute exact path='/users' component={UsersPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </BrowserRouter>
  )
};

export default App;