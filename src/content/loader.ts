/*
 * This file is part of the Babble project.
 * Babble is a platform agnostic browser extension that allows for easy
 * encryption and decryption of text data across the web.
 * Copyright (C) 2019  keur, yvbbrjdr
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

'use strict';

import { Website } from './website';
import { Discord } from './websites/discord';
import { Gmail } from './websites/gmail';
import { Mastodon } from './websites/mastodon';
import { Slack } from './websites/slack';
import { Telegram } from './websites/telegram';
import { Weibo } from './websites/weibo';
import { WeiboApi } from './websites/weibo-api';

export const load = ( location: Location ): Website | null => {
  let siteClasses: Website[] = [];

  siteClasses.push( new Discord() );
  siteClasses.push( new Gmail() );
  siteClasses.push( new Mastodon() );
  siteClasses.push( new Slack() );
  siteClasses.push( new Telegram() );
  siteClasses.push( new Weibo() );
  siteClasses.push( new WeiboApi() );

  for ( const siteClass of siteClasses ) {
    const domains: string[] = siteClass.getDomains();
    if ( domains.indexOf( location.hostname ) !== -1 ) {
      return siteClass;
    }
  }
  return null;
};
