# About graphonline

This is source code of graphonline service. Graphonline helps visualize graph and applies a lot of algorithms.

# License

MIT License.

# Requirements

Client side:
1. HTML5 support of client side.

Server side:
1. PHP 5.6
2. Binary cgi supports. It needs for some algorithm, but almost all can work without it.

# How to run

1. Download repository to local website folder. It should be placed into root of domen. It can work wrong from subdirectory.
2. Change access rights of directory /tmp. PHP scripts need to create and modify files inside it.
3. Run file from browser: /script/merge.php. It merges all js files into one /script/example.js.
4. Run file from browser: /cgi-bin/getPluginsList.php. It creates file with list of plug-ins. Just optimization.
5. Change default root password in file: /core/config/admin_sector.php
```
$g_config['admin_sector']['def_pwd'] = 'rootPass';
```
6. Change password to wiki. Change lines:
```
$DefaultPasswords['admin'] = pmcrypt('pas');
$DefaultPasswords['edit'] = pmcrypt('pas');
```
In files:
/wiki/local/config.php
/en/wiki/local/config.php

7. Maybe you need to disable autoredirect to https. Commends lines:
```
RewriteCond %{HTTPS} off
RewriteRule (.*) https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]
```
In files:
/.htaccess
/wiki/.htaccess
/en/wiki/.htaccess

8. Some algorithms use binary CGI file (short-path, Eulerian cycle/path and so on). If you want to run them, you need to compile GraphOffline util: https://github.com/UnickSoft/GraphOffline. And place it with name /cgi-bin/GraphCGI.exe

# 3th-party

1. Micron (http://zmicron.itkd.ru/) is our engine.
2. PmWiki (https://www.pmwiki.org/) in folders: /wiki/ and /en/wiki/
3. And others: jquery (https://jquery.com/), bootstrap3 (https://getbootstrap.com/), fontawesome (https://fontawesome.com/).

# Supports & feedback

You can write on github to @UnickSoft or to email admin@graphonline.ru
