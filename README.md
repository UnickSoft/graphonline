# About graphonline

This is source code of graphonline service. Graphonline helps visualize graph and applies a lot of algorithms.

# License

MIT License.

# Requirements

Client side:
1. HTML5 support of client side.

Server side:
1. PHP 7.4 or PHP 5.6.
2. Binary cgi supports. It needs for some algorithm, but almost all can work without it.

# How to run

1. Download repository to local website folder. It should be placed into root of domen. If you want to run graphonline from subdirectory read "Additional steps to run from subdirectory" below.
2. Change access rights of directory /tmp (it is actually for Non-Windows system, you should set rwx). PHP scripts should be able to create and to modify files inside it.
3. Change default root password in file: /core/config/admin_sector.php
```
$g_config['admin_sector']['def_pwd'] = 'rootPass';
```
4. Change password to wiki. Change lines:
```
$DefaultPasswords['admin'] = pmcrypt('pas');
$DefaultPasswords['edit'] = pmcrypt('pas');
```
In files:
/wiki/local/config.php
/en/wiki/local/config.php

5. Maybe you need to disable autoredirect to https. Comments or remove lines:
```
RewriteCond %{HTTPS} off
RewriteRule (.*) https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]
```
In files:
/.htaccess
/wiki/.htaccess
/en/wiki/.htaccess

6. Some algorithms (short-path, Eulerian cycle/path and so on) use external modul for algorithm. Currently for desktops it is JS file: script\Graphoffline.Emscripten.js. For mobile phones and tablets we continue using binary CGI file. Binary CGI or Graphoffline.Emscripten.js are built from GraphOffline: https://github.com/UnickSoft/GraphOffline. Binary cgi should be placed to /cgi-bin/GraphCGI.exe or you can take precompiled file(Windows and Mac) from /cgi-bin/GraphOffline/

# Additional steps to run from subdirectory:

For example you place graphonline sources into http://localhost/graph/ directory.

1. Edit .htaccess change RewriteRule to line:
```
RewriteRule ^(.*)$ /graph/index.php?q=$1 [L,QSA]
```
2. Write your directory name to script\main.js variable SiteDirs:
```
var SiteDir     = "graph/";
```
3. Write your directory to core config core\config\main.php in line SITE_IN_DIR:
```
define('SITE_IN_DIR',   'graph');
```
4. Run merge.php to apply changes. Run http://localhost/graph/script/merge.php


# Additional steps if you want to change js scripts from script directory:
1. We use our own js cache. It is files *.js.cache located in in script/pages. If you remove these cache files the browser will load scripts from source files. You may need to disable browser cache. Or change setting: $g_config['use_js_cache']
2. If you want to update cache use this admin page: /admin/page_update_script_cache. Just click to all links and wait until the cache will be updated.
3. If you change cache files and you want browsers to redownload script cache incripent number in setting $g_config['engine_version'].

# Fix problems

1. If you see page but css is not loaded. Maybe your web server does not support gzip encoding. You can try change FORCE_DISABLE_GZIP field from **false** to **true**. (It is placed in file /lib/ExtraPacker/ExtraPacker.php).

# Create JS algorithms without setting up a Web Server

You can open HTML file in browser to run your algorithm. Read more here sandbox/README.md.

# Offline build

You may download offline build. It is ready to run on local machine and includes tuned web server and other software. https://graphonline.ru/en/wiki/Aricles/OfflineVersion

# 3rd-party

1. Micron (http://zmicron.itkd.ru/) is our engine.
2. PmWiki (https://www.pmwiki.org/) in folders: /wiki/ and /en/wiki/
3. And others: jquery (https://jquery.com/), bootstrap5 (https://getbootstrap.com/), bootstrap icons (https://icons.getbootstrap.com/).

# Support & feedback

You can write on github to @UnickSoft or to email admin@graphonline.ru
