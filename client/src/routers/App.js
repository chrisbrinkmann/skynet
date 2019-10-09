import React, { } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import LandingPage from '../pages/LandingPage';
import NewsfeedPage from '../pages/NewsfeedPage';
import FriendsPage from '../pages/FriendsPage';
import ProfilePage from '../pages/ProfilePage';
import NotFoundPage from '../pages/404-page/NotFoundPage';

// *************************** APP ROUTER *************************** //
const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={LandingPage} />
        <Route exact path='/newsfeed' component={NewsfeedPage} />
        <Route exact path='/friends' component={FriendsPage} />
        <Route exact path='/profile/:id' component={ProfilePage} />
        <Route component={NotFoundPage} />
      </Switch>
    </BrowserRouter>
  )
};

export default App;