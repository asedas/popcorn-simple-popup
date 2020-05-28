popcorn-simple-popup
====================

Simple popup plugin for Popcorn.js
Copyright (c) 2014 Marcin Karpeta
email: web@4brothers.pl
licence: GPL v2


1. OVERVIEW
This plugin is opening simple popup over the video element. Popup is absolute positioned to video element. Several options can be adjusted and multiple popups can be used.

2. USAGE
To use the popup you need to:

 a. add popcorn-popup.js to your site
 b. call the popup from JS:
        
        var pop = Popcorn("#ourvideo");
        pop.popup({
            start: 3,
            end: 7,
            title: "Title",         // popup title
            text: "Con<br/>tent",   // popup content [can be html]
            top: "200px",           // position top
            left: "10px",           // position left
            pauseOnShow: true       // when set to true video will pause on popup show
        });

See code for more details.
