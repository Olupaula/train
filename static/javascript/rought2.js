// this takes care of the django csrf-token
var like_forms
like_forms = [...document.getElementsByClassName("like_form")]

csrf = document.getElementsByName("csrfmiddlewaretoken")
console.log('csrf', csrf)

const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

// Dates are used for setting the time from django's JsonResponse to javascript
months =["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]

//1) Takes care of creating a new message
// A LISTENER IS ADDED TO FORM WITH ID="FORM" TO CREATE A NEW MESSAGE SUBMISSION USING AJAX
// comment_no is part of the id of each form that is created by ajax
comment_no = 1

form = document.getElementById("form")
// replace  the first uncommented line with line below, if you want to use jquery.
// $(document).on('submit', '#form', function(e){

form.addEventListener('submit', e=>{
    //const submittedId = e.target.getAttribute("text_area_id")
    //const comment = document.getElementById(submittedId)
    e.preventDefault(); //preventing default action
    //forum_div = document.querySelectorAll("div")[3]
    //forum_id = forum_div.getAttribute("_forum_id")
    forum_div = document.getElementById("current_forum")
    forum_id = forum_div.getAttribute("forum_id")

    console.log(forum_id)
    // Takes care of creating a new message
    $.ajax({
        type:'POST',
        url: "/create_new_message/",
        data: {
            body: $('#id_body').val(),
            //description: $('#description').val(),
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]')? $('input[name=csrfmiddlewaretoken]').val() : csrf[0].value
            //comment: comment
        },
        success: function(response){
            message = response.message[0]
            if (message.author == message.user & message.forum_id == forum_id){
                displayMessageByUser(response)
            }
            //else if (message.author != message.user & message.forum_id == forum_id){
                //displayMessageByUser(response)
            //}

        },
        error: function(error){

        }
    });


})


// (1a) Takes care of messages posted by current user
function displayMessageByUser(response){
    const data = response.message
    const emc = response.author_credential
     //console.log (emc)
        // emc is employment credential

        data.forEach( (message) => {
            emc.forEach( (emc)=>{
                date = new Date(message.created)
                mother = document.getElementById("s")
                if(mother==null){
                mother = document.createElement("hr")
                mother.setAttribute("id", "s")
                }

                console.log(mother)
                messageHtml(mother, message, emc)
                //addCommentToNewMessage(response)
            })
        })

      //addComment(response)
      //likeUnlike(response)
      document.getElementById("form").reset()
      comment_no+=1

}


//1b) Takes care of messages by other users
var previous_post_id = 0

//form.addEventListener('submit', e=> {
/*
setInterval(function displayAllMessages(){
        currentUser_div = document.getElementById("current_user")
        user = currentUser_div.getAttribute("current_user")
        user_id = currentUser_div.getAttribute("current_user_id")


        $.ajax({
            type: "POST",
            url: `/last_message_others/${user_id}/`,
            data: {
                'csrfmiddlewaretoken': csrf[0].value
            },

            success: function(response){
                message = response.message[0]
                var current_post_id
                current_post_id = message.post_id
                console.log("current_post_id", current_post_id)
                console.log("previous_id", previous_post_id)
                console.log('user', user)
                console.log('auther', message.author)

                if (previous_post_id != current_post_id){

                    d = document.getElementById("s")
                    //$("#ds").empty()
                    //*if (d != null){
                    //    d.remove()
                    //}
                    mother = document.getElementById("s")
                    if(mother==null){
                        mother = document.createElement("div")
                        mother.setAttribute("id", "s")
                        //addComment(response)

                    }
                    console.log(mother)

                    date = new Date(message.created)

                    if (user != message.author){
                        messageHtml(mother, response.message[0])
                        //comment_forms = [...document.getElementsByClassName("comment_form")]
                        //addCommentToAll()
                        addComment(response)
                    }




                    //document.getElementById("form").reset()
                    comment_no+=1
                    //likeUnlike(response)
                    previous_post_id = current_post_id

                }
                else{

                }
                //console.log("previous", current_post_id)
                //console.log("current", previous_post_id)

            },
            error: function(error){

            }
        })

    }, 1000)

//})
//})
*/

function messageHtml(mother, message, emc){
    mother.insertAdjacentHTML('afterbegin',
         // NEW MESSAGE AND ITS PROPERTIES
        `<div id="conversation_${message.post_id}" style="background:orange;">
             <!--// message-->
             <p><b>${message.author}</b></p>
             <span><b> ${emc.position} at ${emc.company_organization} (${emc.start_year} ${emc.end_year !=null? `- ${emc.end_year}`:`` }) </b></span>
       .
            <small>${months[date.getMonth()]}. ${date.getDate()}, ${date.getFullYear()}</small>
                <p>${message.body}</p>

                <!--// comment -->
                //${addCommentToNewMessage(response)}
            <small id="jbc_on_${message.post_id}_" >${date.getHours()}:${date.getMinutes()}
             ${date.getHours()>=12? "p.m.": "a.m."} </small>

             <!--// like button-->
             <!-- NB: The acronyms {b: button, lb: like button, lf: like form, cf: comment form, sl: show like} -->
             <form class="like_form" forum_id='${message.forum_id}' message_id='${message.post_id}' method='POST'>
                <input type='hidden' name='csrfmiddlewaretoken' value='${csrftoken}'>
                <button id='${message.post_id}lb' type='submit' name='post_id' value='${message.post_id}' class='btnprimary'>
                        Like
                </button>
                <small id="${message.post_id}sl"> . ${message.likes_total} Likes </small>
             </form>

             <!--// comment button-->
            <button id="${message.post_id}b"
            onclick="showHideForm('${message.post_id}b','${message.post_id}cf','Comment')">
                comment
            </button>
            <form id="${message.post_id}cf" text_area_id="${message.post_id}" style="display:none;" method="POST">
                <textarea id="${message.post_id}"></textarea>
                <input type="submit">
            </form>


        <div>
        <hr style="margin-bottom:-0.05px">
       `
    )
    like_forms = [...document.getElementsByClassName("like_form")]
    likeSingleMessage()
    //if (message.author_id != message.user) { updateAllLikes() }

}


