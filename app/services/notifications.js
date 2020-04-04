import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class NotificationsService extends Service {
  @tracked notifications = [];

  addNotification(notification) {
    this.notifications.push(notification);
  }

  clearNotifications() {
    this.notifications = [];
  }
}
