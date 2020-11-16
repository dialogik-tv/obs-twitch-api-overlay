(function() {
    // Twitch API Client ID and dialogikTV channel ID
    const clientId = 'j8h3bcpwhkekt4wcwd0p4rydxefff4';
    const channelId = '265345534';

    // Twitch.js
    const { api } = new TwitchJs({ clientId });

    // Content elements
    const latestFollower = document.getElementById('latest-follower');
    const followerCount  = document.getElementById('follower-count');

    // Get channel follows
    api.get(`channels/${channelId}/follows`, { version: 'kraken' }).then(response => {
        followerCount.innerText  = response.total;
        latestFollower.innerText = response.follows[0].user.displayName;
    });
})();