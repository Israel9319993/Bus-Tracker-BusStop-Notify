import React, { useState, useEffect } from 'react';

import {
  f7,
  f7ready,
  App,
  Panel,
  Tabs,
  Tab,
  Views,
  View,
  Popup,
  Page,
  Navbar,
  Toolbar,
  NavRight,
  Link,
  Block,
  BlockTitle,
  LoginScreen,
  LoginScreenTitle,
  List,
  ListItem,
  ListInput,
  ListButton,
  BlockFooter
} from 'framework7-react';
import "../css/app.css"

import routes from '../js/routes';
import store from '../js/store';

const MyApp = () => {
  // Login screen demo data
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Framework7 Parameters
  const f7params = {
    name: 'Tracker', // App name
      theme: 'auto', // Automatic theme detection
      colors: {
        primary: '#007aff',
      },



      // App store
      store: store,
      // App routes
      routes: routes,

      // Register service worker (only on production build)
      serviceWorker: process.env.NODE_ENV ==='production' ? {
        path: '/service-worker.js',
      } : {},
  };
  const alertLoginData = () => {
    f7.dialog.alert('Username: ' + username + '<br>Password: ' + password, () => {
      f7.loginScreen.close();
    });
  }
  f7ready(() => {


    // Call F7 APIs here
  });

  return (
    <App { ...f7params }>

        {/* Left panel with cover effect*/}
      

        {/* Views/Tabs container */}
        <Views tabs className="safe-areas" >
          {/* Tabbar for switching views-tabs */}
          <Toolbar tabbar icons bottom id = "bottomTab" >
            <Link tabLink="#view-home" tabLinkActive iconIos="f7:house_fill" iconMd="material:home" text="Home"  className = "bottomTabs" color ="blue"/>
            <Link tabLink="#view-notification" iconIos="f7:bell" iconMd="f7:bell_fill" text="Notification"  className = "bottomTabs"/>
            <Link tabLink="#view-details" iconIos="f7:square_favorites_fill" iconMd="f7:square_favorites_fill" text="Details" className = "bottomTabs"/>
          </Toolbar>

          {/* Your main view/tab, should have "view-main" class. It also has "tabActive" prop */}
          <Tabs animated >
          <View id="view-home" main tab tabActive url="/home/"  />

          {/* Catalog View */}
          <View id="view-notification" name="notification" tab url="/notification/" />

          {/* Settings View */}
          <View id="view-details" name="details" tab url="/details/" />
          </Tabs>
        </Views>

      {/* Popup */}
      <Popup id="my-popup">
        <View>
          <Page>
            <Navbar title="Popup">
              <NavRight>
                <Link popupClose>Close</Link>
              </NavRight>
            </Navbar>
            <Block>
              <p>Popup content goes here.</p>
            </Block>
          </Page>
        </View>
      </Popup>

      <LoginScreen id="my-login-screen">
        <View>
          <Page loginScreen>
            <LoginScreenTitle>Login</LoginScreenTitle>
            <List form>
              <ListInput
                type="text"
                name="username"
                placeholder="Your username"
                value={username}
                onInput={(e) => setUsername(e.target.value)}
              ></ListInput>
              <ListInput
                type="password"
                name="password"
                placeholder="Your password"
                value={password}
                onInput={(e) => setPassword(e.target.value)}
              ></ListInput>
            </List>
            <List>
              <ListButton title="Sign In" onClick={() => alertLoginData()} />
              <BlockFooter>
                Some text about login information.<br />Click "Sign In" to close Login Screen
              </BlockFooter>
            </List>
          </Page>
        </View>
      </LoginScreen>
    </App>
  )
}
export default MyApp;