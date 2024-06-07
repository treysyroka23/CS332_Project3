"use strict"; 

window.addEventListener("load", async () =>{
    const container = document.querySelector("#notifications"); 
     
    const response = await fetch(`../api/statuses/activity.json`); 

    const data = await response.json();
            
        if(response.ok) {
            addNotifications(data); 
        }
});

/**
 * This function makes api call
 * @param {*} url request path
 * @returns response
 */
async function makeApiCall(url){
    const response = await fetch(url); 
    const data = await response.json();
    return data;
}

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
  
    
  

/**
 * This function handles notification parsing and 
 * renders the notification on the web page
 * @param {*} data 
 */
function addNotifications(data){ 
    const container =  document.querySelector("#notifications"); 
    // write some code to see if they reslimed 
    // maybe have a dict of prospective items and their color 

    const reslimedstatus = function(element) {

        if (element.hasOwnProperty('reslimed_status')){
            return  { 
                        icon : `<i class="bi bi-recycle h1" style=" color: green "></i>`, 
                        text: "reslimed you"
                    } ;
        }
        
        return { 
                    icon : `<i class="bi bi-chat-right-fill h1" style="color : #7DF9FF"></i>`, 
                    text: "replied to you"
                };
    }; 

    data.forEach((element) =>{
        const stat = reslimedstatus(element); 
        const notification = document.createElement("div"); 
        notification.setAttribute("class", "row py-2 border-bottom");
        notification.innerHTML=`
            <div class ="col-1">
                ${stat.icon}
            </div>
            <div class=col-11> 
                <div class="card" style="border-width: 0">
                        <img src="${"../" +element.user.profile_image_url}" class="card-img-top img-thumbnail border rounded mx-3 mt-2" alt="User avatar" style="width: 10%; height :20%">
                        <div class="card-body">
                            <strong> <a href="profile.html?user=${element.user.screen_name}" style="color : black ; text-decoration: none;">${element.user.name} </a></strong> ${stat.text}
                            <p class="card-text">${getText(element)}</p>
                        </div>
                </div>
            </div>
            `;
            container.appendChild(notification); 
    }); 
}   

// References 
//https://www.w3schools.com/jsref/jsref_replace.asp
//https://stackoverflow.com/questions/68690519/how-to-get-all-the-values-inside-json-with-a-common-name


