/*!
 * sjsxc v3.3.0-beta.1 - 2017-08-25
 * 
 * Copyright (c) 2017 Klaus Herberth <klaus@jsxc.org> <br>
 * Released under the MIT license
 * 
 * Please see https://www.jsxc.org/
 * 
 * @author Klaus Herberth <klaus@jsxc.org>
 * @version 3.3.0-beta.1
 * @license MIT
 */

/* jshint undef: false, newcap: false */

(function($, pt) {

   if (typeof configureLinksInMessage === 'function') {
      var configureLinksInMessageOld = configureLinksInMessage;

      configureLinksInMessage = function() {
         configureLinksInMessageOld();

         if (jsxc.restoreCompleted) {
            jsxc.gui.detectEmail($('div#messageContent'));
            jsxc.gui.detectUriScheme($('div#messageContent'));
         }
      };
   }

   if (typeof loadContact === 'function') {
      var loadContactOld = loadContact;

      loadContact = function(idx) {
         var available = typeof cachedContacts[Contact.currentAddressBook + "/" + idx] !== 'undefined';
         loadContactOld(idx);

         if (available && jsxc.restoreCompleted) {
            jsxc.gui.detectEmail($('div#contactView'));
         }
      };

      var contactLoadCallbackOld = contactLoadCallback;

      contactLoadCallback = function(http) {
         contactLoadCallbackOld(http);

         if (http.readyState === 4 && http.status === 200 && jsxc.restoreCompleted) {
            jsxc.gui.detectEmail($('div#contactView'));
         }
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

   lazyLoadCss([ 'jquery-ui.min', 'jsxc.sogo' ]);

   function addOption() {
      $('<li><span>Chat Options</span></li>').attr('target', 'chatView').appendTo('#preferencesTabs ul:first');

      var tab = $('<div>').addClass('tab').attr('id', 'chatView');
      tab.appendTo('#preferencesTabs .tabs:first');

      tab.append('<label><input type="checkbox"/> Enable chat</label><p>Change will take effect on next login.<br />This information is stored per browser.</p>');
      var checkbox = tab.find('input');

      checkbox[0].checked = sjsxc.config.enable;
      checkbox.change(function() {
         localStorage.setItem('sjsxc.enable', this.checked);
      });

      var tabsContainer = pt("preferencesTabs");
      var controller = new SOGoTabsController();
      controller.attachToTabsContainer(tabsContainer);
   }

   var sjsxc_start = function() {

      if ($('#linkBanner').length === 0) {
         return;
      }

      $(document).on('ready.roster.jsxc', onRosterReady);
      $(document).on('toggle.roster.jsxc', onRosterToggle);
      $(document).on('connecting.jsxc', function() {
            var form = $(jsxc.options.loginForm.form);

            if (typeof startAnimation === 'function' && form.length > 0) {
                form.find('input, select, #submit').prop('disabled', true);
                startAnimation(pt('animation'));
            }
      });
      $(document).on('authfail.jsxc', function() {
          var form = $(jsxc.options.loginForm.form);

          if (typeof SetLogMessage === 'function' && form.length > 0) {
              $(jsxc.options.loginForm.form).find('input, select, #submit').prop('disabled', false);
              $('#progressIndicator').remove();
              SetLogMessage('errorMessage', _('Wrong username or password.'));
          }
      });
      $(document).on('connected.jsxc', function() {
              $(jsxc.options.loginForm.form).find('input, select, #submit').prop('disabled', false);
      });

      if (jsxc.storage.getItem("abort")) {
         return;
      }

      jsxc.init($.extend({
         app_name: 'SOGo',
         loginForm: {
            form: '#connectForm',
            jid: '#userName',
            pass: '#password',
            onConnecting: 'quiet',
            onAuthFail: 'quiet',
            attachIfFound: false
         },
         logoutElement: $('#logoff'),
         rosterAppend: 'body',
         root: ResourcesURL + '/sjsxc/js/jsxc',
         RTCPeerConfig: {
            url: '/SOGo.woa/WebServerResources/sjsxc/ajax/getturncredentials.php'
         },
         formFound: function() {
            var submit = pt("submit");
            submit.stopObserving("click", onLoginClick);

            var userName = pt("userName");
            userName.stopObserving("keydown", onFieldKeyDown);

            var passw = pt("password");
            passw.stopObserving("keydown", onFieldKeyDown);

            $('#connectForm').submit(function(ev){
                onLoginClick(ev);

                return false;
            });
            $('#submit').click(function() {
                if(!$(this).prop('disabled')) {
                    $('#connectForm').submit();
                }
            });
            $('#userName, #password').keypress(function(ev) {
               if (ev.which !== 13) {
                  return;
               }

               $('#connectForm').submit();
            });
         },
         loadSettings: function() {
            return sjsxc.config;
         },
         displayRosterMinimized: function() {
             return $('#logoff').length > 0;
         }
      }, sjsxc.config.jsxc || {}));

      // Add submit link without chat functionality
      if (jsxc.el_exists($('#loginCell'))) {

         var link = $('<a/>').text($.t('Log_in_without_chat')).click(function() {
            jsxc.submitLoginForm();
         });

         var alt = $('<p id="jsxc_alt"/>').append(link);
         $('#loginCell').append('<br/>').append(alt);
      }
   };

   var sjsxc_init = function() {
      if ($('#jsxc_sogo_test').css('text-align') === 'right') {
         $('#jsxc_sogo_test').remove();
         sjsxc_start();
      } else {
         setTimeout(sjsxc_init, 50);
      }
   };

   $(function() {

      if (typeof sjsxc === 'undefined' || typeof sjsxc.config === 'undefined') {
         console.error('No config for sjsxc found! Look at sjsxc.config.sample.js.');
         return;
      }

      $.extend(true, sjsxc.config, sjsxc.config[document.domain] || {});

      var el = $('<div>').attr('class', 'jsxc_right').attr('id', 'jsxc_sogo_test');
      $('body').append(el);

      var enable = JSON.parse(localStorage.getItem('sjsxc.enable'));
      sjsxc.config.enable = (typeof enable === 'undefined' || enable === null) ? sjsxc.config.enable : enable;

      if (window.location.pathname.match(/\/preferences$/)) {
         addOption();
         return;
      }

      if (sjsxc.config.enable === true) {
         setTimeout(sjsxc_init, 20);
      }
   });

})(jQuery, $);
