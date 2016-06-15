/* jshint undef: false, newcap: false, latedef:nofunc */

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

   function onRosterToggle(event, state) {      
         if ($(window).width() < 768) {
            // Do not resize elements on extra small devices (bootstrap definition)
            return;
         }
      
        if (state === 'shown') {
           $('body').addClass('jsxc_rosterVisible');
        } else {
           $('body').removeClass('jsxc_rosterVisible');
        }
   }

   function onRosterReady() {      
      if ($(window).width() < 768) {
          // Do not resize elements on extra small devices (bootstrap definition)
          return;
      }

      injectChatIcon();

        if ($('#jsxc_roster').hasClass('jsxc_state_hidden')) {
           $('body').removeClass('jsxc_rosterVisible');
        } else {
           $('body').addClass('jsxc_rosterVisible');
        }
        
        function injectChatIcon() {
          var settingsButton = $('a[aria-label="settings_applications"]');
          
          if (settingsButton.length === 0) {
             setTimeout(injectChatIcon, 500);
             return;
          }
          
          var a = $('<a>');
          a.addClass('md-icon-button md-button md-ink-ripple');
          a.attr('id', 'jsxc_chatIcon');
          a.click(function(){
             jsxc.gui.roster.toggle();
          });
          
          settingsButton.after(a);
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
            form: '#login [name="loginForm"]',
            jid: '#login [ng-model="app.creds.username"]',
            pass: '#login [ng-model="app.creds.password"]',
            onConnecting: 'quiet',
            onAuthFail: 'quiet',
            ifFound: 'force'
         },
         logoutElement: '[href="../logoff"]',
         root: ResourcesURL + '/sjsxc/js/jsxc',
         RTCPeerConfig: {
            url: '/SOGo.woa/WebServerResources/sjsxc/ajax/getturncredentials.php'
         },
         loadSettings: function() {
            return sjsxc.config;
         },
         displayRosterMinimized: function() {
             return true; //$('[ng-href="../logoff"]').length > 0;
         },
         formFound: function() {
            $('#login button[type="submit"]:first').attr('id', 'submit');
            $('#login button[type="submit"]:first').click(function(ev) {
               var conn = jsxc.xmpp.conn;

               if (!(conn && conn.connected && conn.authenticated)) {
                  ev.stopPropagation();
                  ev.preventDefault();

                  $(jsxc.options.loginForm.form).submit();
               }
            });
         }
      }, sjsxc.config.jsxc || {}));

      // Add submit link without chat functionality
      /*if (jsxc.el_exists($('#login'))) {

         var link = $('<a/>').text($.t('Log_in_without_chat')).click(function() {
            jsxc.submitLoginForm();
         });

         var alt = $('<p id="jsxc_alt"/>').append(link);
         $('#submit').before(alt);
      }*/
   };

   var sjsxc_init = function() {
      if ($('#jsxc_sogo_test').css('background-color') !== '' && $('#jsxc_sogo_test').css('position') === 'absolute') {
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

      var el = $('<div>').attr('class', 'jsxc_window').attr('id', 'jsxc_sogo_test');
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
