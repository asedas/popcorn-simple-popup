(function(Popcorn) {
    /*
    * Simple popup plugin for Popcorn.js
    * Copyright (c) 2014 Marcin Karpeta
    * contact/bugs: web@karpeta.com.pl
    */

    Popcorn.plugin( "popup", (function() {

        var o = { //main internal config for plugin
            targetClass: "popcorn_popup",
            videoContainerId: "popcornVideoContainer",
            styleId: "popcorn_popup_style",
            getStyleSheet: function(){
                return '.' + o.targetClass + ' {\
                    display: none;\
                    position: absolute;\
                    top: 50px;\
                    left: 60%;\
                    z-index: 100;\
                    border-radius: 6px;\
                    border: 2px solid #77797c;\
                    color: #f5f5f5;\
                    opacity: 0.9;\
                    font-family: "Tahoma", sans-serif;\
                    font-weight: 300;\
                    font-size: 14px;\
                    box-shadow: 1px 1px 4px #ababab;\
                    overflow: hidden;\
                }\
                .' + o.targetClass + ' .popup_close {\
                    position: absolute;\
                    right: 8px;\
                    top: 10px;\
                    width: 16px;\
                    height: 16px;\
                    background: transparent;\
                    transition: all .3s ease; -webkit-transition: all .3s ease; -moz-transition: all .3s ease; -o-transition: all .3s ease;\
                    opacity: .5;\
                }\
                .' + o.targetClass + ' .popup_close:before,\
                .' + o.targetClass + ' .popup_close:after {\
                    position: absolute;\
                    content: "";\
                    width: 100%;\
                    height: 3px;\
                    bottom: 50%;\
                    background: #f5f5f5;\
                    transform: rotate(45deg); -ms-transform: rotate(45deg); -webkit-transform: rotate(45deg);\
                }\
                .' + o.targetClass + ' .popup_close:hover {\
                    top: 6px;\
                    opacity: 1;\
                    transform: rotate(180deg); -ms-transform: rotate(180deg); -webkit-transform: rotate(180deg);\
                }\
                .' + o.targetClass + ' .popup_close:after {\
                    transform: rotate(-45deg); -ms-transform: rotate(-45deg); -webkit-transform: rotate(-45deg);\
                }\
                .' + o.targetClass + ' .popup_title {\
                    padding: 10px;\
                    background: #18191d;\
                    font-weight: 700;\
                    min-height: 20px;\
                    background: linear-gradient(to bottom, #000 0%, #32353A 80%);\
                }\
                .' + o.targetClass + ' .popup_content {\
                    min-width: 100px;\
                    min-height: 20px;\
                    padding: 10px;\
                    background: linear-gradient(to bottom,  #1a1b1e 0%, #32353a 100%);\
                }\
                #' + o.videoContainerId + ' {\
                    position: relative;\
                    display: inline-block;\
                }'
            },
            hasJQuery: function() {
                return window.jQuery !== undefined && ['fadeIn'] !== undefined;
            }
        },

        _addStyleSheet = function() {
            var $head = document.head || document.getElementsByTagName('head')[0],
                $style = document.createElement('style');

            // add popup CSS styles if not added yet
            $style.type = 'text/css';
            $style.id = o.styleId;

            if ($style.styleSheet){
                $style.styleSheet.cssText = o.getStyleSheet();
            } else {
                $style.appendChild(document.createTextNode(o.getStyleSheet()));
            }

            //prepending to allow overwrite default styles in css file
            $head.insertBefore($style, $head.firstChild);
        },

        _createPopup = function(t) {
            var $target = document.createElement('div'),
                $popupTemplate = (t.closeable === false) ?
                    '<div class="popup_title"></div><div class="popup_content"></div>' :
                    '<a href="#" class="popup_close"></a><div class="popup_title"></div><div class="popup_content"></div>';

            $target.id = t._id;
            $target.className = o.targetClass;
            $target.style.top = t.top;
            $target.style.left = t.left;
            $target.innerHTML = $popupTemplate;
            document.body.appendChild($target);
        },

        _fillPopup = function(ev, t) {
            var $popupTarget = document.getElementById(t._id);

            //fill in the content
            for(var i = $popupTarget.childNodes.length, $current; i>0; i--) {
                $current = $popupTarget.childNodes[i-1];

                if($current.className === 'popup_title') {
                    $current.innerHTML = t.title;
                } else if($current.className === 'popup_content') {
                    $current.innerHTML = t.text;
                } else if($current.className === 'popup_close') {
                    $current.onclick = function() {
                        t._natives.end(ev, t);
                    }
                }
            };
        }

        return {
            manifest: {
                about: {
                    name: "Popup plugin",
                    version: "0.1",
                    author: "Martin Karpeta",
                    website: "www.tbscg.com"
                },
                options: {
                   start: { elem: "input", type: "text", label: "In" },
                   end: { elem: "input", type: "text", label: "Out" },
                   position: { top: "Position top", left: "Position left" },
                   title: { elem: "input", type: "text", label: "Popup title" },
                   text: { elem: "input", type: "text", label: "Popup text" },
                   pauseOnShow: { elem: "input", type: "boolean", label: "Pause on show"},
                   closeable: { elem: "input", type: "boolean", label: "Popup closeable"}
                }
            },
            _setup: function(t) {
                if(document.getElementById(o.styleId) === null) {
                    _addStyleSheet();
                };

                _createPopup(t);
            },
            start: function(ev, t) {
                var $popupTarget = document.getElementById(t._id),
                    $video = ev.target,
                    $wrapper = (document.getElementById(o.videoContainerId) === null) ?
                        document.createElement('div') :
                        document.getElementById(o.videoContainerId);

                if(document.getElementById(o.videoContainerId) === null) {
                    // wrap target video to make popup absolute positioned
                    $wrapper.id = o.videoContainerId;
                    ev.target.parentNode.appendChild($wrapper);
                    $wrapper.appendChild(ev.target);
                }
                $wrapper.appendChild($popupTarget);
                _fillPopup(ev, t);

                if(!t.pauseOnShow) {
                    Popcorn("#" + $video.id).play();
                } else {
                    Popcorn("#" + $video.id).pause();
                }

                if(o.hasJQuery()) {
                    $('#' + t._id).fadeIn();
                } else {
                    $popupTarget.style.display = "block";
                }
            },
            end: function(ev, t){
                if(t.pauseOnShow) { // resume video
                    ev.target.play();
                }
                if(o.hasJQuery()) {
                    $('#' + t._id).fadeOut();
                } else {
                    t.target.style.display = "none";
                }
            }
        }
    })());
})(Popcorn);