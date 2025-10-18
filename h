warning: in the working copy of 'src/index.css', LF will be replaced by CRLF the next time Git touches it
[1mdiff --git a/index.html b/index.html[m
[1mindex 6bf60bd..15ef71f 100644[m
[1m--- a/index.html[m
[1m+++ b/index.html[m
[36m@@ -1,9 +1,15 @@[m
[31m-<!DOCTYPE html>[m
[32m+[m[32m<!doctype html>[m
 <html lang="es">[m
   <head>[m
     <meta charset="UTF-8" />[m
[32m+[m[32m    <link rel="icon" type="image/svg+xml" href="/vite.svg" />[m
     <meta name="viewport" content="width=device-width, initial-scale=1.0" />[m
[31m-    <title>PROMPTRAITS - Retratos Profesionales con IA</title>[m
[32m+[m[41m    [m
[32m+[m[32m    <link rel="preconnect" href="https://fonts.googleapis.com">[m
[32m+[m[32m    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>[m
[32m+[m[32m    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Saira+Extra+Condensed:wght@700;800;900&display=swap" rel="stylesheet">[m
[32m+[m[41m    [m
[32m+[m[32m    <title>Promptraits</title>[m
   </head>[m
   <body>[m
     <div id="root"></div>[m
[1mdiff --git a/src/index.css b/src/index.css[m
[1mindex bbac210..fa8cee6 100644[m
[1m--- a/src/index.css[m
[1m+++ b/src/index.css[m
[36m@@ -36,3 +36,51 @@[m [mh1, h2, .heading {[m
   letter-spacing: 0.04em;[m
   line-height: 1.05;[m
 }[m
[32m+[m
[32m+[m[32m/* Variables CSS globales */[m
[32m+[m[32m:root {[m
[32m+[m[32m  --bg: #06060C;[m
[32m+[m[32m  --surface: #2D2D2D;[m
[32m+[m[32m  --fg: #FFFFFF;[m
[32m+[m[32m  --muted: #C1C1C1;[m
[32m+[m[32m  --primary: #D8C780;[m
[32m+[m[32m  --border: #2D2D2D;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32mhtml, body {[m
[32m+[m[32m  background: var(--bg);[m
[32m+[m[32m  color: var(--fg);[m
[32m+[m[32m  font-family: "Montserrat", system-ui, sans-serif;[m
[32m+[m[32m  margin: 0;[m
[32m+[m[32m  padding: 0;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32mh1, h2, .heading {[m
[32m+[m[32m  font-family: "Saira Extra Condensed", system-ui, sans-serif;[m
[32m+[m[32m  letter-spacing: 0.04em;[m
[32m+[m[32m  line-height: 1.05;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32m/* Variables CSS globales */[m
[32m+[m[32m:root {[m
[32m+[m[32m  --bg: #06060C;[m
[32m+[m[32m  --surface: #2D2D2D;[m
[32m+[m[32m  --fg: #FFFFFF;[m
[32m+[m[32m  --muted: #C1C1C1;[m
[32m+[m[32m  --primary: #D8C780;[m
[32m+[m[32m  --border: #2D2D2D;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32mhtml, body {[m
[32m+[m[32m  background: var(--bg);[m
[32m+[m[32m  color: var(--fg);[m
[32m+[m[32m  font-family: "Montserrat", system-ui, sans-serif;[m
[32m+[m[32m  margin: 0;[m
[32m+[m[32m  padding: 0;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32mh1, h2, .heading {[m
[32m+[m[32m  font-family: "Saira Extra Condensed", system-ui, sans-serif;[m
[32m+[m[32m  letter-spacing: 0.04em;[m
[32m+[m[32m  line-height: 1.05;[m
[32m+[m[32m}[m
