const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  
// Twitch API Client ID and dialogikTV channel ID
const username = window.username || 'dialogikTV'
const subFolder = window.subFolder ?? 'obs-twitch-api-overlay/'
const clientId = window.clientId || 'mn01zj33eftqrsn760lac2l7nwnrls';
const channelId = window.channelId || '265345534';

const twitchConnector = document.createElement('a');
twitchConnector.id = 'twitchConnector'
twitchConnector.href = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${window.location.href}&response_type=token&scope=channel_subscriptions`
twitchConnector.innerText = 'Twitch Connector'

//const queryString = window.location.search;
//const searchParams = new URLSearchParams(queryString)
const hashString = window.location.hash;
const hashParams = new URLSearchParams(hashString.replace("#","?"));
// Extract token var hash = window.location.hash.split('#')[1].split('&')[0].split('=');
const token = hashParams.get('access_token');

const createLabel = async (description,value) => {
    const label = document.createElement('div');
    label.style.setProperty('position','relative');
    label.style.setProperty('left','0');
    label.style.setProperty('top','100px');
    label.style.setProperty('width','auto');
    label.style.setProperty('max-width','420px');
    label.style.setProperty('background-color','rgba(200, 200, 200, .2)');
    label.style.setProperty('padding','20px');
    label.style.setProperty('color','#c3c3c3');
    label.style.setProperty('margin-left','-420px');
    label.style.setProperty('transition','margin-left 300ms ease-in-out');
    
    const labelDescription = document.createElement('span');
    labelDescription.innerText = description;
    
    const labelValue = document.createElement('span');
    labelValue.innerText = value;
    labelValue.style.setProperty('color','#fff');
    labelValue.style.setProperty('margin-left','6px');
    label.append(labelDescription)
    label.append(labelValue)
    
    document.body.append(label)
    label.style.setProperty('margin-left','0px')
    
    return delay(15000)
        .then(() => label.style.setProperty('margin-left','-420px'))
        .then(() => label.parentNode.removeChild(label))
}

const init = async () => {
    // Fetch username for full chat authability
    const { api } = new window.TwitchJs({ token, clientId });
    const channelId = (username.length > 0) ? await api.get(`users?login=${username}`).then(r=>r.data[0].id) : channelId;
    
    const followersPromise = () => api.get(`users/follows?to_id=${channelId}`).then(response => {
        return {
            follower: response.total,
            last_follower: response.data[0]?.fromName
        }           
    });

    const subscribersPromise = () => api.get(`channels/${channelId}/subscriptions?direction=desc&limit=1`, { version: 'kraken' }).then(response => {
        return {
            subscriber: response.total,
            last_subscriber: response.subscriptions[0]?.user.displayName
        }            
    }).catch(x=>console.log(x));

    const sequencePromise = () =>{
        followersPromise()
            .then(data =>       
                createLabel('Follower:',data.follower)
                    .then(()=>createLabel('Latest Follower:', data.last_follower))
            )
            .then(() => 
                subscribersPromise()
                    .then(data=>{
                        return createLabel('Subscribers:', data.subscriber)
                            .then(()=>createLabel('Last Subscriber:', data.last_subscriber));
                    }).then(()=>{
                        //restart 
                        sequencePromise()
                    })    
            );
                   
        //delay(60000).then(sequencePromise);
    };
    sequencePromise();
}
// Check if user comes from twitch authentication
if (token) {
    // Remove token from URL
    history.pushState("", document.title, window.location.pathname);
    init();
    
} else {
    //show it and click it
    document.body.append(twitchConnector)
    //delay(2000).then(()=> twitchConnector.click());
}