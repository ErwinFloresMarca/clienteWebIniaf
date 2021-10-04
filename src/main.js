import Vue from 'vue';

import Cookies from 'js-cookie';

import 'normalize.css/normalize.css'; // a modern alternative to CSS resets

import Element from 'element-ui';
import './styles/element-variables.scss';
import esLang from 'element-ui/lib/locale/lang/es';// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖

import '@/styles/index.scss'; // global css

import App from './App';
import store from './store';
import router from './router';

import './icons'; // icon
import './permission'; // permission control
import './utils/error-log'; // error log

import * as filters from './filters'; // global filters

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  locale: esLang, // 如果使用中文，无需设置，请删除
});

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

Vue.config.productionTip = false;
// sonido
var audio = new Audio('/sounds/song.mp3');
audio.play();
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
});
