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

        /** optional function to fine-tune JID */
        tuneJid: function(jid) {
                // lastIndexOf(str, 0) is an efficient startsWith(str)
                if (jid.lastIndexOf('user1@', 0) == 0) return 'user1@domain1.com/sogo';
                if (jid.lastIndexOf('user2@', 0) == 0) return 'user2@domain2.com/sogo';
                if (jid.lastIndexOf('user3@', 0) == 0) return 'user3@domain3.com/sogo';
                return jid;
        },

        /** which resource should be used? Blank means random. */
        resource: '/sogo',

        /** Allow user to overwrite xmpp settings? */
        overwrite: true,

        /** Should chat start on login? */
        onlogin: true
    }
};

