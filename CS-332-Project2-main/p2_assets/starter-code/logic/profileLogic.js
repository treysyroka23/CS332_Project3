// we need to determine whose profile we are generating
const urlParams = new URLSearchParams(window.location.search);
let user = urlParams.get('user');

if(user == null || undefined){
  user = "@kevinaangstadt"
}

//chop off the @ for json structure
user = user.slice(1)

    // make our fetch calls depending on the user

    //generate the users profile datta
    const p1 = fetch(`../api/user/get/${user}.json`);
    p1.then(response => response.json()).then(data => generateProfiles(data));

    //generate the users slimes
    const userSlimes = fetch(`../api/statuses/user_timeline/${user}.json`);
    userSlimes.then(response => response.json()).then(data => filterSlimes(data,"#slimes"));

    //generate the users favorites
    const userFavorites = fetch(`../api/favorites/${user}.json`);
    userFavorites.then(response => response.json()).then(data => preProcessFavorites(data,"#favorites"));

    //generate the users slimes and replies
    const userSlimesAndReplies = fetch(`../api/statuses/user_timeline/${user}.json`);
    userSlimesAndReplies.then(response => response.json()).then(data => generateCards(data,"#slimesAndReplies"));

    /**
 * Extracts the text from JSON and formats the text accoriding
 * @param {*} item Json Object
 * @returns formatted text 
 */
    function getText(item){
      if(item.hasOwnProperty("text")){
          if((item.entities.hashtags).length >0 ){
              item.entities.hashtags.forEach(hashtag => {
                  const hashtagLink = `<a href="slime.html" style="color:$blue;">${hashtag}</a>`;
                  item.text = item.text.replace(hashtag, hashtagLink);
              });
              
          }
          if((item.entities.user_mentions).length >0 ){
              item.entities.user_mentions.forEach(mention => {
                  const profileLink = `<a href = "profile.html?user=${mention}" style="color:$blue;">${mention}</a>`;
                  item.text = item.text.replace(mention, profileLink);
              });
              
          }
          return item.text; 
      }
      if((item.reslimed_status.entities.hashtags).length > 0 ){
          item.reslimed_status.entities.hashtags.forEach(hashtag => {
              const hashtagLink = `<a href="slime.html" style="color:$blue;">${hashtag}</a>`;
              item.reslimed_status.text = item.reslimed_status.text.replace(hashtag, hashtagLink);
          });
          
      }
      if((item.reslimed_status.entities.user_mentions).length > 0 ){
          item.reslimed_status.entities.user_mentions.forEach(mention => {
              const profileLink = `<a href = "profile.html?user=${mention}" style="color:$blue;">${mention}</a>`;
              item.reslimed_status.text = item.reslimed_status.text.replace(mention, profileLink);
          });
          
      }
      return item.reslimed_status.text;
    }

// this is where we do the actual generation of profile pages
function generateProfiles(data){
    const mainProfile = document.querySelector("#mainProfile");
    const profileData = document.createElement("div");

    if(data.description === null) {
        data.description = "";
    }

    //fill in html based on json data
    profileData.innerHTML=`
            <div class="container row mt-5 pt-5">
                <div class="col-4">
                    <div id="pic"></div><img src = "${"../" + data.profile_image_url}" class="img-thumbnail">  
                </div>
                <div class="col-8">
                    <div class="mb-3">
                        <h1 id="profileName">${data.name}</h1>
                    <span class="text-muted lead">${data.screen_name}</span>
                    </div>
                    
                    <p class="mb-3" id="description">
                        ${data.description}
                    </p>
    
                    <div class="text-muted" id="whenJoined">
                        <i class="bi bi-calendar3"></i> Joined ${getTrueDate(data.created)}
                    </div>
                    <div class="text-muted">
                        <span class="me-3" id="Following"> ${data.friends_count} Following</span>
                        <span class="me-3" id="Followers"> ${data.followers_count} Followers</span>
                    </div>
                </div>
            </div>
    `
    mainProfile.appendChild(profileData);
    
};

//function to return date in format we want
function getTrueDate(date){
  let tempDate = new Date(date);
      let monthDate = tempDate.getMonth()
      let monthDict = {
        0: 'January',
        1: 'February',
        2: 'March',
        3: 'April',
        4: 'May',
        5: 'June',
        6: 'July',
        7: 'August',
        8: 'September',
        9: 'October',
        10: 'November',
        11: 'December'
      }
      return monthDict[monthDate] + " " +  tempDate.getDate();
}

// here we have to manipulate favorites before we can generate the cards for it
function preProcessFavorites(data, identifier) {

   let username_dict = {
      "kevinaangstadt" : "Kevin Angstadt",
      "ed" : "Ed Harcourt",
      "choongsool" : "Choong-Soo Lee",
      "ltorrey" : "Lisa Torrey",
  };



    
    data.forEach((item) => {
      // we have to add the favorited property to get red hearts
        item.favorited = true;
        //favorited has usernames in the wrong format so we run them through the dict
        item.user.name = username_dict[item.user.name]
    })

    //its sorted in the wrong order by default so we do an inverse sort
    data.sort((a,b) => {
        if(a.created_at > b.created_at) {
            return -1;
        }
    });

    // check to see if they have no favorites
    if(data.length < 1) {
        const cardList = document.querySelector(identifier);
        const card = document.createElement("div");

        card.innerHTML = `
        <h4 class = "text-center text-muted p-4"> ${user} has no favorites </h4>
        `
        cardList.appendChild(card);
    } else {
      // finally we can generate the cards
        generateCards(data,identifier);
    }
}


