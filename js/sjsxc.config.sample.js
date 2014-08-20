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

        /** Allow user to overwrite xmpp settings? */
        overwrite: true,

        /** Should chat start on login? */
        onlogin: true
    }
};

