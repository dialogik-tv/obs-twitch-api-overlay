(function() {
    // Twitch API Client ID and dialogikTV channel ID
    const clientId = 'q9tlaburg1o21xbsm7upiacg4wgv2a';
    const channelId = '265345534';

    // Twitch.js
    const { api } = new TwitchJs({ clientId });

    // Content elements
    const latestFollower = document.getElementById('latest-follower');
    const followerCount  = document.getElementById('follower-count');

    const latestSub = document.getElementById('latest-sub');
    const subCount  = document.getElementById('sub-count');

    // Check if user comes from twitch authentication
    if(window.location.hash !== '') {
        // Remove twitch connect link
        const twitchConnector = document.getElementById('twitch-connector');
        twitchConnector.parentNode.removeChild(twitchConnector);;

        // Extract token
        var hash = window.location.hash.split('#')[1].split('&')[0].split('=');
        var token = null;
        if(hash[0] == 'access_token') {
            var token = hash[1];

            // Remove token from URL
            history.pushState("", document.title, window.location.pathname);

            // Fetch username for full chat authability
            const { api } = new window.TwitchJs({ token, clientId });

            fetchApi(channelId, api, followerCount, latestFollower, subCount, latestSub);
            setInterval(function() {
                fetchApi(channelId, api, followerCount, latestFollower, subCount, latestSub);
            }, 6000);
        }
    }
})();

function fetchApi(channelId, api, followerCount, latestFollower, subCount, latestSub) {
    // Get channel follows
    api.get(`users/follows?to_id=${channelId}`).then(response => {
        followerCount.innerText  = response.total;
        latestFollower.innerText = response.data[0].fromName;
        
        api.get(`subscriptions?broadcaster_id=${channelId}`).then(response => {
            subCount.innerText  = response.data.length - 1;
            latestSub.innerText = response.data[0].userName;
        });
    });
}