<script>
    $(document).on('submit', '#post-form', function(e){
        e.preventDefault();
            $.ajax({
                type:'POST',
                url: "{% url 'create' %}",
                data: {
                    name: $('#name').val(),
                    description: $('#description').val(),
                    csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
                },
                success: function(data){

c                },
             });


         setInterval(function(){
            $.ajax({
                type:'GET',
                url: "{% url 'notifications_update' %}",
                success: function(response){
                    $(body).empty();
                        for (var keys in response.forums){
                            var temp = "<p>" + response.forums[keys].name+"</p>";
                                $("#display").append(temp);
                    }
                 },
                error: function(response){ alert("an error occurred") }
             });
        } , 100);

    });
</script>



// Takes care of the like unlike button
/*
likeUnlikePosts = ()=>{
    const likeUnlikeForms = [...document.getElementsByClassName("like-unlike-forms")]
    likeUnlikeForms.forEach(
        form=>{
            form.addEventListener('submit',
                e=>{
                    clickedId = e.target.getAttribute('data-form-id')
                    clickedBtn = document.getElementById(`like-unlike-${clickedId}`)
                    e.preventDefault()

                    $.ajax(
                        {   'type': 'POST',
                            'url': '/like_unlike/',
                            data: {
                                'csrfmiddlewaretoken': csrftoken,
                                'pk': clickedId
                            },
                            success: function(response){
                                clickedBtn.textContent = `${response.liked ? "Unlike" : "Like"} (${response.count})`
                            },
                            error: function(error){
                                console.log(error)
                            }


                        }

                    )
                }
            )
        }
    )

}

let visible = 3;


const getData = () => {
    $.ajax({
        'type': 'GET',
        'url': `/notification2/${visible}` ,
        success: function(response){
           // 1)vWhen using serializers
           // const data = JSON.parse(response.forums)
           //console.log(data)

           // 2) When using the List kind
           // e = document.getElementById("yes")
           //e.innerHTML = response.forums
           //$("#yes2").text(response)

           console.log(response)
           const messages = response.messages
           console.log(messages)

           // e = document.getElementById("yes")
           elem = document.getElementById("postBox")
           messages.forEach(el => {
                elem.innerHTML += `
                <div class="card mb-2">
                    <div class="card-body">
                        <h5 class="card-title">${el.id} ${el.title}</p>
                        <p class="card-text">${el.message}</p>
                        <hr>
                    </div>
                    <div class="card-footer" style="">
                        <div class="row">
                            <div class="col" style="display:inline; padding:10px; margin-right:20px; margin-bottom:10px; width:100px; background:red; text-align:center;">
                                <a href="#" class="btn btn-primary" style="text-decoration:none; color:white;">Details</a>
                            </div>
                            <div class="col" style=" display:inline; padding:10px; width:100px; background:red; text-align:center;">
                                <form style="display:inline;" class="like-unlike-forms" data-form-id=${el.id}>
                                    <button id="like-unlike-${el.id}" class="btn btn-primary" style="background:red; border:none; color:white;">${el.liked ? `Unlike`: `Like`} (${el.like_count})</button>
                                    <!-- This another way by which it can be written (it is redundant anyways) <a href="#" class="btn btn-primary" style="text-decoration:none; color:white;">${el.liked ? `Unlike(${el.like_count})`: `Like(${el.like_count})`}</a>
                                    -->
                                </form>
                            </div>
                    </div>
                    <hr>
                    <hr>
                `

                // <small>${el.id}</small> - <b>${el.message}</b> - </br>
           });

           likeUnlikePosts();

           if (response.size==0){
                endBox.textContent="-- No post added yet--"
           }

           else if (response.size <= visible){
                loadBtn.remove()
                endBox.textContent = '-- No more posts to load --'
           }

        },

        error: function(response){

        }
    })

}

 loadBtn.addEventListener('click', ()=>{
    visible += 3
    getData()
})


getData()


man = (age, hobby ) => {
    console.log("I am "+ age + " years old and my " + " hobby is "+ hobby )

}

man("12", "piano playing")

*/


//d = form.getAttribute("id")
//console.log(form)

/*
$(document).on('submit', '#form', function(e){
        e.preventDefault();
        $.ajax({
            type:'POST',
            url: "/create_new_message/",
            data: {
                name: $('#name').val(),
                description: $('#description').val(),
                csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            },
            success: function(data){
                console.log(data.message)
            },
            error: function(error){

            }
        });

}) */



