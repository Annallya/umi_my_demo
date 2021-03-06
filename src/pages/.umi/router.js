import React from 'react';
import {
  Router as DefaultRouter,
  Route,
  Switch,
  StaticRouter,
} from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/lib/renderRoutes';
import history from '@@/history';
import { routerRedux } from 'dva';

const Router = routerRedux.ConnectedRouter;

const routes = [
  {
    path: '/',
    component: require('../../layouts/index').default,
    routes: [
      {
        path: '/',
        exact: true,
        _title: 'umiDemo',
        _title_default: 'umiDemo',
      },
      {
        path: '/proxy',
        component: require('../Proxy').default,
        exact: true,
        _title: 'umiDemo',
        _title_default: 'umiDemo',
      },
      {
        path: '/testline',
        component: require('../TablePush').default,
        exact: true,
        _title: 'umiDemo',
        _title_default: 'umiDemo',
      },
      {
        path: '/echarts',
        component: require('../Echarts').default,
        exact: true,
        _title: 'umiDemo',
        _title_default: 'umiDemo',
      },
      {
        path: '/css',
        component: require('../TestCss/index12').default,
        exact: true,
        _title: 'umiDemo',
        _title_default: 'umiDemo',
      },
      {
        path: '/form',
        component: require('../Form').default,
        exact: true,
        _title: 'umiDemo',
        _title_default: 'umiDemo',
      },
      {
        path: '/virtual',
        component: require('../Virtual').default,
        exact: true,
        _title: 'umiDemo',
        _title_default: 'umiDemo',
      },
      {
        path: '/layer',
        component: require('../Layer').default,
        exact: true,
        _title: 'umiDemo',
        _title_default: 'umiDemo',
      },
      {
        component: () =>
          React.createElement(
            require('/Users/lina/demoCode/umiDemo/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
        _title: 'umiDemo',
        _title_default: 'umiDemo',
      },
    ],
    _title: 'umiDemo',
    _title_default: 'umiDemo',
  },
  {
    component: () =>
      React.createElement(
        require('/Users/lina/demoCode/umiDemo/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
          .default,
        { pagesPath: 'src/pages', hasRoutesInConfig: true },
      ),
    _title: 'umiDemo',
    _title_default: 'umiDemo',
  },
];
window.g_routes = routes;
const plugins = require('umi/_runtimePlugin');
plugins.applyForEach('patchRoutes', { initialValue: routes });

export { routes };

export default class RouterWrapper extends React.Component {
  unListen() {}

  constructor(props) {
    super(props);

    // route change handler
    function routeChangeHandler(location, action) {
      plugins.applyForEach('onRouteChange', {
        initialValue: {
          routes,
          location,
          action,
        },
      });
    }
    this.unListen = history.listen(routeChangeHandler);
    // dva ??? history.listen ?????????????????????
    // ??????????????? dva ???????????????????????? onRouteChange ????????? dva ???????????????????????????????????????
    const isDva =
      history.listen
        .toString()
        .indexOf('callback(history.location, history.action)') > -1;
    if (!isDva) {
      routeChangeHandler(history.location);
    }
  }

  componentWillUnmount() {
    this.unListen();
  }

  render() {
    const props = this.props || {};
    return <Router history={history}>{renderRoutes(routes, props)}</Router>;
  }
}
