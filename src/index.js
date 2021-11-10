/**
 * Using Subsonic's REST API, get information about the currently playing
 * song and update the web page.
 *
 * */

function RESTLookups() {

    // variables
    const username = 'YOUR_SUBSONIC_USERNAME';
    const password = 'YOUR_SUBSONIC_PASSWORD';
    const server = 'YOUR_SUBSONIC_SERVER:PORT';
    const songTitle = document.getElementById('song-title');
    const artwork = document.getElementById('artwork');
    let id = null;
    let title = '. . .';

    fetch(`http://${server}/rest/getNowPlaying?u=${username}&p=${password}&v=1.12.0&c=now_playing`).then(function (response) {
        response.text().then(function(data) {

            // Create a DOMParser
            const parser = new DOMParser();
            // Use it to turn the xmlString into an XMLDocument
            const xmlDoc = parser.parseFromString(data, "application/xml");
            const json = xmlToJson(xmlDoc);

            // get song ID if it exists in the appropriate JSON node
            if (json["subsonic-response"] && json["subsonic-response"]["nowPlaying"] && json["subsonic-response"]["nowPlaying"]["entry"] && json["subsonic-response"]["nowPlaying"]["entry"]["@attributes"] && json["subsonic-response"]["nowPlaying"]["entry"]["@attributes"]["id"]) {
                id = json["subsonic-response"]["nowPlaying"]["entry"]["@attributes"]["id"];
            }

            // get song title if it exists in the appropriate JSON node
            if (json["subsonic-response"] && json["subsonic-response"]["nowPlaying"] && json["subsonic-response"]["nowPlaying"]["entry"] && json["subsonic-response"]["nowPlaying"]["entry"]["@attributes"] && json["subsonic-response"]["nowPlaying"]["entry"]["@attributes"]["title"]) {
                title = json["subsonic-response"]["nowPlaying"]["entry"]["@attributes"]["title"];
            }

            // change songTitle in HTML
            songTitle.innerHTML = title;

            // new request for cover art; use song ID from above
            // also changes img src directly
            if (id !== null) {

                fetch(`http://${server}/rest/getCoverArt?u=${username}&p=${password}&v=1.12.0&c=now_playing&size=1024&id=${id}`).then(function (response) {
                    return response.blob();
                }).then(function (artworkBlob) {
                    artwork.src = URL.createObjectURL(artworkBlob);
                });

            }

        });
    });

}

// call every 8 secs.
setInterval(function () {
    RESTLookups();
}, 8000);

// Utility function to change XML to JSON
function xmlToJson(xml) {

    // Create the return object
    let obj = {};

    if (xml.nodeType === 1) { // element
        // do attributes
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (let j = 0; j < xml.attributes.length; j++) {
                let attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType === 3) { // text
        obj = xml.nodeValue;
    }

    // do children
    if (xml.hasChildNodes()) {
        for (let i = 0; i < xml.childNodes.length; i++) {
            let item = xml.childNodes.item(i);
            let nodeName = item.nodeName;
            if (typeof (obj[nodeName]) == "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (typeof (obj[nodeName].push) == "undefined") {
                    let old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    }
    return obj;
}
