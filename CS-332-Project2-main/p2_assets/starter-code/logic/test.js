
async function makeApiCall(url){
  const response = await fetch(url); 
  const data = await response.json();
  return data;
}
// going to store the data
const JSONFile = makeApiCall(`../api/statuses/show/611fcaf640148d94e2a469c7.json`);
console.log(JSONFile);
generateCards(JSONFile);


function generateReplyCards(data){
  const container = document.querySelector("#reply");
      data.then(data => {
        data.forEach(data => {
          console.log(data.user.profile_image_url);
          console.log(data);


        const ReplyCard = document.createElement("div");

        let username_dict = {
          "@KevinAAngstadt" : "Kevin Angstadt",
          "@ed" : "Ed Harcourt",
          "@choongsool" : "Choong-Soo Lee",
          "@ltorrey" : "Lisa Torrey",
        };


        //TODO ask kevin about this date stuff
      trueDate = getTrueDate(data.created_at)
   
      // preprocess and make some variable names

        let cardType = `
        <!-- image -->
        <div class="row container-fluid d-flex">
          <div class="card col-6" style="border-width: 0">
            <img
            class="card-img-top img-thumbnail img-fluid border rounded"
            src="${"../" + data.user.profile_image_url}"
            alt="${data.user.name}"
            ></img>

        </div>
            `
        if(data.reslimed_status != undefined){
        cardType = `
        <div class="container-fluid p-2">
        <div class="card container-fluid d-flex justify-content-start" style="max-width: 630px;">
          <header class="pt-2 ps-5" style="align-items: flex-start; font-weight: bold;">
            <small class="text-muted">
              <span class="me-2"><i class="bi bi-recycle"></i></span>
              ${data.user.name} reslimed
            </small>
          </header>
          <div class="row align-items-center">
            <div class="col-2 pb-4 ps-3 thumbnail-container p-2">
              <img src="${"../" + data.user.profile_image_url}" class="img-thumbnail smaller-image" alt="${data.reslimed_status.user.display_name}">
          `
        }
        if(data.in_reply_to_user_id_str != undefined){
          cardType= `
          <div class="container p-2">
          <div class="card container-fluid d-flex justify-content-start">
            <header class="pt-2 ps-5" style="align-items: flex-start; font-weight: bold;">
              <small class="text-muted">
                <span class="me-2"><i class="bi bi-chat-right-fill"></i></span>
                ${data.user.name} replied to ${username_dict[data.entities.user_mentions]}
              </small>
            </header>
            <div class="row align-items-center">
              <div class="col-md-2 pb-4 ps-3 thumbnail-container p-2">
                <img src="${"../" + data.user.profile_image_url}" class="img-thumbnail smaller-image" alt=${data.display_name}>
          `
       }
       let favorited = `
        <i class="bi bi-heart"></i>
        <span>${data.reslimed_status === undefined ? data.favorite_count : data.reslimed_status.favorite_count}</span>
      `

      if(data.favorited){
        favorited = `
          <i class="bi bi-heart-fill" style="color:red;"></i>
          <span style="color: red;">${data.reslimed_status === undefined ? data.favorite_count : data.reslimed_status.favorite_count}</span>
        `
      }

      let reslimed = `
        <i class="bi bi-recycle"></i>
        <span>${data.reslimed_status === undefined ? data.reslime_count : data.reslimed_status.reslime_count}</span>
      `
      if(data.reslimed){
        reslimed = `
          <i class="bi bi-recycle" style="color:green;"></i>
          <span style="color: green;">${data.reslimed_status === undefined ? data.reslime_count : data.reslimed_status.reslime_count}</span>
        `
      }
      ReplyCard.innerHTML = 
        cardType + 
        `
          </div>
          <div class="col-9">
            <div class="card-body">
              <h6 class="card-title text-bold"><a href = "profile.html?user=${data.reslimed_status === undefined ? data.user.screen_name : data.reslimed_status.user.screen_name}"
                  style="text-decoration: none; color: black;">${data.reslimed_status === undefined ? data.user.name : data.reslimed_status.user.name}</a><small class="text-muted"> ${data.reslimed_status === undefined ? data.user.screen_name : data.reslimed_status.user.screen_name} ·
                  ${trueDate}</small></h6>
              <p class="card-text">${getText(data)}</p>
              <div class="row">
                <div class="col-3" style="list-style: none;">
                  <small class="text-muted">
                    <i class="bi bi-chat-right"></i>
                    <span>${data.reslimed_status === undefined ? data.reply_count : data.reslimed_status.reply_count}</span>
                  </small>
                </div>
                <div class="col-3" style="list-style: none;">
                  <small class="text-muted">
                    ` + reslimed + `
                  </small>
                </div>
                <div class="col-3" style="list-style: none;">
                  <small class="text-muted">
                    ` + favorited + `
                  </small>
                </div>
                <div class="col-3" style="list-style: none;">
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
      container.appendChild(ReplyCard);
    })
  })
       
       
  }

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

  function getTime(date) {
    let tempDate = new Date(date);
    let returnDate = tempDate.getUTCHours() -5 + ":" + tempDate.getUTCMinutes();
    if(tempDate.getUTCHours() > 12) {
      return returnDate += " AM"
    }
    else {
      return returnDate += " PM"
    }
  }


function generateCards(data){
  // grab where to place cards from HTML
  const cardList = document.querySelector("#main-slime-trail"); 

    data.then(data =>{

      const card = document.createElement("div");
      let username_dict = {
        "@KevinAAngstadt" : "Kevin Angstadt",
        "@ed" : "Ed Harcourt",
        "@choongsool" : "Choong-Soo Lee",
        "@ltorrey" : "Lisa Torrey",
      };


      let cardType = `
    <!-- First Card -->
      <div class="main-body pt-4">
        <!-- First Card -->
        <div class="border rounded pt-4">
          <!-- top line -->
          <div class="row container-fluid d-flex">
                <div class="card col-2" style="border-width: 0">
                  <img
                  class="card-img-top img-thumbnail img-fluid border rounded"
                  src="${"../" + data.user.profile_image_url}"
                  alt="${data.user.name}"
                  ></img>

                </div>
                `

    if(data.reslimed_status != undefined){
      cardType = `
      <div class="container p-2">
      <div class="card container-fluid d-flex justify-content-start">
        <header class="pt-2 ps-5" style="align-items: flex-start; font-weight: bold;">
          <small class="text-muted">
            <span class="me-2"><i class="bi bi-recycle"></i></span>
            ${data.user.name} reslimed
          </small>
        </header>
        <div class="row align-items-center">
          <div class="col-md-8 pb-4 ps-3 thumbnail-container p-2">
            <img src="${"../" + data.reslimed_status.user.profile_image_url}" class="img-thumbnail smaller-image" alt="${data.reslimed_status.user.display_name}">
        `
      }
      if(data.in_reply_to_user_id_str != undefined){
        cardType= `
        <div class="container p-2">
        <div class="card container-fluid d-flex justify-content-start" style="max-width: 630px;">
          <header class="pt-2 ps-5" style="align-items: flex-start; font-weight: bold;">
            <small class="text-muted">
              <span class="me-2"><i class="bi bi-chat-right-fill"></i></span>
              ${data.user.name} replied to ${username_dict[data.entities.user_mentions]}
            </small>
          </header>
          <div class="row align-items-center">
            <div class="col-md-2 pb-4 ps-3 thumbnail-container p-2">
              <img src="${"../" + data.user.profile_image_url}" class="img-thumbnail smaller-image" alt=${data.user.display_name}>
        `
     }
     let favorited = `
     <i class="bi bi-heart"></i>
     <span>${data.reslimed_status === undefined ? data.favorite_count : data.reslimed_status.favorite_count}</span>
      `

   if(data.favorited){
     favorited = `
       <i class="bi bi-heart-fill" style="color:red;"></i>
       <span style="color: red;">${data.reslimed_status === undefined ? data.favorite_count : data.reslimed_status.favorite_count}</span>
     `
   }

   let reslimed = `
     <i class="bi bi-recycle"></i>
     <span>${data.reslimed_status === undefined ? data.reslime_count : data.reslimed_status.reslime_count}</span>
   `
   if(data.reslimed){
     reslimed = `
       <i class="bi bi-recycle" style="color:green;"></i>
       <span style="color: green;">${data.reslimed_status === undefined ? data.reslime_count : data.reslimed_status.reslime_count}</span>
     `
   }
   card.innerHTML = 
        cardType + 
        `
         
            <div class="col-1 card-body">
                <!-- title, @, date -->
                <h4 
                    class="card-title"
                   
                > <a href = "profile.html?user=${data.reslimed_status === undefined ? data.user.screen_name : data.reslimed_status.user.screen_name}"
                style="text-decoration: none; color: black;">
                    ${data.reslimed_status === undefined ? data.user.name : data.reslimed_status.user.name} </a>
                </h4>

                <!-- slime text -->
                <h6 class="card-subtitle text-muted"> ${data.reslimed_status === undefined ? data.user.screen_name : data.reslimed_status.user.screen_name}</h6>
              </div>
      </div>
      <div class="row container-fluid d-flex">
          <span class="fw-medium fs-5 pt-4">
              ${getText(data)}</a>
          </span>
      </div>
      <!-- buttons -->
      <div class="row container-fluid d-flex">
          <span class="card-subtitle text-muted col-10 pt-3">
            ${getTime(data.created_at)} · ${getTrueDate(data.created_at)} 
          </span>
          <!--buttons-->

              <div class="row container-fluid d-flex pt-2">
              <hr width="70%">
                <div class="col-3 pb-3" style="list-style: none;">
                  <small class="text-muted">
                    <i class="bi bi-chat-right"></i>
                    <span>${data.reslimed_status === undefined ? data.reply_count : data.reslimed_status.reply_count}</span>
                  </small>
                </div>
                <div class="col-3" style="list-style: none;">
                  <small class="text-muted">
                    ` + reslimed + `
                  </small>
                </div>
                <div class="col-3" style="list-style: none;">
                  <small class="text-muted">
                    ` + favorited + `
                  </small>
                </div>
                <div class="col-3" style="list-style: none;">
                  <small class="text-muted">
                    <i class="bi bi-upload"></i>
                  </small>
               
                </div>
              </hr>
            </div>
          </div>
        </div>
      </div>
    </div>
          </hr>
        <!--end of button div-->
        </div>
        <!--end of first card div-->    
        </div>
         
        `
    cardList.appendChild(card);
    const ReplyFile = makeApiCall(`../api/statuses/replies/${data._id}.json`);
    console.log(ReplyFile);
    generateReplyCards(ReplyFile);
    // TODO: make it so that it finds the file with a matching id in the replies
    // folder so that there's content it generates the card
  }
)}

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
          const profileLink = `a href = "profile.html?user=${mention}" style="color:$blue;">${mention}</a>`;
          item.reslimed_status.text = item.reslimed_status.text.replace(mention, profileLink);
      });
      
  }
  return item.reslimed_status.text;
}



  // Refrences
  // https://stackoverflow.com/questions/73359274/syntaxerror-unexpected-token-doctype-is-not-valid-json
  // https://stackoverflow.com/questions/62222954/add-directory-contents-to-the-array-as-an-object

  // Once all the files are fetched and processed, you can work with the `jsonFiles` array