window.emoteMapping = window.emoteMapping || {};

document.addEventListener('DOMContentLoaded', function () {
    load7TV('https://7tv.io/v3/emote-sets/global')
    .then(data => {
        updateEmoteMapping(data);
    })
    load7TV('https://7tv.io/v3/users/twitch/747734304')
    .then(data => {
        updateEmoteMapping(data.emote_set);
    })
});

function load7TV(url) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
}

function updateEmoteMapping(data) {
    data.emotes.forEach(emote => {
        const emoteName = emote.data.name;
        const emoteUrl = "https:" + emote.data.host.url + "/1x.avif";
        console.log("[7tv] load: " + emoteName + ",  " + emoteUrl)
        window.emoteMapping[emoteName] = emoteUrl;
    });
}

window.replaceEmotesWithImages = function replaceEmotesWithImages(message) {
    return message.replace(/\b(\w+)\b/g, (match, emoteName) => {
        if (emoteMapping.hasOwnProperty(emoteName)) {
            return `<img src="${emoteMapping[emoteName]}" alt="${emoteName}">`;
        } else {
            return match;
        }
    });
}
