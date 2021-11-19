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

1. Download repository to local website folder. It should be placed into root of domen. If you want to run graphonline from subdirectory read "Additional steps to run from subdirectory" below.
2. Change access rights of directory /tmp (it is actually for Non-Windows system, you should set rwx). PHP scripts should be able to create and to modify files inside it.
3. Run file from browser: /script/merge.php. It merges all js files into one /script/example.js.
4. Run file from browser: /cgi-bin/getPluginsList.php?reset. It creates file with list of plug-ins. Just optimization.
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

7. Maybe you need to disable autoredirect to https. Comments or remove lines:
```
RewriteCond %{HTTPS} off
RewriteRule (.*) https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]
```
In files:
/.htaccess
/wiki/.htaccess
/en/wiki/.htaccess

8. Some algorithms use binary CGI file (short-path, Eulerian cycle/path and so on). If you want to run them, you need to compile GraphOffline util: https://github.com/UnickSoft/GraphOffline. And place it with name /cgi-bin/GraphCGI.exe or you can take precompiled file(Windows and Mac) from /cgi-bin/GraphOffline/

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

5. Change path to fontawesome. Change path in file i/css/dev/fontawesome/variables.less line @fa-font-path:
```
@fa-font-path:        "/graph/i/fonts/dev/fontawesome";
```

# Fix problems

1. If you see page but css is not loaded. Maybe your web server does not support gzip encoding. You can try change FORCE_DISABLE_GZIP field from **false** to **true**. (It is placed in file /lib/ExtraPacker/ExtraPacker.php).

# Create JS algorithms without setting Web Server

You can open HTML file in browser to run your algorithm. Read more here sandbox/README.md.

# Offline build

You may download offline build. It is ready to run on local machine and includes tuned web server and other software. https://graphonline.ru/en/wiki/Aricles/OfflineVersion

# 3th-party

1. Micron (http://zmicron.itkd.ru/) is our engine.
2. PmWiki (https://www.pmwiki.org/) in folders: /wiki/ and /en/wiki/
3. And others: jquery (https://jquery.com/), bootstrap3 (https://getbootstrap.com/), fontawesome (https://fontawesome.com/).

# Supports & feedback

You can write on github to @UnickSoft or to email admin@graphonline.ru
