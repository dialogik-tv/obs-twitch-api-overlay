var data = { 
    "Follower": null,
    "Letzter Follower": null,
    "Subscriber": null,
    "Letzter Sub": null
};
var fetched = false;
var i = 0;

(function() {
    // Twitch API Client ID and dialogikTV channel ID
    const clientId = 'mn01zj33eftqrsn760lac2l7nwnrls';
    const channelId = '265345534';

    // Twitch.js
    const { api } = new TwitchJs({ clientId });

    // Check if user comes from twitch authentication
    if(window.location.hash !== '') {
        // Remove twitch connect link
        const twitchConnector = document.getElementById('twitch-connector');
        twitchConnector.parentNode.removeChild(twitchConnector);

        // Extract token
        var hash = window.location.hash.split('#')[1].split('&')[0].split('=');
        var token = null;
        if(hash[0] == 'access_token') {
            var token = hash[1];

            // Remove token from URL
            history.pushState("", document.title, window.location.pathname);

            // Fetch username for full chat authability
            const { api } = new window.TwitchJs({ token, clientId });

            fetchApi(channelId, api);
            setInterval(function() {
                fetchApi(channelId, api);
            }, 60000); // 60 seconds

            const labelDescription = document.getElementById('label-description');
            const labelValue = document.getElementById('label-value');

            setInterval(function() {
                if(fetched) {
                    const label = document.getElementById('label');

                    const temp = Object.entries(data);
                    labelDescription.innerText = temp[i][0];
                    labelValue.innerText = temp[i][1];

                    label.classList.add('visible');
                    setTimeout(function() {
                        label.classList.remove('visible');
                        i++;
                        if(i > 3) {
                            i = 0;
                        }
                    }, 10000);
                }
            }, 60000);
        }
    }
})();

function fetchApi(channelId, api) {
    // Get channel follows
    api.get(`users/follows?to_id=${channelId}`).then(response => {
        data["Follower"]  = response.total;
        data["Letzter Follower"] = response.data[0].fromName;
        
        api.get(`channels/${channelId}/subscriptions?direction=desc&limit=1`, { version: 'kraken' }).then(response => {
            data["Subscriber"] = response.total;
            data["Letzter Sub"] = response.subscriptions[0].user.displayName;

            fetched = true;
        });
    });
}