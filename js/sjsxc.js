(function($, pt) {

   if (typeof configureLinksInMessage === "function") {
      var configureLinksInMessageOld = configureLinksInMessage;

      configureLinksInMessage = function() {
         configureLinksInMessageOld();

         var spot = $("<span>X</span>").addClass("jsxc_spot");
         var mails = $('#messageContent').find('a[href^="mailto:"]');

         mails.each(function() {
            var href = $(this).attr("href").replace(/^ *mailto:/, "").trim();

            if (href != Strophe.getBareJidFromJid(jsxc.storage.getItem("jid"))) {
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
         console.log("Add X to " + mails.length);
      };
   }

   function onRosterToggle(event, state, duration) {
      var wrapper = $('#rightPanel');
      var control = $('#toolbar');

      var roster_width = (state == 'shown') ? $('#jsxc_roster').outerWidth() : 0;
      // var navigation_width = $('#navigation').width();
//      roster_width += 4;
      console.log('Roster width ', roster_width);
      
      wrapper.animate({
         marginRight: (roster_width) + 'px'
      }, duration);

      control.animate({
         marginRight: (roster_width) + 'px'
      }, duration, 'swing', function() {
         if (typeof SOGoResizableTableInterface != 'undefined')
            SOGoResizableTableInterface.resize.call(pt('messageListHeader'));
      });
   }

   function onRosterReady() {

      var roster_width = $('#jsxc_roster').outerWidth();
   
      // var navigation_width = $('#navigation').width();
      var roster_right = parseFloat($('#jsxc_roster').css('right'));
      var mr = (204 + ($.isNumeric(roster_right) ? roster_right : 0));

      $('#toolbar').css('marginRight', mr + 'px');
      $('#rightPanel').css('marginRight', mr + 'px');

      if (typeof SOGoResizableTableInterface != 'undefined')
         SOGoResizableTableInterface.resize.call(pt('messageListHeader'));
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

      if ($('#linkBanner').length == 0) {
         return;
      }

      lazyLoadCss([ 'jquery.colorbox', 'jsxc.sogo' ]);

      $(document).on('ready.roster.jsxc', onRosterReady);
      $(document).on('toggle.roster.jsxc', onRosterToggle);

      if (jsxc.storage.getItem("abort"))
         return;

      jsxc.init({
         loginForm: {
            form: '#connectForm',
            jid: '#userName',
            pass: '#password',
            preJid: function(jid) {

               var resource = '';
               var domain = 'localhost';
               var boshUrl = '/bosh/';

               jsxc.storage.setItem('boshUrl', boshUrl);

               if (jid.match(/@(.*)$/))
                  return (jid.match(/\/(.*)$/)) ? jid : jid + resource;

               return jid + '@' + domain + resource;
            }
         },
         logoutElement: $('#logoff'),
         checkFlash: false,
         debug: function(msg, data) {
            if (data)
               console.log(msg, data);
            else
               console.log(msg);
         },
         rosterAppend: 'body',
         root: ResourcesURL + '/sjsxc/',
         // @TODO: don't include get turn credentials routine into jsxc
         turnCredentialsPath: null,
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
               if (ev.which !== 13)
                  return;

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
