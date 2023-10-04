// this takes care of the django csrf-token
var like_forms
like_forms = [...document.getElementsByClassName("like_form")]

var csrf = document.getElementsByName("csrfmiddlewaretoken")
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
var months =["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]

//1) Takes care of creating a new message
//{ A LISTENER IS ADDED TO FORM WITH ID="FORM" TO CREATE A NEW MESSAGE SUBMISSION USING AJAX
// comment_no is part of the id of each form that is created by ajax
var comment_no = 1

// the message form
var form = document.getElementById("form")

form.addEventListener('click', e=>{
    //displaying the message box
    showMessageBox("create_or_edit_message_box")
    let closer = document.getElementById("create_or_edit_message_box_closer")

    // closing the message box using the close button
    closer.addEventListener("click", e=>{
        closeMessageBox()
    })

    var form_ = document.getElementById("create_or_edit_message_form")

    form_.addEventListener('submit', e=>{
        e.preventDefault();
        //$form = $(this)
        let forum_div = document.getElementById("current_forum")
        let forum_id = forum_div.getAttribute("forum_id")
        console.log("this", this)
        console.log(forum_id)
        //console.log("body", $('#message_box').val())
        // Takes care of creating a new message

        //let form_ = document.getElementById("create_or_edit_message_form")
        //let form = form_
        // alert($("#create_or_edit_message_body").get(0).value)
        //var formData = new FormData(this)

        /* representative is the editable div that stands for the textarea. This textarea receives innerHTML
        on submission */
        let representative = document.getElementById("message_body_representative")
        // let copy_representative = document.getElementById("message_body_representative_copy")
        //image_loader = document.getElementById("input_upload_image")
        //representative.innerHTML += `<img src=${image_loader.} height="70%" width="300px">`

        let textarea = document.getElementById("create_or_edit_message_body")
        let images = [...document.getElementsByClassName("message_uploading_images")]

        //alert([...images])
        //alert(typeof(image_names[0]))
        console.log("image_names", image_names)
        alert(`images_names = ${image_names.length}`)

        let delete_buttons = [...document.getElementsByClassName("temporary_delete_button")]

        for(let i=0; i<=images.length-1; i++){
            alert(`delete_button_length= ${delete_buttons.length}`)
            alert(`images_length = ${images.length}`)
            // alert(images.length)
            images[i].setAttribute("src", "/images/"+image_names[i])
            // changing the class name of the images to make for good combination
            images[i].setAttribute("class", "message_uploaded_images")
            images[i].removeAttribute("id")

            // removing the delete buttons
            delete_buttons[i].remove()
        }

        //for( let i=0; i<=image_id_number){

        //}
        image_names = []
        image_url_list = []
        image_list = []
        image_id_number = 0
        //for(let i=0; i<=images.length-1; i++){
            //images[i].setAttribute("class", "message_uploaded_images")
        //}

         //image_names = []
        representative.style = "font-family: arial, sans-serif"
        textarea.innerHTML = representative.innerHTML
        textarea.style = "font-family: arial, sans-serif"



        var formData = new FormData();
        //alert(form_.innerHTML)
        //for( let i=0; i<=$("input[id^='input_upload_image']")[0].files.length; i++){
        //    $("input[id^='input_upload_image']")[0].files[i] = image_list[i]
        //}

        //$("#helper_file_collector").files
       // $("#input_upload_image").files = $("#helper_file_collector").files
       var input_loader = document.getElementById("input_upload_image")
       input_loader.files = dataTransfer.files
       console.log("data2", input_loader.files)
       //('#input_upload_image').files = dataTransfer.files
       console.log("transfered_file", $("input[id^='input_upload_image']").files)
        //$("input[id^='input_upload_image']").files = $("input[id^='helper_file_collector']").files
        for( let i=0; i<=$("input[id^='input_upload_image']")[0].files.length-1; i++ ){
              //this can be used/
              formData.append("images", $("input[id^='input_upload_image']")[0].files[i]);
              //formData.append("images", image_list[i]);
        }
        //formData.append("images", $("input[id^='input_upload_image']")[0].files[0]);
        formData.append("csrfmiddlewaretoken", csrftoken);
        formData.append("body", $('#create_or_edit_message_body').val())

        //data.append("file", ("input[id^='input_upload_image']").files[0])
        //data.append("csrfmiddlewaretoken")
        $.ajax({
            type:'POST',
            url: "/create_new_message/",
            //enctype: "multipart/form-data",
            data:  formData,
                    /*{
                        body: $('#create_or_edit_message_body').val(),
                        //description: $('#description').val(),
                        file: $("#input_upload_image").val(),
                        csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val() //csrf[0].value,

                        //comment: comment
                    }*/
            success: function(response){

                // closing the message box when the save button is clicked
                closeMessageBox()
                //alert(response)
                console.log(response.images[0])
                //message = response.message
                let message = response.message[0]
                console.log(message.forum_id,forum_id)
                if (message.forum_id == forum_id){
                    displayMessageByUser(response)
                    console.log("Cm", "successful")
                }
                //else if (message.author != message.user & message.forum_id == forum_id){
                    //displayMessageByUser(response)
                //}




            },
            error: function(error){
                console.log(error)
            },
            //cache: false,
            contentType: false,
            processData: false
        });



    })


})




// (1a) Takes care of messages posted by current user
function displayMessageByUser(response){
    const message = response.message[0]
    const emc = response.author_credential[0]
     //console.log (emc)
        // emc is employment credential

        //data.forEach( (message) => {
          //  emc.forEach( (emc)=>{
                //let date = new Date(message.created)
                let mother = document.getElementById("s")
                if(mother==null){
                mother = document.createElement("hr")
                mother.setAttribute("id", "s")
                }

                console.log(mother)
                messageHtml(mother, response, emc)
                addCommentToNewMessage(response)
                message_menu_opener()
           // })
        //})

      //addComment(response)
      //likeUnlike(response)
      document.getElementById("form").reset()
      comment_no+=1

}



// Handles the html part of creating a new message
function messageHtml(mother, response, emc){
    let message = response.message[0]
    let image = response.images[0]
    let date = new Date(message.created)

    mother.insertAdjacentHTML('afterbegin',
         // NEW MESSAGE AND ITS PROPERTIES
        `<div id="conversation_${message.post_id}" class="post" >
             <!--// message-->
              <div class="author_details" postid_='${message.post_id}'>

                    <!--// displaying author's name -->
                     <span><b>${message.author}</b></span>

                     <!--//follow buttons -->
                    ${message.user != message.author?
                        `<form  id="follow" leader_id={{post.author_id}} _forum_id_={{forum.id}} class="follow_form"
                            method="POST">
                            <input type="hidden" name="csrfmiddlewaretoken" value=${csrftoken}>
                            <button id="mb" class={{post.author_id}}fb type="submit" name="author_id"
                                value="{{post.author_id}}" >
                                   follow
                            </button>
                            <small class="{{post.author_id}}nf">
                                <!-- {% for leader in leaders %}-->
                                     <!--{% if leader.leader_id == post.author_id %} -->
                                        <i> leader.followers_total followers </i>
                                     <!-- {% endif %} -->
                                 <!-- {% endfor %} -->
                            </small>
                        </form>` : ``
                    }

                    <!-- //delete button -->
                     ${message.author == message.user?
                         `<form  style="float:right; margin-left:30px;" class="delete_message" postId={{post.id}} >
                             <input type="hidden" name="csrfmiddlewaretoken" value=${csrftoken}>
                             <button>
                                 <img src="/static/images/close.png"  height="12px" width="12px">
                             </button>
                         </form>` : ``
                      }

                     <!--// other menus like edit etc -->
                     <img class="message_menu" id="message_menu_${message.post_id}" src="/static/images/menu(1).png" style="float:right;"  height="20px" width="20px">
                     <br>

                     <!--// author's credential -->
                     <span id="credential">
                        ${ emc.position?
                             `
                              <b> ${emc.position} at ${emc.company_organization} (${emc.start_year} ${emc.end_year !=null? `- ${emc.end_year}`:`` }) </b>
                             `
                             :

                             ``
                         }
                     </span>

                 <!-- // time  posted-->
                 <small>${message.timesince}</small>
                 <!--<small>${months[date.getMonth()]}. ${date.getDate()}, ${date.getFullYear()}</small> -->
            </div>



             <!-- //Actual Message (body)-->
             <p id=post_body_${message.post_id}>${message.body}</p>
                  <!--{# message image #}
                            {% for image in images %}
                                {% if image.message_id == post.id %} -->
                                <!-- // This was the single image I used to upload. Remove this as soon as multiple images can be loaded in editing fashion-->
                                <!-- <div style="text-align: center;"><img src="${image.image}" height="70%" width="300px" ><br></div> -->
                               <!-- {% endif %}
                            {% endfor %}-->

             <!--// like button-->
             <!-- NB: The acronyms {b: button, lb: like button, lf: like form, cf: comment form, sl: show like} -->
             <form class="like_form"
             forum_id='${message.forum_id}'
             message_id='${message.post_id}'
             src1 ="/static/images/like.png"
             src2 ="/static/images/thumb-up.png"
             method='POST'>
                <input type='hidden' name='csrfmiddlewaretoken' value='${csrftoken}'>
                <button id='${message.post_id}lb' type='submit' name='post_id' value='${message.post_id}' class='btnprimary'>
                    <img src="/static/images/like.png"  height="20px" width="20px">
                </button>
                <small id="${message.post_id}sl"> . ${message.likes_total} Likes </small>
             </form>

             ${ message.user != message.author?
                    `{# follow button #}
                    <form action="{% url 'update_followers' post.author_id  post.forum_id  2 %}" method="POST">
                        {% csrf_token %}
                        <button type="submit" name="author_id" value="{{post.author_id}}" class="btnprimary">
                               follow
                        </button>
                    </form>` : ``
             }
             <!--// comment button-->
            <div class="comment_holder_div" id='comment_holder_div_${message.post_id}'>
                <button id="${message.post_id}b"
                onclick="showHideForm('${message.post_id}b','${message.post_id}cf','Comment', 'comment_holder_div_${message.post_id}')"
                src1="/static/images/speech-bubble.png" src2="/static/images/speech-bubble.png"
                >
                    <img src="/static/images/speech-bubble.png"  height="20px" width="20px">
                </button>
                <form id="${message.post_id}cf" text_area_id="${message.post_id}" style="display:none;" method="POST">
                    <div class="comment_impute">
                        <textarea id="${message.post_id}"></textarea>
                        <button>
                            <img src="/static/images/send-message.png"  height="20px" width="20px">
                        </button>
                     </div>
                </form>
                <!-- //not to be used <small id="jbc_on_${message.post_id}" >${date.getHours()}:${date.getMinutes()}
                 ${date.getHours()>=12? "p.m.": "a.m."} </small> -->
            </div>
        <div>


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
            let submittedMessageId = e.target.getAttribute("text_area_id")
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
                    <div class='${submittedMessageId}cdiv comment_display'>
                        <p><small><b>${response.comment[0].author}</small></b></p>
                        <p>${response.comment[0].comment}</p>
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
    let message = response.message[0]
    //console.log(response)
// Takes care of adding comments on the new message
    let form_ = document.getElementById(`${message.post_id}cf`)
    if(form_ != null){
    // console.log(form_)
        form_.addEventListener('submit', e_=> {
            e_.preventDefault()
            let submittedMessageId = `${message.post_id}`
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
                        let inserter= document.getElementById(`jbc_on_${response.comment[0].post_id}`)
                        inserter.insertAdjacentHTML("afterbegin",`
                        <div class='${submittedMessageId}cdiv comment_display'>
                                <p>${response.comment[0].author}</p>
                                <p><small><i>${response.comment[0].comment}</i></small></p>
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

            // attributes for message ( or post)
            let messageId = e.target.getAttribute('message_id') // this attribute belongs to the like_form
            console.log(messageId)
            let likeButton = document.getElementById(`${messageId}lb`)
            let forumId = e.target.getAttribute("forum_id")

           // attributes for image
            let src1 = e.target.getAttribute("src1")
            let src2 = e.target.getAttribute("src2")

            $.ajax({
                type: 'POST',
                url: `/update_like/${messageId}/${forumId}/1`,
                data: {
                    post_id: messageId,
                    'csrfmiddlewaretoken': csrf[0].value
                },
                success: function(response){
                    console.log("successful")
                    let displayLikes = document.getElementById(`${messageId}sl`)
                    displayLikes.innerHTML = `. ${response.message[0].likes_total} Likes`

                    // changing the image on the button
                    if (response.message[0].like_state) {
                        likeButton.innerHTML = `<img src=${src2} height="20px" width="20px">`
                    }
                    else{
                        likeButton.innerHTML = `<img src=${src1} height="20px" width="20px">`
                    }

                },
                error: function(response){
                    console.log("failed")
                }
            })
        })

    })
}
likeSingleMessage()