// we need to remove any replies from a users slimes
function filterSlimes(data,identifier){
    const filtered_data = data.filter((item) => {
    return item.in_reply_to_user_id_str === undefined })
    generateCards(filtered_data,identifier);
}

//actual card generation
function generateCards(data,identifier){
  //grab where we will be adding to
  const cardList = document.querySelector(identifier);

 // lets loop through each card
  data.forEach((item) => {
    const card = document.createElement("div");

    let username_dict = {
        "@KevinAAngstadt" : "Kevin Angstadt",
        "@ed" : "Ed Harcourt",
        "@choongsool" : "Choong-Soo Lee",
        "@ltorrey" : "Lisa Torrey",
  };
  
    let trueDate = getTrueDate(item.created_at)

    // we use cardType as our base since all cards have this
    let cardType = `
    <div class="container p-2">
    <div class="card container-fluid d-flex justify-content-start" style="max-width: 630px;">
      <div class="row">
        <div class="col-md-2 pb-4 pt-4 ps-3 thumbnail-container p-2">
          <img src="${"../" + item.user.profile_image_url}" class="img-thumbnail smaller-image" alt="${item.display_name}">
    `
    //now we check if it's a reslime to add necessary styling
    if(item.reslimed_status != undefined){
      cardType = `
      <div class="container p-2">
      <div class="card container-fluid d-flex justify-content-start" style="max-width: 630px;">
        <header class="pt-2 ps-5" style="align-items: flex-start; font-weight: bold;">
          <small class="text-muted">
            <span class="me-2"><i class="bi bi-recycle"></i></span>
            ${item.user.name} reslimed
          </small>
        </header>
        <div class="row align-items-center">
          <div class="col-md-2 pb-4 ps-3 thumbnail-container p-2">
            <img src="${"../" + item.reslimed_status.user.profile_image_url}" class="img-thumbnail smaller-image" alt="${item.reslimed_status.user.display_name}">
        `
    }

    //check if its a reply to add necessary styling
    if(item.in_reply_to_user_id_str != undefined){
       cardType= `
       <div class="container p-2">
       <div class="card container-fluid d-flex justify-content-start" style="max-width: 630px;">
         <header class="pt-2 ps-5" style="align-items: flex-start; font-weight: bold;">
           <small class="text-muted">
             <span class="me-2"><i class="bi bi-chat-right-fill"></i></span>
             ${item.reslimed_status === undefined ? item.user.name : item.reslimed_status.user.name} replied to ${username_dict[item.entities.user_mentions]}
           </small>
         </header>
         <div class="row align-items-center">
           <div class="col-md-2 pb-4 ps-3 thumbnail-container p-2">
             <img src="${"../" + item.user.profile_image_url}" class="img-thumbnail smaller-image" alt=${item.user.display_name}>
       `
    }

    // here we build out favorited and reslime 
    // we have two options since it might differ if the card has been favorited or reslimed
    let favorited = `
      <i class="bi bi-heart"></i>
      <span>${item.reslimed_status === undefined ? item.favorite_count : item.reslimed_status.favorite_count}</span>
    `

    if(item.favorited){
      favorited = `
        <i class="bi bi-heart-fill" style="color:red;"></i>
        <span style="color: red;">${item.reslimed_status === undefined ? item.favorite_count : item.reslimed_status.favorite_count}</span>
      `
    }

    let reslimed = `
      <i class="bi bi-recycle"></i>
      <span>${item.reslimed_status === undefined ? item.reslime_count : item.reslimed_status.reslime_count}</span>
    `
    if(item.reslimed){
      reslimed = `
        <i class="bi bi-recycle" style="color:green;"></i>
        <span style="color: green;">${item.reslimed_status === undefined ? item.reslime_count : item.reslimed_status.reslime_count}</span>
      `
    }
   
    card.innerHTML = 
      cardType + 
      `
        </div>
        <div class="col-md-9">
          <div class="card-body">
            <h6 class="card-title text-bold"><a href = "profile.html?user=${item.reslimed_status === undefined ? item.user.screen_name : item.reslimed_status.user.screen_name}"
                style="text-decoration: none; color: black;">${item.reslimed_status === undefined ? item.user.name : item.reslimed_status.user.name}</a><small class="text-muted"> ${item.reslimed_status === undefined ? item.user.screen_name : item.reslimed_status.user.screen_name} ·
                ${trueDate}</small></h6>
                <p class="card-text">${getText(item)}</p>
            <div class="row">
              <div class="col-md-3" style="list-style: none;">
                <small class="text-muted">
                  <i class="bi bi-chat-right"></i>
                  <span>${item.reslimed_status === undefined ? item.reply_count : item.reslimed_status.reply_count}</span>
                </small>
              </div>
              <div class="col-md-3" style="list-style: none;">
                <small class="text-muted">
                  ` + reslimed + `
                </small>
              </div>
              <div class="col-md-3" style="list-style: none;">
                <small class="text-muted">
                  ` + favorited + `
                </small>
              </div>
              <div class="col-md-3" style="list-style: none;">
                <small class="text-muted">
                  <i class="bi bi-upload"></i>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
    `
    cardList.appendChild(card);
  })

}



