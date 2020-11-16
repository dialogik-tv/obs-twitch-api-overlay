(function() {
    const clientId = 'j8h3bcpwhkekt4wcwd0p4rydxefff4';
    const channelId = '265345534';
    // const channel = 'dialogikTV';

    const { api } = new TwitchJs({ clientId });

    const latestFollower = document.getElementById('latest-follower');
    const followerCount  = document.getElementById('follower-count');

    // channels/<channel ID>/follows

    // Get featured streams.
    api.get(`channels/${channelId}/follows`, { version: 'kraken' }).then(response => {
        console.log('response', response);
        followerCount.innerText  = response.total;
        latestFollower.innerText = response.follows[0].user.displayName;
        // Do stuff ...
    });
})();