// Takes care of followings for existing messages
var follow_forms = [...document.getElementsByClassName("follow_form")]
follow_forms.forEach(form =>{
    form.addEventListener("submit", e=>{
        e.preventDefault()
        let leader_id = e.target.getAttribute("leader_id")
        let forum_id = e.target.getAttribute("_forum_id_")
        let follow_button = document.getElementsByClassName(`${leader_id}fb`)
        let followers_count = document.getElementsByClassName(`${leader_id}nf`)

        $.ajax({
            type: 'POST',
            data: {
                'csrfmiddlewaretoken': csrf[0].value
            },
            url: `/update_followers/${leader_id}/${forum_id}/1`,
            success: function(response){
                console.log(leader_id)
                // if the current user is following this leader, then say user is following (the leader)
                if (response.leader[0].following == true ){
                    for(let i=0; i<=follow_button.length-1; i++){
                        follow_button[i].innerHTML = "following"
                        followers_count[i].innerHTML = `<i>(${response.leader[0].followers_total} following)</i>`
                    }
                }
                 // else if the current user is not following this leader, then say give the user and option to follow (the leader)
                else{
                    for( let i=0; i<=follow_button.length-1; i++){
                        follow_button[i].innerHTML = "follow"
                        followers_count[i].innerHTML = `<i>(${response.leader[0].followers_total} following)</i>`
                    }

                }


            },
            error : function(response){

            }

        })

    })
})

