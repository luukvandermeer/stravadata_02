 https://www.strava.com/api/v3/activities?access_token=5205be1dd89891a70f68843b837c6b3ec7f090d7

function getActivities(){
  const activities_link =  "https://www.strava.com/api/v3/athlete/activities?access_token=7300a4fe867fcaf8ed02376397dd5ef37ad45f34 "
  fetch(activities_link)
    .then((res) => console.log(res.json()))
}
getActivities()
