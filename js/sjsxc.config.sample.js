/**
 * Rename/copy this file to sjsxc.config.js and adjust the settings.
 */

var sjsxc = {};
sjsxc.config = {
    /** enable chat by default? */
    enable: true,

    xmpp: {
        /** url to bosh server binding. */
        url: '/http-bind/',

        /** domain part of your jid */
        domain: 'localhost',

        /** which resource should be used? Blank, means random. */
        resource: '',

        /** optional function to fine-tune JID;
         * if undefined, login@domain/resource is used.
         * The resource parameter here already has a / prepended */
//        mkjid: function(login, domain, resource) {
//                if (login == 'user1') return login + "@domain1.com" + resource;
//                if (login == 'user2') return login + "@domain1.com" + resource;
//                return login + '@' + domain + resource;
//        },

        /** Allow user to overwrite xmpp settings? */
        overwrite: true,

        /** Should chat start on login? */
        onlogin: true
    },

    /** JSXC options. */
    jsxc: {

    },

    /** Domain specific settings. */
    'example.local': {
       enable: false
    }
};

