# JavaScript XMPP Client for SOGo

Homepage: http://www.jsxc.org

Bugtracker: https://github.com/sualko/jsxc/issues

Wiki: https://github.com/sualko/jsxc/wiki


## Installation

### Get the code
__a) Packed versions__

Download the latest version from [releases](https://github.com/sualko/sjsxc/releases) and extract it to <code>/usr/lib/GNUstep/SOGo/WebServerResources/</code>.

__b) Nightly version__
```
cd /opt
git clone https://github.com/sualko/sjsxc
cd sjsxc
git submodule update --init --recursive
ln -s /opt/sjsxc /usr/lib/GNUstep/SOGo/WebServerResources/
```

### Configuration
Rename <code>sjsxc/js/sjsxc.config.sample.js</code> to <code>sjsxc/js/sjsxc.config.js</code> and adjust the values for xmpp server, bosh url and xmpp domain and the values for webrtc in <code>sjsxc/ajax/getturncredentials.php</code>.

### Include the files
```
defaults write sogod SOGoUIAdditionalJSFiles '(
    "sjsxc/js/lib/jquery.ui.min.js",
    "sjsxc/js/jsxc/lib/jquery.colorbox-min.js",
    "sjsxc/js/jsxc/lib/jquery.slimscroll.js",
    "sjsxc/js/jsxc/lib/jquery.fullscreen.js",
    "sjsxc/js/jsxc/lib/strophe.js",
    "sjsxc/js/jsxc/lib/strophe.muc.js",
    "sjsxc/js/jsxc/lib/strophe.disco.js",
    "sjsxc/js/jsxc/lib/strophe.caps.js",
    "sjsxc/js/jsxc/lib/strophe.vcard.js",
    "sjsxc/js/jsxc/lib/strophe.jingle/strophe.jingle.js",
    "sjsxc/js/jsxc/lib/strophe.jingle/strophe.jingle.session.js",
    "sjsxc/js/jsxc/lib/strophe.jingle/strophe.jingle.sdp.js",
    "sjsxc/js/jsxc/lib/strophe.jingle/strophe.jingle.adapter.js",
    "sjsxc/js/jsxc/lib/otr/build/dep/salsa20.js",
    "sjsxc/js/jsxc/lib/otr/build/dep/bigint.js",
    "sjsxc/js/jsxc/lib/otr/build/dep/crypto.js",
    "sjsxc/js/jsxc/lib/otr/build/dep/eventemitter.js",
    "sjsxc/js/jsxc/lib/otr/build/otr.js",
    "sjsxc/js/jsxc/jsxc.lib.js",
    "sjsxc/js/jsxc/jsxc.lib.webrtc.js",
    "sjsxc/js/sjsxc.config.js",
    "sjsxc/js/sjsxc.js"
)'
```

### Restart sogo service
```
sudo service sogo restart
```
