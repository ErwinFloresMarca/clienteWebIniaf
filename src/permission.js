import router from './router';
import store from './store';
import { Message } from 'element-ui';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import { getToken } from '@/utils/auth'; // get token from cookie
import getPageTitle from '@/utils/get-page-title';
import webRouter from './router/modules/web';

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ['/login', '/auth-redirect']; // no redirect whitelist

webRouter.children.forEach(r => {
  if (r.children) {
    r.children.forEach(r1 => {
      whiteList.push(r1.path);
    });
  } else {
    whiteList.push('/' + r.path);
  }
});

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start();

  // set page title
  document.title = getPageTitle(to.meta.title);

  // first check in constant routes
  if (whiteList.indexOf(to.path) !== -1 && !((to.path === '/login' || to.path === '/registrarse') && getToken())) {
    // in the free login whitelist, go directly
    next();
    NProgress.done();
  } else {
    // check permissions and search async routes
    const hasToken = getToken();

    if (hasToken) {
      const hasPermissions = store.getters.permissions && store.getters.permissions.length > 0;
      if (hasPermissions) {
        if (to.path === '/login' || to.path === '/registrarse') {
          // if is logged in, redirect to the home page
          next({ path: '/admin/dashboard' });
          NProgress.done(); // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
        } else {
          next();
        }
      } else {
        try {
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          const { permissions } = await store.dispatch('user/getInfo');

          // generate accessible routes map based on roles
          const accessRoutes = await store.dispatch('permission/generateRoutes', permissions);

          // dynamically add accessible routes
          router.addRoutes(accessRoutes);

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          if (to.path === '/login' || to.path === '/registrarse') {
            // if is logged in, redirect to the home page
            next({ path: '/admin/dashboard' });
            NProgress.done(); // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
          } else {
            next({ ...to, replace: true });
          }
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken');
          Message.error(error || 'Has Error');
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      }
    } else {
      /* has no token*/
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
