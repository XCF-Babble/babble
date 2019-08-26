'use strict';

import { Website } from './website';
import { Slack } from './website/slack';

export const load = (location: Location): Website | null => {
  // Unfortunately we can't create a loader without doing a disgusting hack. We will do no such thing.
  var siteClass: Website;
  switch (location.hostname) {
    case 'app.slack.com':
      siteClass = new Slack();
      break;
    default:
      return null;
  }
  return siteClass;
};
