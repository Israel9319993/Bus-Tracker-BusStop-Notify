
import HomePage from '../pages/home.jsx';
import BusRoute from '../pages/busroutes.jsx';
import FormPage from '../pages/form.jsx';
import NotificationPage from '../pages/notification.jsx';
import ProductPage from '../pages/product.jsx';
import DetailsPage from '../pages/details.jsx';

import DynamicRoutePage from '../pages/dynamic-route.jsx';
import TrackMap from '../pages/trackmap.jsx';
import BusRoutes from '../pages/busroutes.jsx';

var routes = [
  {
    path: '/home/',
    component: HomePage,
  },
  {
    path: '/busroutes/',
    component: BusRoutes,
  },
  {
    path: '/form/',
    component: FormPage,
  },
  {
    path: '/notification/',
    component: NotificationPage,
  },
  {
    path: '/product/:id/',
    component: ProductPage,
  },
  {
    path: '/details/',
    component: DetailsPage,
  },
  {
    path: '/trackmap/',
    component: TrackMap,
  },

  {
    path: '/dynamic-route/blog/:blogId/post/:postId/',
    component: DynamicRoutePage,
  },
  {
    path: '/request-and-load/user/:userId/',
    async: function ({ router, to, resolve }) {
      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      var userId = to.params.userId;

      // Simulate Ajax Request
      setTimeout(function () {
        // We got user data from request
        var user = {
          firstName: 'Vladimir',
          lastName: 'Kharlampidi',
          about: 'Hello, i am creator of Framework7! Hope you like it!',
          links: [
            {
              title: 'Framework7 Website',
              url: 'http://framework7.io',
            },
            {
              title: 'Framework7 Forum',
              url: 'http://forum.framework7.io',
            },
          ]
        };
        // Hide Preloader
        app.preloader.hide();

        // Resolve route to load page
        resolve(
          {
            component: RequestAndLoad,
          },
          {
            props: {
              user: user,
            }
          }
        );
      }, 1000);
    },
  },

];

export default routes;
