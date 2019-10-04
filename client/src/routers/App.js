import React, { } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import LandingPage from '../pages/LandingPage';
import NewsfeedPage from '../pages/NewsfeedPage';
import FriendsPage from '../pages/FriendsPage';
import ProfilePage from '../pages/ProfilePage';

// *************************** APP ROUTER *************************** //
const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={LandingPage} />
        <Route exact path='/newsfeed' component={NewsfeedPage} />
        <Route exact path='/friends' component={FriendsPage} />
        <Route exact path='/profile/:id' component={ProfilePage} />
      </Switch>
    </BrowserRouter>
  )
};

export default App;