/* TAKES CARE OF NEW MESSAGE COMMENTS
                //comment_div = document.getElementsByClassName("class_comment")
                //inserter = e.target.parentNode
                // inserter.insertAdjacentHTML("afterbegin",
                inserter= document.getElementById(`jbc_on_${response.comment[0].post_id}`)
                inserter.insertAdjacentHTML("afterbegin",`
                <div  style="background:yellow; margin-left:20px; margin-bottom:20px;" >
                    <p><small>${response.comment[0].comment}</small></p>
                    <p>${response.comment[0].author}</p>
                </div>`)
                console.log(response)
                console.log(response.comment[0].comment)*/




/*
          //Takes care of comments on new messages
            form_ = document.getElementById(`${message.post_id}f`)
            form_.addEventListener('submit', e_=> {
                submittedMessageId = e_.target.getAttribute("text_area_id")
                //console.log(submittedMessageId)
                e_.preventDefault()
                comment = document.getElementById(submittedMessageId)
                console.log(comment)

                if (comment !=null){
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
               */
          //end of Take



 /* const getCookie = (name) => {
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
*/






// THE ONE I REMOVED LATEST FROM d.js
// Dates are used for setting the time from django's JsonResponse to javascript
months =["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]

//1) A LISTENER IS ADDED TO FORM TO CREATE A NEW MESSAGE SUBMISSION USING AJAX
// comment_no is part of the id of each form that is created by ajax
comment_no = 1

form = document.getElementById("form")
// replace  the first uncommented line with line below, if you want to use jquery.
// $(document).on('submit', '#form', function(e){

form.addEventListener('submit', e=>{
    //const submittedId = e.target.getAttribute("text_area_id")
    //const comment = document.getElementById(submittedId)
    e.preventDefault(); //preventing default action

    // Takes care of creating a new message
    $.ajax({
        type:'POST',
        url: "/create_new_message/",
        data: {
            body: $('#id_body').val(),
            //description: $('#description').val(),
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            //comment: comment
        },
        success: function(response){
            const data = response.message
            data.forEach(
                message=>{
                    date = new Date(message.created)
                    mother = document.getElementById("s")
                    mother.insertAdjacentHTML('afterbegin',
                         // NEW MESSAGE AND ITS PROPERTIES
                        `<div style="background:orange;">
                             <!--// message-->
                            <small>${months[date.getMonth()]}. ${date.getDate()}, ${date.getFullYear()}</small>
                                <p>${message.body}</p>
                            <small>${message.author}</small>
                              <!--// comment button-->
                            <button id="${message.post_id}b"
                            onclick="showHideForm('${message.post_id}b','${message.post_id}cf','Comment')">
                            comment</button>
                            <form id="${message.post_id}cf" text_area_id="${message.post_id}" style="display:none;" method="GET">
                                <textarea id="${message.post_id}"></textarea>
                                <input type="submit">
                            </form>
                            <small id="jbc_on_${message.post_id}_" >${date.getHours()}:${date.getMinutes()}
                             ${date.getHours()>=12? "p.m.": "a.m."} </small>

                             <!--// like button-->
                             <!-- NB: The acronyms {b: button, lb: like button, lf: like form, cf: comment form, sl: show like} -->
                             ${message.user == message.author ?
                                `<form id='${message.post_id}lf' like_id='${message.post_id}lb' class='likes' method='POST'>
                                    <button id='${message.post_id}lb' type='submit' name='post_id' value='${message.post_id}' class='btnprimary'>
                                            Like
                                    </button>
                                    <small id="${message.post_id}sl"> .${message.likes_total} Likes </small>
                                </form>`
                                :
                                ` `
                             }
                            <hr>
                        <div>`
                        )

                })
          document.getElementById("form").reset()
          comment_no+=1

          addComment(response)
          likeUnlike(response)
        },
        error: function(error){

        }
    });






 // previous javascript with django as displayer of messages can be obtained by adding (1) using the above code and removing (1)a

 // this takes care of the django csrf-token

csrf = document.getElementsByName("csrfmiddlewaretoken")
console.log('csrf', csrf)

// Dates are used for setting the time from django's JsonResponse to javascript
months =["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]

//1) A LISTENER IS ADDED TO FORM WITH ID="FORM" TO CREATE A NEW MESSAGE SUBMISSION USING AJAX
// comment_no is part of the id of each form that is created by ajax
comment_no = 1

form = document.getElementById("form")
// replace  the first uncommented line with line below, if you want to use jquery.
// $(document).on('submit', '#form', function(e){

form.addEventListener('submit', e=>{
    //const submittedId = e.target.getAttribute("text_area_id")
    //const comment = document.getElementById(submittedId)
    e.preventDefault(); //preventing default action

    // Takes care of creating a new message
    $.ajax({
        type:'POST',
        url: "/create_new_message/",
        data: {
            body: $('#id_body').val(),
            //description: $('#description').val(),
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            //comment: comment
        },
        success: function(response){
            const data = response.message

          document.getElementById("form").reset()
          comment_no+=1

          //addComment(response)
          //likeUnlike(response)
        },
        error: function(error){

        }
    });


})


// 1a) Displays all messages
$(document).ready(function(){
// setInterval(function displayAllMessages(){
    $.ajax({
        type: "POST",
        url: "/display_all_messages/5",
        data: {
            'csrfmiddlewaretoken': csrf[0].value
        },

        success: function(response){
            data = response.message
            data.forEach( message=> {
                date = new Date(message.created)
                    mother = document.getElementById("s")
                    mother.insertAdjacentHTML('afterbegin',
                         // NEW MESSAGE AND ITS PROPERTIES
                        `<div style="background:orange;">
                             <!--// message-->
                            <small>${months[date.getMonth()]}. ${date.getDate()}, ${date.getFullYear()}</small>
                                <p>${message.body}</p>
                            <small>${message.author}</small>
                              <!--// comment button-->
                            <button id="${message.post_id}b"
                            onclick="showHideForm('${message.post_id}b','${message.post_id}cf','Comment')">
                            comment</button>
                            <form id="${message.post_id}cf" text_area_id="${message.post_id}" style="display:none;" method="GET">
                                <textarea id="${message.post_id}"></textarea>
                                <input type="submit">
                            </form>
                            <small id="jbc_on_${message.post_id}_" >${date.getHours()}:${date.getMinutes()}
                             ${date.getHours()>=12? "p.m.": "a.m."} </small>

                             <!--// like button-->
                             <!-- NB: The acronyms {b: button, lb: like button, lf: like form, cf: comment form, sl: show like} -->
                             ${message.user == message.author ?
                                `<form id='${message.post_id}lf' like_id='${message.post_id}lb' class='likes' method='POST'>
                                    <button id='${message.post_id}lb' type='submit' name='post_id' value='${message.post_id}' class='btnprimary'>
                                            Like
                                    </button>
                                    <small id="${message.post_id}sl"> .${message.likes_total} Likes </small>
                                </form>`
                                :
                                ` `
                             }
                            <hr>
                        <div>`
                        )

                })
          document.getElementById("form").reset()
          comment_no+=1

        },
        error: function(error){

        }
    })

// }, 1000)

})


// 2) This takes care of imputing and outputting comments from already existing messages to screen in Ajax format
comment_forms = [...document.getElementsByClassName("comment_form")]
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



// 3) Add comment comments on new message
function addComment(response){
    message = response.message[0]
    //console.log(response)
// Takes care of adding comments on the new message
    form_ = document.getElementById(`${message.post_id}cf`)
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

// 4) Takes care of like or unliking a message
function likeUnlike(response){
    message = response.message[0]
    form_ = document.getElementById(`${message.post_id}lf`)
    form_.addEventListener('submit', function(e){
        e.preventDefault()
        clickedId = e.target.getAttribute("like_id")
        likeButton = document.getElementById(clickedId)

        $.ajax({
            type: "POST",
            url: `/update_like/${message.post_id}/${message.forum_id}/1`,
            data: {
                post_id : likeButton.value,

                "csrfmiddlewaretoken" : csrf[0].value
            },
            success: function(response){
                console.log("succeeded")
                likeToUpdate = document.getElementById(`${message.post_id}sl`)
                likeToUpdate.innerHTML = `.${response.message[0].likes_total} Likes`
            },
            error: function(response){
                console.log("failed")
                //console.log(likeButton.value)
            }
        })

    })


}






})




/////////////////// THE LAAST ONE

// this takes care of the django csrf-token

csrf = document.getElementsByName("csrfmiddlewaretoken")
console.log('csrf', csrf)

// Dates are used for setting the time from django's JsonResponse to javascript
months =["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]

//1) A LISTENER IS ADDED TO FORM WITH ID="FORM" TO CREATE A NEW MESSAGE SUBMISSION USING AJAX
// comment_no is part of the id of each form that is created by ajax
comment_no = 1

form = document.getElementById("form")
// replace  the first uncommented line with line below, if you want to use jquery.
// $(document).on('submit', '#form', function(e){

form.addEventListener('submit', e=>{
    //const submittedId = e.target.getAttribute("text_area_id")
    //const comment = document.getElementById(submittedId)
    e.preventDefault(); //preventing default action

    // Takes care of creating a new message
    $.ajax({
        type:'POST',
        url: "/create_new_message/",
        data: {
            body: $('#id_body').val(),
            //description: $('#description').val(),
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            //comment: comment
        },
        success: function(response){
            const data = response.message

          document.getElementById("form").reset()
          comment_no+=1

          //addComment(response)
          //likeUnlike(response)
        },
        error: function(error){

        }
    });


})


// 1a) Displays all messages
$(document).ready(function(){


setInterval(function displayAllMessages(){

    $.ajax({
        type: "POST",
        url: "/display_all_messages/5",
        data: {
            'csrfmiddlewaretoken': csrf[0].value
        },

        success: function(response){
            data = response.message
            d = document.getElementById("ds")
            //$("#ds").empty()
            /*if (d != null){
                d.remove()
            }*/
            d.innerHTML = ""
            data.forEach( message=> {
                date = new Date(message.created)
                    mother = document.getElementById("s")

                    //mother.insertAdjacentHTML('afterbegin',
                         // NEW MESSAGE AND ITS PROPERTIES
                    d.innerHTML +=
                        `<div id="ds" style="background:orange;">
                             <!--// message-->
                            <small>${months[date.getMonth()]}. ${date.getDate()}, ${date.getFullYear()}</small>
                                <p>${message.body}</p>
                            <small>${message.author}</small>
                              <!--// comment button-->
                            <button id="${message.post_id}b"
                            onclick="showHideForm('${message.post_id}b','${message.post_id}cf','Comment')">
                            comment</button>
                            <form id="${message.post_id}cf" text_area_id="${message.post_id}" style="display:none;" method="GET">
                                <textarea id="${message.post_id}"></textarea>
                                <input type="submit">
                            </form>
                            <small id="jbc_on_${message.post_id}_" >${date.getHours()}:${date.getMinutes()}
                             ${date.getHours()>=12? "p.m.": "a.m."} </small>

                             <!--// like button-->
                             <!-- NB: The acronyms {b: button, lb: like button, lf: like form, cf: comment form, sl: show like} -->
                             ${message.user == message.author ?
                                `<form id='${message.post_id}lf' like_id='${message.post_id}lb' class='likes' method='POST'>
                                    <button id='${message.post_id}lb' type='submit' name='post_id' value='${message.post_id}' class='btnprimary'>
                                            Like
                                    </button>
                                    <small id="${message.post_id}sl"> .${message.likes_total} Likes </small>
                                </form>`
                                :
                                ` `
                             }
                            <hr>
                        <div>`


                })
          //document.getElementById("form").reset()
          comment_no+=1

        },
        error: function(error){

        }
    })

}, 10)

})


// 2) This takes care of imputing and outputting comments from already existing messages to screen in Ajax format
comment_forms = [...document.getElementsByClassName("comment_form")]
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



// 3) Add comment comments on new message
function addComment(response){
    message = response.message[0]
    //console.log(response)
// Takes care of adding comments on the new message
    form_ = document.getElementById(`${message.post_id}cf`)
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

// 4) Takes care of like or unliking a message
function likeUnlike(response){
    message = response.message[0]
    form_ = document.getElementById(`${message.post_id}lf`)
    form_.addEventListener('submit', function(e){
        e.preventDefault()
        clickedId = e.target.getAttribute("like_id")
        likeButton = document.getElementById(clickedId)

        $.ajax({
            type: "POST",
            url: `/update_like/${message.post_id}/${message.forum_id}/1`,
            data: {
                post_id : likeButton.value,

                "csrfmiddlewaretoken" : csrf[0].value
            },
            success: function(response){
                console.log("succeeded")
                likeToUpdate = document.getElementById(`${message.post_id}sl`)
                likeToUpdate.innerHTML = `.${response.message[0].likes_total} Likes`
            },
            error: function(response){
                console.log("failed")
                //console.log(likeButton.value)
            }
        })

    })


}








// (1a) Takes care of messages entered by other persons other than the current user

$(document).ready(function(){
//setInterval(function displayAllMessages(){
    forum_div = document.querySelectorAll("div")[2]
    forum_id = forum_div.getAttribute("_forum_id")
    console.log(forum_id)
    new_message = document.getElementById("submit_new_message")
    if
    new_message.addEventListener('submit', )

    $.ajax({
        type: "POST",
        url: "/display_all_messages/",
        data: {
            'csrfmiddlewaretoken': csrf[0].value
        },

        success: function(response){
            data = response.message
            d = document.getElementById("s")
            //$("#ds").empty()
            //*if (d != null){
            //    d.remove()
            //}
            d.innerHTML = ""
            data.forEach( message=> {
                date = new Date(message.created)
                    mother = document.getElementById("s")

                    //mother.insertAdjacentHTML('afterbegin',
                         // NEW MESSAGE AND ITS PROPERTIES
                    if (message.forum_id==forum_id){
                        d.innerHTML +=
                            `<div id="ds" style="background:orange;">
                                 <!--// message-->
                                <small>${months[date.getMonth()]}. ${date.getDate()}, ${date.getFullYear()}</small>
                                    <p>${message.body}</p>
                                <small>${message.author}</small>
                                  <!--// comment button-->
                                <button id="${message.post_id}b"
                                onclick="showHideForm('${message.post_id}b','${message.post_id}cf','Comment')">
                                comment</button>
                                <form id="${message.post_id}cf" text_area_id="${message.post_id}" style="display:none;" method="GET">
                                    <textarea id="${message.post_id}"></textarea>
                                    <input type="submit">
                                </form>
                                <small id="jbc_on_${message.post_id}_" >${date.getHours()}:${date.getMinutes()}
                                 ${date.getHours()>=12? "p.m.": "a.m."} </small>

                                 <!--// like button-->
                                 <!-- NB: The acronyms {b: button, lb: like button, lf: like form, cf: comment form, sl: show like} -->
                                 ${message.user == message.author ?
                                    `<form id='${message.post_id}lf' like_id='${message.post_id}lb' class='likes' method='POST'>
                                        <button id='${message.post_id}lb' type='submit' name='post_id' value='${message.post_id}' class='btnprimary'>
                                                Like
                                        </button>
                                        <small id="${message.post_id}sl"> .${message.likes_total} Likes </small>
                                    </form>`
                                    :
                                    ` `
                                 }
                                <hr>
                            <div>`
                    }

                })
          //document.getElementById("form").reset()
          comment_no+=1

        },
        error: function(error){

        }
    })

//}, 1000)

})

































# NEwest
// this takes care of the django csrf-token
csrf = document.getElementsByName("csrfmiddlewaretoken")
console.log('csrf', csrf)

// Dates are used for setting the time from django's JsonResponse to javascript
months =["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]

//1) A LISTENER IS ADDED TO FORM WITH ID="FORM" TO CREATE A NEW MESSAGE SUBMISSION USING AJAX
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
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
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
        data.forEach( message=> {
            date = new Date(message.created)
            mother = document.getElementById("s")
            if(mother==null){
            mother = document.createElement("hr")
            mother.setAttribute("id", "s")
            }

            console.log(mother)
            messageHtml(mother, message)
        })

      addComment(response)
      //likeUnlike(response)

      document.getElementById("form").reset()
      comment_no+=1

}


//1b) Takes care of messages by other users
var previous_post_id = 0

//form.addEventListener('submit', e=> {
 //   setInterval(function displayAllMessages(){
        //forum_div = document.querySelectorAll("div")[2]
        //forum_id = forum_div.getAttribute("_forum_id")
        //console.log(forum_id)
        //new_message = document.getElementById("submit_new_message")
        //if
        //new_message.addEventListener('submit', )
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
                    }
                    console.log(mother)

                    date = new Date(message.created)

                    if (user != message.author){
                        messageHtml(mother, response.message[0])
                    }

                    //document.getElementById("form").reset()
                    comment_no+=1
                    addComment(response)
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

   // }, 100)

//})
//})

/*// (1b) Takes care of messages posted by others
function displayMessageByOthers(response){
//setInterval(function displayAllMessages(){
    forum_div = document.querySelectorAll("div")[2]
    forum_id = forum_div.getAttribute("_forum_id")
    console.log(forum_id)
    //new_message = document.getElementById("submit_new_message")
    // new_message.addEventListener('submit', )
    const data = response.message
    data.forEach( message=>{
    date = new Date(message.created)
        mother = document.getElementById("s")
        if(mother==null){
        mother = document.createElement("div")
        mother.setAttribute("id", "s")
        }
        console.log(mother)
        messageHtml(mother, message)
    })

        addComment(response)
        likeUnlike(response)

        document.getElementById("form").reset()
        comment_no+=1
//}, 1000)

}*/


function messageHtml(mother, message){
    mother.insertAdjacentHTML('afterbegin',
         // NEW MESSAGE AND ITS PROPERTIES
        `<div id="conversation_${message.post_id}" style="background:orange;">
             <!--// message-->
            <small>${months[date.getMonth()]}. ${date.getDate()}, ${date.getFullYear()}</small>
                <p>${message.body}</p>
            <small>${message.author}</small></br>

            <small id="jbc_on_${message.post_id}_" >${date.getHours()}:${date.getMinutes()}
             ${date.getHours()>=12? "p.m.": "a.m."} </small>

             <!--// like button-->
             <!-- NB: The acronyms {b: button, lb: like button, lf: like form, cf: comment form, sl: show like} -->

             <form class='like_form' id='${message.post_id}lf' forum_id='${message.forum_id}' like_id='${message.post_id}lb'  method='POST'>
                <button id='${message.post_id}lb' type='submit' name='post_id' value='${message.post_id}' class='btnprimary'>
                        Like
                </button>
                <small id="${message.post_id}sl"> .${message.likes_total} Likes </small>
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

}


// 2) This takes care of imputing and outputting comments from already existing messages to screen in Ajax format
comment_forms = [...document.getElementsByClassName("comment_form")]
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



// 3) Add comment comments on new message
function addComment(response){
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

// 4) Takes care of like or unliking a message
/* function likeUnlike(response){
    message = response.message[0]
    form_ = document.getElementById(`${message.post_id}lf`)
    if( form_!=null){
        form_.addEventListener('submit', function(e){
            e.preventDefault()
            clickedId = e.target.getAttribute("like_id")
            likeButton = document.getElementById(clickedId)

            $.ajax({
                type: "POST",
                url: `/update_like/${message.post_id}/${message.forum_id}/1`,
                data: {
                    post_id : likeButton.value,

                    "csrfmiddlewaretoken" : csrf[0].value
                },
                success: function(response){
                    console.log("succeeded")
                    likeToUpdate = document.getElementById(`${message.post_id}sl`)
                    likeToUpdate.innerHTML = `.${response.message[0].likes_total} Likes`
                },
                error: function(response){
                    console.log("failed")
                    //console.log(likeButton.value)
                }
            })

        })
    }

}*/



// 5) Takes care of liking already existing messages NB: lbe means "like button for existing an message"
like_forms = [...document.getElementsByClassName("like_form")]
like_forms.forEach(function(form){
    form.addEventListener('submit', function(e){
        e.preventDefault()
        messageId = e.target.getAttribute('message_id') // this attribute belongs to the like_form
        console.log(messageId)
        likeButton = document.getElementById(`${messageId}lbe`)
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
                displayLikes = document.getElementById(`${messageId}sle`)
                displayLikes.innerHTML = `. ${response.message[0].likes_total} Likes`

            },
            error: function(response){
                console.log("failed")
            }
        })
    })

})

/*
// Takes care of updating likes from other users
like_forms = [...document.getElementsByClassName('like_form')]
//console.log("form length", like_forms.length)
like_forms.forEach( form__ => {
    form__.addEventListener('submit', e=>{
        //e.preventDefault()
        //setInterval( function d (){
            $.ajax({
                type: 'GET',
                url: '/update_all_users_like/',

                success: function(response){
                    data = response.messages
                    data.forEach(message=>{
                        //button = document.getElementById(`${message.post_id}sle`)

                        //button.innerHTML = ` . ${message.likes_total} Likes`
                        console.log(`${message.post_id`})
                    })
                },

                error: function(error){
                    console.log(error)
                }
            })

        //} ,1000)
    })
});
*/

like_forms = [...document.getElementsByClassName('like_form')]
//console.log("form length", like_forms.length)
like_forms.forEach( form_ => {
    form_.addEventListener('submit', e=>{
        //e.preventDefault()
              //setInterval( function d (){
            $.ajax({
                type: "GET",
                url: "/update_all_users_like/",
                success: function(response){
                    console.log("good")
                    //button = document.getElementById(`${message.post_id}sle`)

                        //button.innerHTML = ` . ${message.likes_total} Likes`
                },
                error: function(error){
                    console.log(error)

                }

            })

        //} ,1000)

    })
});
