//alert("fd")


function deleteCredentialForm(id){
    form = document.getElementById(id)
    if (form.style.display == "none"){
        form.style.display = "block";
    }
    else{
        form.style.display = "none";
    }
}



// Displaying questions at the profile
display_questions = document.getElementById("display_questions")
display_questions.addEventListener("click", e=>{
        $.ajax({
            type: 'GET',
            url: '/profile/user_questions/',

            success: function(response){
                questions = response.questions
                console.log(questions)
                // descriptor_div makes the title of the div known
                let descriptor = document.getElementById("descriptor_div")
                descriptor_div.innerHTML = `<span>${questions.length} Questions</span>`
                console.log(response)
                if (questions.length != 0){
                    questions.forEach(question => {
                        /* Note: the id body_div is used to display the content of all the menus on the
                        line that comes after describe yourself */

                        let created_div = document.getElementById("information_div")
                        if (created_div != null){
                            created_div.remove()
                        }

                        // creating a new div for each existing question
                        let question_div = document.createElement("div")
                        question_div.innerHTML =
                        `
                        <div id="information_div">
                           <p><b>${question.question}</b></p>
                           <span> <img src="/static/images/edit.png" height="15px" width="15px"> Answers</span>
                        </div>
                        `
                        let mother = document.getElementById('side1')
                        mother.appendChild(question_div)
                    })
                }
                else{
                     // creating a new div for each existing question
                        let created_div = document.getElementById("information_div")
                        if (created_div != null){
                            created_div.remove()
                        }

                        let question_div = document.createElement("div")
                        question_div.innerHTML =
                        `
                        <div id="information_div">
                          Oops! You have asked no questions yet.
                        </div>
                        `
                        let mother = document.getElementById('side1')
                        mother.appendChild(question_div)
                }
            },
            error: function(error){

            }

        })

})


// Adding a marker which marks the current active item on the menu that comes after describe yourself
// I call it the informant_menu

informant_menu = [...document.getElementsByClassName("informant")]

informant_menu2 = document.getElementsByClassName("informant")

informant_menu.forEach( menu=>{
    menu.addEventListener('click', e=>{
        for(i=0; i<=informant_menu2.length-1; i++){
           informant_menu2[i].style="border-bottom: 0;"
        }

        e.target.style="border-bottom: 2px solid coral; color:brown;"

    })
})



// Displaying answers at the profile
display_answers = document.getElementById("display_answers")
display_answers.addEventListener("click", e=>{
        $.ajax({
            type: 'GET',
            url: '/profile/answers_to_user/',

            success: function(response){
                answers = response.answers
                console.log(answers)
                // descriptor_div makes the title of the div known
                let descriptor = document.getElementById("descriptor_div")
                descriptor_div.innerHTML = `<span>${answers.length} Answers</span>`

                //console.log(response)
                if (answers.length != 0){
                    answers.forEach(answer => {
                        /* Note: the id body_div is used to display the content of all the menus on the
                        line that comes after describe yourself */

                         let created_div = document.getElementById("information_div")
                        if (created_div != null){
                            created_div.remove()
                        }

                        // creating a new div for each existing question
                        let question_div = document.createElement("div")
                        question_div.innerHTML =
                        `
                        <div id="information_div">
                            <p><b>${answer.question}</b></p>
                           <p>${answer.answer}</p>
                           <span>  Answers <img style="float: right;" src="/static/images/menu(1).png" height="25px" width="25px"></span>
                        </div>
                        `
                        let mother = document.getElementById('side1')
                        mother.appendChild(question_div)
                    })
                }
                else{
                     // creating a new div for each existing question
                        let created_div = document.getElementById("information_div")
                        if (created_div != null){
                            created_div.remove()
                        }

                        let question_div = document.createElement("div")
                        question_div.innerHTML =
                        `
                        <div id="information_div">
                          Oops! You have recieved no answers yet.
                        </div>
                        `
                        let mother = document.getElementById('side1')
                        mother.appendChild(question_div)
                }
            },
            error: function(error){

            }

        })

})


// Displaying the profile detail informant on side1"
var profile = document.getElementById("profile_detail")
profile.addEventListener('click', e=>{
    let information_div = document.getElementById("information_div")
    let emc = String(e.target.getAttribute("emc"))
    let edc = e.target.getAttribute("edc")
    let loc = e.target.getAttribute("loc")

    let descriptor = document.getElementById("descriptor_div")
    descriptor_div.innerHTML = `<span>Profile</span>`

    //alert(emc)
    information_div.innerHTML =
        `
            ${ emc != "<QuerySet" & edc != "<QuerySet" & loc != "<QuerySet"?
                `<p style="color: rgb(120,140,120);">profile Credentials Complete </p>`
                  :
                `${  emc == "<QuerySet"  | edc == "<QuerySet"  | loc == "<QuerySet" ?
                    `<p style="color: rgb(120,120,140);"> You need to update your profile</p>`
                    :
                    `<p style="color: red;"> No Profile Credentials </p>`
                 }
                `
            }
        `
})



