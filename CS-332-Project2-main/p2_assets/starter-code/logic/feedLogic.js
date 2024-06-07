"use strict";

window.addEventListener("load",  async () => {
   
   
    const p1 = fetch("../api/statuses/home_timeline.json");
    const p2 = p1.then(response => response.json());
    const p3 = p2.then(data => generateCards(data,"#cardList"));


});

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