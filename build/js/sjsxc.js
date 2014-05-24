/**
 * sjsxc v0.1.0ia - 2014-05-24
 * 
 * Copyright (c) 2014 Klaus Herberth <klaus@jsxc.org> <br>
 * Released under the MIT license
 * 
 * Please see http://jsxc.org/
 * 
 * @author Klaus Herberth <klaus@jsxc.org>
 * @version 0.1.0ia
 */

/* global jsxc, $, configureLinksInMessage:true, SOGoResizableTableInterface, ResourcesURL, onLoginClick, onFieldKeyDown */

var sjsxc = {};
sjsxc.config = {
    boshUrl: '/http-bind/', // or e.g. 'http://localhost:5280/http-bind/'
    domain: 'localhost',
    resource: ''
};

(function($, pt) {

   if (typeof configureLinksInMessage === "function") {
      var configureLinksInMessageOld = configureLinksInMessage;

      configureLinksInMessage = function() {
         configureLinksInMessageOld();

         var spot = $("<span>X</span>").addClass("jsxc_spot");
         var mails = $('#messageContent').find('a[href^="mailto:"]');

         mails.each(function() {
            var href = $(this).attr("href").replace(/^ *mailto:/, "").trim();

            if (href !== Strophe.getBareJidFromJid(jsxc.storage.getItem("jid"))) {
               var cid = jsxc.jidToCid(href);
               var s = spot.clone().addClass("jsxc_buddy_" + cid);

               $(this).before(s);

               if (jsxc.storage.getUserItem('buddy_' + cid)) {
                  jsxc.gui.update(cid);
                  s.click(function(){
                     jsxc.gui.window.open(cid);
                  });
               } else {
                  s.click(function(){
                     jsxc.gui.showContactDialog(href);
                  });
               }
            }
         });
      };
   }

   function onRosterToggle(event, state, duration) {
      var wrapper = $('#rightPanel');
      var control = $('#toolbar');
      var roster_width = (state === 'shown') ? $('#jsxc_roster').outerWidth() : 0;
      
      wrapper.animate({
         marginRight: (roster_width) + 'px'
      }, duration);

      control.animate({
         marginRight: (roster_width) + 'px'
      }, duration, 'swing', function() {
         if (typeof SOGoResizableTableInterface !== 'undefined') {
            SOGoResizableTableInterface.resize.call(pt('messageListHeader'));
         }
      });
   }

   function onRosterReady() {

      var roster_right = parseFloat($('#jsxc_roster').css('right'));
      var mr = (204 + ($.isNumeric(roster_right) ? roster_right : 0));

      $('#toolbar').css('marginRight', mr + 'px');
      $('#rightPanel').css('marginRight', mr + 'px');

      if (typeof SOGoResizableTableInterface !== 'undefined') {
         SOGoResizableTableInterface.resize.call(pt('messageListHeader'));
      }
   }

   function lazyLoadCss(val) {
      var files = ($.isArray(val)) ? val : [ val ];

      var f = null;
      for (f in files) {
         if (files.hasOwnProperty(f)) {
            $("head").append($("<link rel='stylesheet' href='/SOGo.woa/WebServerResources/sjsxc/css/" + files[f] + ".css' type='text/css' media='screen' />"));
         }
      }
   }

   // initialization
   $(function() {

      if ($('#linkBanner').length === 0) {
         return;
      }

      lazyLoadCss([ 'jquery.colorbox', '../js/jsxc/jsxc', 'webrtc', 'jsxc.sogo' ]);

      $(document).on('ready.roster.jsxc', onRosterReady);
      $(document).on('toggle.roster.jsxc', onRosterToggle);

      if (jsxc.storage.getItem("abort")) {
         return;
      }

      jsxc.init({
         loginForm: {
            form: '#connectForm',
            jid: '#userName',
            pass: '#password',
            preJid: function(jid) {

               jsxc.storage.setItem('boshUrl', sjsxc.config.boshUrl);

               if (jid.match(/@(.*)$/)) {
                  return (jid.match(/\/(.*)$/)) ? jid : jid + sjsxc.config.resource;
               }

               return jid + '@' + sjsxc.config.domain + sjsxc.config.resource;
            }
         },
         logoutElement: $('#logoff'),
         checkFlash: false,
         rosterAppend: 'body',
         root: ResourcesURL + '/sjsxc/',
         turnCredentialsPath: '/SOGo.woa/WebServerResources/sjsxc/ajax/getturncredentials.php',
         formFound: function() {
            var submit = pt("submit");
            submit.stopObserving("click", onLoginClick);
            
            var userName = pt("userName");
            userName.stopObserving("keydown", onFieldKeyDown);
            
            var passw = pt("password");
            passw.stopObserving("keydown", onFieldKeyDown);

            $('#connectForm').submit(onLoginClick);
            $('#submit').click(function() {
               console.log("submit click");
               $('#connectForm').submit();
            });
            $('#userName, #password').keypress(function(ev) {
               if (ev.which !== 13) {
                  return;
               }

               $('#connectForm').submit();
            });
         }
      });

      // Add submit link without chat functionality
      if (jsxc.el_exists($('#body-login form'))) {

         var link = $('<a/>').text('Log in without chat').click(function() {
            jsxc.submitLoginForm();
         });

         var alt = $('<p id="jsxc_alt"/>').append(link);
         $('#body-login form fieldset').append(alt);
      }
   });

})(jQuery, $);
