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
                    background: rgba(55, 55, 55, .75);\
                    position: absolute;\
                    top: 50px;\
                    left: 60%;\
                    z-index: 10;\
                    border-radius: 6px;\
                    border: 2px solid #77797c;\
                    outline: 1px #5b5e67;\
                    color: #f5f5f5;\
                    font-family: "Tahoma", sans-serif;\
                    overflow: hidden;\
                    font-weight: 300;\
                    opacity: 0.9;\
                    box-shadow: 1px 1px 4px #ababab;\
                }\
                .' + o.targetClass + ' .popup_content {\
                    width: 100px;\
                    height: 100px;\
                    padding: 10px;\
                    background: linear-gradient(to bottom,  #1a1b1e 0%, #32353a 100%);\
                }\
                .' + o.targetClass + ' .popup_title {\
                    padding: 10px;\
                    background: #18191d;\
                    font-weight: 700;\
                    background: linear-gradient(to bottom, #000 0%, #32353A 80%);\
                }\
                #' + o.videoContainerId + ' {\
                    position: relative;\
                    display: inline-block;\
                    z-index: -1;\
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
            var $target = document.createElement('div');

            $target.id = t._id;
            $target.className = o.targetClass;
            $target.style.top = t.top;
            $target.style.left = t.left;
            $target.innerHTML = '<div class="popup_title"></div><div class="popup_content"></div>';
            document.body.appendChild($target);
        },

        _fillPopup = function(t) {
            var $popupTarget = document.getElementById(t._id);

            //fill in the content
            for(var i = $popupTarget.childNodes.length, $current; i>0; i--) {
                $current = $popupTarget.childNodes[i-1];
                if($current.className === 'popup_title') {
                    $current.innerHTML = t.title;
                } else if($current.className === 'popup_content') {
                    $current.innerHTML = t.text;
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
                   pauseOnShow: { elem: "input", type: "boolean", label: "Pause on show"}
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
                _fillPopup(t);

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
                if(o.hasJQuery()) {
                    $('#' + t._id).fadeOut();
                } else {
                    t.target.style.display = "none";
                }
            }
        }
    })());
})(Popcorn);