// If the display of the comment form is none, then hide all the comments
/*comment_form = [...document.getElementsByClassName("comment_form")]

    comment_form.forEach( form=>{
    if (form.style.display == "block") {
        alert("yes")
    }
})
*/


// takes care of deleting a message
var delete_message = [...document.getElementsByClassName("delete_message")]

delete_message.forEach( deleter => {
    deleter.addEventListener('submit', function(e){
        e.preventDefault()
        let d = confirm(" Delete Message?")
        if(d){
            let postId = e.target.getAttribute("postId")
            $.ajax({
                type: 'POST',
                url: `/delete_message/${postId}/`,
                data: {
                    'csrfmiddlewaretoken': csrf[0].value
                },
                success: function(response){
                    //console.log("successful")
                    let post = document.getElementById(`conversation_${postId}`)
                    post.remove()
                },
                error: function(error){

                }
           })
        }

    })
})


// Takes care menu for each message: handling editing, etc.
var post_to_edit_id
function message_menu_opener(){
   var message_menu = [...document.getElementsByClassName("message_menu")]

    message_menu.forEach( menu=> {
        menu.addEventListener('click', e=>{
            //alert("good");
            var parent = e.target.parentNode
            post_to_edit_id = parent.getAttribute("postid_")
            //alert(post_to_edit_id)

            let menu_div = document.createElement("div") // div for the menu
            let darker_for_menu = document.createElement("div") // makes background dark

            let message_id = e.target.getAttribute("id")

            message_id = message_id.substring(13, message_id.length) // retrieving id by removing letters
            console.log(message_id)

            let container = document.getElementById(`conversation_${message_id}`)

            //darker.textContent = "Whe"
            darker_for_menu.setAttribute("class", "screen-darker")

            //console.log(darker_for_menu)
            menu_div.innerHTML =
                `
                <span class="edit_post"> Edit Message </span>
                <hr>
                <span> Report Message </span>
                <hr>
                <span> Others </span>

                `
            menu_div.setAttribute("class","message-pop-up")
            menu_div.setAttribute("id", `e${post_to_edit_id}`)

            darker_for_menu.setAttribute("id", "darker_for_menu")

            document.body.append(menu_div)
            document.body.append(darker_for_menu)

            var messages_to_edit = [...document.getElementsByClassName('edit_post')]
            editMessage(messages_to_edit)

            document.body.setAttribute("style", "overflow:hidden;")

            if (menu_div != null){
                darker_for_menu.addEventListener('click',e =>{
                    menu_div.remove()
                    darker_for_menu.remove()
                    document.body.setAttribute("style", "overflow:scroll;")
                })
            }

            //alert(menu_div.innerHTML)
        })
    })

}
message_menu_opener()



