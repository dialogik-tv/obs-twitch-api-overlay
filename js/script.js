(function() {
    // Twitch API Client ID and dialogikTV channel ID
    const clientId = 'j8h3bcpwhkekt4wcwd0p4rydxefff4';
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
        // Extract token
        var hash = window.location.hash.split('#')[1].split('&')[0].split('=');
        var token = null;
        if(hash[0] == 'access_token') {
            var token = hash[1];

            // Fetch username for full chat authability
            const { api } = new window.TwitchJs({ token, clientId });

            // Get channel follows
            api.get(`users/follows?to_id=${channelId}`).then(response => {
                followerCount.innerText  = response.total;
                latestFollower.innerText = response.data[0].fromName;

                api.get(`subscriptions?broadcaster_id=${channelId}`).then(response => {
                    console.log(response);
                    subCount.innerText  = response.data.length - 1;
                    latestSub.innerText = response.data[0].userName;
                });
            });
        }
    }
})();
