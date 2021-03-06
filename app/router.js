import EmberRouter from '@ember/routing/router';
import config from './config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {
  // this.route('home');
  // this.route('qr');
  this.route('login', { path: ''});
  this.route('dashboard');

  // this.route('add-bed');
  // this.route('scan');
  // this.route('bed', { path: '/bed/:id' });
  this.route('add-ward');
  this.route('ward', { path: 'ward/:id' }, function() {
    this.route('add-beds');
    this.route('edit');
  });
  this.route('reports');
  this.route('terms-of-use');
});
