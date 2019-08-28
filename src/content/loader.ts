'use strict';

import { Website } from './website';
import { Slack } from './websites/slack';
import { Discord } from './websites/discord';

export const load = (location: Location): Website | null => {
  var siteClasses: Website[] = [];

  siteClasses.push(new Slack());
  siteClasses.push(new Discord());

  for (const siteClass of siteClasses) {
    if (window.location.hostname === siteClass.getDomain()) {
      return siteClass;
    }
  }
  return null;
};