// Variables to be used while creating or editing messages
var message_div = document.createElement("div") // new message box to be displayed
var new_darker = document.createElement("div") // new div to darken the background


//Takes care of message Box Div while creating or editing
   /*  Note that since images are displayed as blobs until they are saved, the intention is to display as blob when
        creating the message, but display as a saved file thereafter. */
var temp_image_list = [] // for temporarily collecting images during a specific selection.
var image_list = [] // for collecting all the images to be submitted, collated at each selection.
var image_url_list = []
var image_names = []
var image_id_number = 0
var image_id_array = []

var dataTransfer = new DataTransfer();
var image_file_list = document.createElement('input')
image_file_list.setAttribute("type", "file")
image_file_list.setAttribute("accept", "images/*")
image_file_list.setAttribute("multiple", true)
image_file_list.setAttribute("id", "helper_file_collector")


function showMessageBox(message, response=null){
  // shows the message box (text-area)

    message_div.innerHTML =
    `<img id="create_or_edit_message_box_closer" src="/static/images/close.png" height="15px" width="15px" style="float: right; margin-bottom: 10px; margin-right:20px">
        <form id="create_or_edit_message_form" method="POST"  enctype="multipart/form-data">
            <input type="hidden" name="csrfmiddlewaretoken"  value=${csrftoken} >
            <textarea id="create_or_edit_message_body" style="display: none;" cols=80 rows=25 >${response ? `${response.message[0].body}` : ''}</textarea>
            <div id="message_body_representative" for="create_or_Edit_message_body" contenteditable="true" style="width: 700px; height: 420px; margin: 5px; padding: 5px;" ></div>

            <div>

                <input id="input_upload_image" style="display: none;" type="file" multiple accept="image/*" src="/static/images/image.png" height="22px" width="22px" style="float: left; margin-bottom: 10px; margin-left:10px;">

                <div id="editing_tools_holder">
                    <input id="edit_text" type="image" src="/static/images/letter-a.png" height="22px" width="22px" style="float: left; margin-bottom: 10px; margin-left:20px">

                     <div id="image_loader_tabs">
                        <!-- // the label below is standing for the input with id="input_upload_image" -->
                        <label id="helper_upload_image" for=edit_text>
                            <image id="upload_image" type="image" src="/static/images/image.png" height="22px" width="22px" style="float: left; margin-bottom: 10px; margin-left:10px">
                        </label>

                        <input id="upload_gif" type="image" src="/static/images/gif-file.png" height="22px" width="22px" style="float: left; margin-bottom: 10px; margin-left:10px">
                    </div>

                    <input id="submit_creation_or_edition" type="submit" ${response==null? `value="Post"`: `value="Save"`}>
                    <!--//<button id="cancel_edition">cancel</button>-->
                </div>
            </div>
        </form>
        `
   message_div.setAttribute("class", "create_or_edit_message_box")

   //message_div.style=`margin: ${screen.availWidth - 250}px;`



    //alert(response)
   if(response != null){
       let previous_pop_up = document.getElementById(`e${post_to_edit_id}`)
       let previous_darker = document.getElementById("darker_for_menu")

       // previous darker
       previous_pop_up.remove()
       previous_darker.remove()
   }

   new_darker.setAttribute("class", "screen-darker")

   document.body.append(message_div)
   document.body.append(new_darker)


   // if the load image button is clicked, bring a pop-menu that allows for selection of desired image
   let load_image = document.getElementById("upload_image")
   load_image.addEventListener('click', e=>{
        e.preventDefault()
        let loader = document.getElementById("input_upload_image")
        loader.click()

        let representative = document.getElementById("message_body_representative")
        /* let copy_representative = document.createElement("div")
        copy_representative.setAttribute("display", "none")
        copy_representative.setAttribute("id", "message_body_representative_copy")
        document.body.append(copy_representative) */

        // a list of uploaded images

        loader.addEventListener("change", e=>{
            e.preventDefault()

            //let d = "/C:/fakepath/IMG_20211203_194024_891.jpg"
            // Getting the files from the file input field
            let url;
            for(let i=0; i<=loader.files.length-1; i++){
                //alert(`loader length is ${loader.files.length}`)
                temp_image_list.push(loader.files[i])
                image_list.push(loader.files[i])
                url = URL.createObjectURL(temp_image_list[i])
                image_names.push(loader.files[i].name)
                alert(url)
                //image_file_list.files.append(loader.files[i])

                // there is need to check that the src does not exist for each image before adding it to the div.
                image_url_list.push(url)
                representative.innerHTML +=
                    `
                     <div id="image_holder_${image_id_number}" class="message_image_holder">
                        <button id='image_button_${image_id_number}' class="temporary_delete_button" style="position: absolute;">&times</button>
                        <img id="uploading_image_${image_id_number}" class="message_uploading_images" src=${url} height="70%" width="300px">
                     <div>
                    `
                image_id_number += 1
            }

            //image_file_list.files = image_file_list.files == "undefined" ? [] + loader.files : image_file_list.files + loader.files


            for(let i=0; i<=loader.files.length-1; i++){
                dataTransfer.items.add(loader.files[i])
            }

            console.log("data", dataTransfer)

            console.log("image_list", image_list)
            console.log("loader", loader.files)


            // to delete uploaded image by clicking the delete button
            let delete_uploaded_image = [...document.getElementsByClassName("temporary_delete_button")]
            delete_uploaded_image.forEach( delete_button =>{
                delete_button.addEventListener("click", e=>{
                    e.preventDefault()
                    let image_id = e.target.getAttribute("id")

                    // if an image with this id exist, then remove it
                    //if(image_id){
                        let image_no = image_id.replace(image_id.substring(0,13), "")


                        //let image_holder = document.getElementById(`image_holder_${image_no}`)
                        let image_button = document.getElementById(`image_button_${image_no}`)
                        let image = document.getElementById(`uploading_image_${image_no}`)
                        let image_holder = document.getElementById(`image_holder_${image_no}`)

                        //console.log("image_holder = ", image_holder)
                        console.log("image_no = ", image_no)
                        console.log("image", image)

                        // remove the parent span and accompanying image
                        // remove image, it parent and the button
                        //e.target.remove()
                        image_button.remove()
                        image.remove()
                        image_holder.remove()


                        // removing the image from the list of dataTransfer items
                        dataTransfer.items.remove(image_no)
                        image_list.splice(image_no, 1)
                        image_names.splice(image_no, 1)
                        //image_url_list.splice(image_)
                        image_id_number -= 1
                        alert(`object_id = ${image_id_number}`)


                    //}
                })
            })



            // to delete uploaded image by pressing the delete key on keyboard

            let form = document.getElementById("create_or_edit_message_form")
            form.reset()
            //loader.value = null
            //image_file_list.files = loader.files
            url = null
            temp_image_list = [ ]
            console.log("url", url)
            console.log("helper_file", loader.files)



        })
   })


   // if the edit button is clicked
   let edit_text = document.getElementById("edit_text")
   edit_text.addEventListener('click', e=>{
        e.preventDefault()

        // removing image_loader_tab div to put the edit_text menu
        let image_loader_tab = document.getElementById("image_loader_tabs")
        image_loader_tab.style="display: none;"

        // creating a new div to put the edit_text menu
        let new_div =
            `<div id="edit_tools">
                 <button id="make_h1">H1</button>
                 <button id="make_bold">Bold</button>
                 <button id="italicize">Italicize</button>
            </div>
            `
        let before = document.getElementById("edit_text")
        before.insertAdjacentHTML("afterend", new_div)


        // To italicize text
        let italicize = document.getElementById("italicize")
        italicize.addEventListener('click', e=>{
            e.preventDefault()

            let text = document.getSelection()
            //alert(text.toString())

            let old_text = document.getElementById("message_body_representative")
            //alert(old_text)
            old_text.innerHTML =
            `${ old_text.innerHTML.replace(text.toString(),`<i>${text.toString()}</i>`)}`
        })

        // To make text bold
        let bold = document.getElementById("make_bold")
        bold.addEventListener('click', e=>{
            e.preventDefault()

            let text = document.getSelection()
            //alert(text.toString())

            let old_text = document.getElementById("message_body_representative")
            alert(old_text.innerHTML)
            old_text.innerHTML =
            `${ old_text.innerHTML.replace(text.toString(),`<b>${text.toString()}</b>`)}`
        })


   })
}


