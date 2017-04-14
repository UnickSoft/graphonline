/*
* Copyright (C) 2013 Erideon (Singapore) Private Limited; http://www.erideon.com/
*
* This library is free software; you can redistribute it and/or modify it under
* the terms of the GNU Lesser General Public License as published by the Free Software Foundation;
* either version 3 of the License, or (at your option) any later version.
*
* This library is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
* without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
* See the GNU Lesser General Public License for more details available from
* Free Software Foundation Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA.
*
* This header must be retained in all distributed or embedded copies of this code and
* reference to www.erideon.com must be made available in derivative works.
*/

(function () {
    var pluginHandle = 'maxheight';
    CKEDITOR.plugins.add(pluginHandle, {
        init: function (oEditor) {
            // for conveniently referencing the plugin in the init-function
            var oPlugin = oEditor.plugins[pluginHandle];

            // we choose the DOM-element where we want to put the eventhandler on
            var eventObject = window;
            if (navigator.appVersion.indexOf("MSIE 7.") != -1) {
                // IE7 cannot react on window-events -> use the parent-element
                eventObject = oEditor.element.$.parentElement;
            }

            // our resize-functionality
            var resizeFunction = function () {
                oPlugin.recalcCKEditorSize(oEditor);
            };

            // for convenience calls from outside
            oEditor.maximizeHeightNow = resizeFunction;
            // window resize events will trigger a CKEditor-resize
            oPlugin.addEvent(eventObject, 'resize', resizeFunction);

            // do an initial resize at startup - does not work if the editor is not visible!
            oEditor.on('instanceReady', resizeFunction);
        },

        recalcCKEditorSize: function (oEditor) {
            /// <summary>
            /// recalculate the size of the CKeditor instance
            /// </summary>
            /// <param name="oEditor">editor to work with</param>

            // make sure everything is available
            if (oEditor && oEditor.element && oEditor.container) {
                // evaluate desired width
                var curSize = oEditor.getResizable()

                // from width-setting of the container / width-property of ASP.NET control
                var curWidth = curSize.$.style.width;
                if (curWidth == '') {
                    // from textarea (style setting on ASP.NET control)
                    curWidth = oEditor.element.$.style.width;
                    if (curWidth == '') {
                        // no definition so far
                        // we assume 100%
                        curWidth = '100%';
                    }
                }

                // we take height from encapsulating div/body/...
                oEditor.resize(curWidth, oEditor.container.$.parentElement.offsetHeight, null, false);
            }
        },

        addEvent: function (elem, type, eventHandle) {
            /// <summary>
            /// handles attaching events cross-browser.
            /// <see href="http://stackoverflow.com/questions/641857/javascript-window-resize-event" />
            /// </summary>
            /// <param name="elem">the object to attach the event on</param>
            /// <param name="type">name of the event</param>
            /// <param name="eventHandle">the event handler</param>

            if (elem == null || elem == undefined) return;
            if (elem.addEventListener) {
                elem.addEventListener(type, eventHandle, false);
            } else if (elem.attachEvent) {
                elem.attachEvent("on" + type, eventHandle);
            } else {
                elem["on" + type] = eventHandle;
            }
        }
    });
})();