// 2) This takes care of imputing and outputting comments from already existing messages to screen in Ajax format
function addCommentToExistingMessages(){
    var comment_forms = [...document.getElementsByClassName("comment_form")]
    comment_forms.forEach(forms=>{
       forms.addEventListener('submit', e=>{
            submittedMessageId = e.target.getAttribute("text_area_id")
            comment = document.getElementById(submittedMessageId)
            e.preventDefault()
            $.ajax({
                type: 'POST',
                url: `/comments/${submittedMessageId}/`,
                data: {
                    comment: comment.value,
                    //comment_: JSON.stringify({comment: comment.value()}),
                    csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
                },
                dataType: 'json',
                success: function(response){

                     ///addComment(response)
                    inserter= document.getElementById(`jbc_on_${response.comment[0].post_id}`)
                    inserter.insertAdjacentHTML("afterbegin",`
                    <div  style="background:yellow; margin-left:20px; margin-bottom:20px;" >
                        <p><small>${response.comment[0].comment}</small></p>
                        <p>${response.comment[0].author}</p>
                    </div>`)
                    console.log(response)
                    console.log(response.comment[0].comment)

                },

                error: function(error){
                    console.log(e.target.parentNode)
                }
            })
       })
    })
}
addCommentToExistingMessages()


// 3) Add comment comments on new message
function addCommentToNewMessage(response){
    message = response.message[0]
    //console.log(response)
// Takes care of adding comments on the new message
    form_ = document.getElementById(`${message.post_id}cf`)
    if(form_ != null){
    // console.log(form_)
        form_.addEventListener('submit', e_=> {
            e_.preventDefault()
            submittedMessageId = `${message.post_id}`
            //console.log(submittedMessageId)
            comment = document.getElementById(submittedMessageId)

            console.log(comment)

            if (comment != null){
            // console.log(comment.value)
                $.ajax({
                    type: 'POST',
                    url: `/comments/${submittedMessageId}/`,
                    data: {
                        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                        comment: comment.value,
                        //csrfmiddlewaretoken: csrftoken,
                    },
                    success: function(response){
                        console.log(response)
                        inserter= document.getElementById(`jbc_on_${response.comment[0].post_id}_`)
                        inserter.insertAdjacentHTML("afterbegin",`
                        <div  style="background:yellow; margin-left:20px; margin-bottom:20px;" >
                                <p><small>${response.comment[0].comment}</small></p>
                                <p>${response.comment[0].author}</p>
                        </div>`)
                        console.log(response)
                        console.log(response.comment[0].comment)
                        form_.reset()
                    },
                    error: function(error){
                        console.log(error)
                    }
                })
            }
        })
    }

}


// 5) Takes care of liking already existing messages NB: lbe means "like button for existing an message"
function likeSingleMessage(){
    like_forms.forEach(function(form){
        form.addEventListener('submit', function(e){
            e.preventDefault()
            messageId = e.target.getAttribute('message_id') // this attribute belongs to the like_form
            console.log(messageId)
            likeButton = document.getElementById(`${messageId}lb`)
            forumId = e.target.getAttribute("forum_id")

            $.ajax({
                type: 'POST',
                url: `/update_like/${messageId}/${forumId}/1`,
                data: {
                    post_id: messageId,
                    'csrfmiddlewaretoken': csrf[0].value
                },
                success: function(response){
                    console.log("successful")
                    displayLikes = document.getElementById(`${messageId}sl`)
                    displayLikes.innerHTML = `. ${response.message[0].likes_total} Likes`

                },
                error: function(response){
                    console.log("failed")
                }
            })
        })

    })
}







// Takes care of updating likes from other users


//var like_forms = [...document.getElementsByClassName('like_form')]

//console.log("form length", like_forms.length)

/*
function updateAllLikes(){
//like_forms.forEach( form_ => {
//    form_.addEventListener('submit', e=>{
//     e.preventDefault()
      //setInterval( function d(){
            $.ajax({
                type: "GET",
                url: "/update_all_users_like/",
                success: function(response){
                    message = response.messages
                    message.forEach(message =>{
                        console.log("good")

                        button = document.getElementById(`${message.post_id}sl`)

                        if(button!=null){
                            console.log(message.post_id)
                            button.innerHTML = `. ${message.likes_total} Likes`
                        }

                    })
                },
                error: function(error){
                    console.log(error)

                }

            })

   //   } ,1000)

//    })
//});
}
*/

likeSingleMessage()
//updateAllLikes()

//alert(like_forms[0].innerHTML)