// Takes care of closing the message box
function closeMessageBox(){
    //let message_div = document.getElementById(messageBox)
    message_div.remove()
    new_darker.remove()
    document.body.setAttribute("style", "overflow:scroll;")

    // these lists need to be reset for a fresh message
    image_list = []
    image_url_list = []
    image_names = []

}


// Takes care of editing(updating) messages (it is a member of the menu)
function editMessage(messages_to_edit){
    messages_to_edit.forEach(edit_button=>{
        edit_button.addEventListener('click', e=> {
        e.target.parentNode.getAttribute
        e.preventDefault()

            $.ajax({
                type: "GET",
                url: `/edit_message/${post_to_edit_id}/`,
                data: {

                },
                success: function(response){
                   // Displaying the message box
                   showMessageBox("create_or_edit_message_box", response)

                    // submitting edited message

                let form = document.getElementById("create_or_edit_message_form")
                form.addEventListener('submit', e=>{
                    e.preventDefault()
                    let edited_message_ = document.getElementById("create_or_edit_message_body")

                    $.ajax({
                        type: "GET",
                        url: `/edit_message/${post_to_edit_id}/`,
                        data: {
                           'body': edited_message_.value
                        },
                        success: function(response){
                            //making the post reflect the change
                             let message_new_edition = document.getElementById(`post_body_${post_to_edit_id}`)
                             message_new_edition.innerHTML = response.message
                             closeMessageBox(message_div)
                             alert("Message Updated!")

                             message_new_edition_div = document.getElementById(`conversation_${post_to_edit_id}`)


                            // highlighting the edited message
                            function highlight_edited_message(){
                                message_new_edition_div.setAttribute("edited_message", "animate_edited_message")

                                setTimeout(remove_highlight, 3005)

                                function remove_highlight(){
                                    message_new_edition_div.removeAttribute("edited_message")
                                }
                            }

                             highlight_edited_message()
                        },
                        error: function(error){

                        }

                    })

                })


                //closing the message box
                let closer = document.getElementById("create_or_edit_message_box_closer")
                closer.addEventListener("click", e=>{
                        closeMessageBox()
                })



                   // cancelling editing message
                   /* let cancel_edition = document.getElementById("cancel_edition")
                   cancel_edition.addEventListener('click', e=>{
                        close_message()
                   })*/
                },
                error: function(error){
                    console.log(error)
                }

            })
        })
    })

}