// Displaying all NonForum-Post (i.e Non-Train-Post, post that were made directly to the public) by the user
var posts = document.getElementById("user_posts")
posts.addEventListener('click', e=>{
    let information_div = document.getElementById("information_div")
    let user = e.target.getAttribute('username')

    $.ajax({
        url: `/profile/posts_by_user/` ,
        success: function(response){
            let messages = response.messages
            console.log(messages)

            let descriptor = document.getElementById("descriptor_div")
            descriptor_div.innerHTML = `<span>${messages.length} Posts</span>`

           information_div.innerHTML = " "
           if(messages.length != 0){
                messages.forEach( message =>{
                let message_div = document.createElement("div")
                message_div.setAttribute('class', 'message_body')

                message_div.innerHTML =
                    `   <span><b>${message.author}</b></span><br>
                        <span id="time">${message.created} ago</span>
                        <p>${message.body}</p>
                        <img style="float: right;" src="/static/images/menu(1).png" height="25px" width="25px">
                        <br>
                    `
                    information_div.append(message_div)
                })

           }
           else{
               information_div.innerHTML = " "
               let message_div = document.createElement("div")
               message_div.innerHTML = "No posts yet"
               information_div.append(message_div)
           }


        },
        error: function(response){

        }
    })

})


// Followers tab
var posts = document.getElementById("display_followers")
posts.addEventListener('click', e=>{
    let information_div = document.getElementById("information_div")
    let user = e.target.getAttribute('username')

    $.ajax({
        url: `/profile/followers_of_user/` ,
        success: function(response){
            let followers = response.followers
            var emc_s = response.emc
            //console.log("emc_s", emc_s)
            console.log(followers)

            let descriptor = document.getElementById("descriptor_div")
            descriptor_div.innerHTML = `<span>${followers.length} Followers</span>`

           information_div.innerHTML = " "
           if(followers.length != 0){
                followers.forEach( follower =>{
                let followers_div = document.createElement("div")
                followers_div.setAttribute('class', 'message_body')
                //alert(emc)
                //let a = 2

                followers_div.innerHTML =
                    `
                        <span style="text-transform: capitalize;"><b>${follower.name},</b></span>
                        <!--// checking if employment credential is available. If available add the below -->
                        <span id="works_at"> </span>
                        <img style="float: right;" src="/static/images/menu(1).png" height="25px" width="25px">
                        <br>
                    `
                    information_div.append(followers_div)

                     emc_s.forEach( emc=>{
                        if (emc.user_em_id == follower.id){
                            let works_at = document.getElementById("works_at")
                            works_at.innerHTML =
                                `${emc.position} at ${emc.company_organization} (${emc.start_year.substring(0,4)} - ${emc.end_year.substring(0,4)})
                                `
                        }
                     })
                })

           }
           else{
               information_div.innerHTML = " "
               let message_div = document.createElement("div")
               message_div.innerHTML = "You have no followers yet"
               information_div.append(message_div)
           }


        },
        error: function(response){

        }
    })

})



// following tab
var posts = document.getElementById("display_followings")
posts.addEventListener('click', e=>{
    let information_div = document.getElementById("information_div")
    let user = e.target.getAttribute('username')

    $.ajax({
        url: `/profile/followings_of_user/` ,
        success: function(response){
            let followings = response.followings
            var emc_s = response.emc
            //console.log("emc_s", emc_s)
            console.log(followings)

            let descriptor = document.getElementById("descriptor_div")
            descriptor_div.innerHTML = `<span>${followings.length} Followings</span>`

           information_div.innerHTML = " "
           if(followings.length != 0){
                followings.forEach( following =>{
                let following_div = document.createElement("div")
                following_div.setAttribute('class', 'message_body')
                //alert(emc)
                //let a = 2

                following_div.innerHTML =
                    `
                        <span style="text-transform: capitalize;"><b>${following.name},</b></span>
                        <!--// checking if employment credential is available. If available add the below -->
                        <span id="works_at"> </span>
                        <img style="float: right;" src="/static/images/menu(1).png" height="25px" width="25px">
                        <br>
                    `
                    information_div.append(following_div)

                     emc_s.forEach( emc=>{
                        if (3 == following.id){
                            let works_at = document.getElementById("works_at")
                            works_at.innerHTML =
                                `${emc.position} at ${emc.company_organization} (${emc.start_year.substring(0,4)} - ${emc.end_year.substring(0,4)})
                                `
                        }
                     })
                })

           }
           else{
               information_div.innerHTML = " "
               let message_div = document.createElement("div")
               message_div.innerHTML = "You have no followers yet"
               information_div.append(message_div)
           }


        },
        error: function(response){

        }
    })

})


 // provides the first letter in the profile_profile_div
let profile_profile_div = document.getElementById("profile_profile_div")
if (profile_profile_div){
       profile_profile_div.innerHTML = profile_profile_div.innerHTML.trim().substring(0,1)
       profile_profile_div.style=`text-transform: capitalize;`
}