/**
// Show and hides form for comment and creating message
function showHideForm(button, form, thing, container){
    var form = form;
    var button = button;
    form = document.getElementById(form);
    button = document.getElementById(button);

    // Obtaining Id's and classes to be used in determining whether to display or not to display forms
    let messageId_b = button.getAttribute("id")
    let messageId = messageId_b.replace("b","")

    console.log("message_id", messageId)
    comment_div = document.getElementsByClassName(`${messageId}cdiv`)

    div = document.getElementById(container)


    //console.log(comment_div[0])

    //console.log(e)
    // getting the second image which is displayed on the button when it is clicked
        //image = document.getElementById("create_button")
        //src2 = image.getAttribute("src2")


    if (form.style.display != "none"){
        form.style.display = "none";
        //button.innerHTML = thing;

        // getting the second image which is displayed on the button when it is clicked
        //(this is for comments and create message button. The code that changes the like button image is in forum.js)
        fd = button.getAttribute("src2")
        div.style = "height:0px; margin-bottom: 40px; width:0px;"
        var fxc = button.getAttribute('src2')
        button.innerHTML = `<img src=${fd} height='20px' width='20px'>`
        console.log("button", fxc);

        // This takes care of displaying existing comment as might be appropriate
         if(comment_div){
              for(i=0; i<=comment_div.length-1; i++){
                    comment_div[i].style.display = "none"
              }
         }
    }

    else{
        form.style.display = "block";
        button.innerHTML = "Cancel " + thing;
        form.reset();

        fd = button.getAttribute("src1")
        div.style = "height:100px;"
        var fxc = button.getAttribute('src1')
        button.innerHTML = `<img src=${fd} height='15px' width='15px'>`
        console.log("button", fxc);


        if(comment_div){
            for(i=0; i<=comment_div.length-1; i++){
                comment_div[i].style.display = "block"
            }
        }
    }


// return alert("all_good");
}

**/

