/**
the utilities.js handle common operations that may be repeated across several files
**/

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


// Handles pop boxes
//**** Next task is to add item to showMessageBox. If item=question, editing text, uploading gifs and images are not allowed else if item=[post, answer] they are allowed
//
function showMessageBox(item, question_id=null){
  // shows the message box (text-area)
    var message_div = document.createElement("div")

    message_div.innerHTML =
    `<img id="create_or_edit_message_box_closer" src="/static/images/close.png" height="15px" width="15px" style="float: right; margin-bottom: 10px; margin-right:20px">
        <form id="create_or_edit_message_form" method="POST" ${ item == 'question'? `action=/questions/` : `${ item == 'answer'? `action=/answers/${question_id}` : `` }` } enctype="multipart/form-data">
            <input type="hidden" name="csrfmiddlewaretoken"  value=${csrftoken} >
            <textarea id="create_or_edit_message_body" name=${item=="question"? "question" : "message"} cols=80 rows=25 ></textarea>
            <div>
                ${ item == "question" ?
                ``
                :
                 `
                <input id="input_upload_image" name="images" type="file" src="/static/images/image.png" height="22px" width="22px" style="float: left; margin-bottom: 10px; margin-left:10px;">

                <input id="edit_text" type="image" src="/static/images/letter-a.png" height="22px" width="22px" style="float: left; margin-bottom: 10px; margin-left:20px">
                <label for=edit_text>
                    <image id="upload_image" type="image" src="/static/images/image.png" height="22px" width="22px" style="float: left; margin-bottom: 10px; margin-left:10px">
                </label>
                <input id="upload_gif" type="image" src="/static/images/gif-file.png" height="22px" width="22px" style="float: left; margin-bottom: 10px; margin-left:10px">
                `
                }
                <input id="submit_creation_or_edition" type="submit" ${ item == 'question' ? `value="Ask"`:   `value="save"`}>
                <!--//<button id="cancel_edition">cancel</button>-->
            </div>
        </form>
        `
   message_div.setAttribute("class", "create_or_edit_message_box")
   //message_div.style=`margin: ${screen.availWidth - 250}px;`

    //alert(response)


   var new_darker = document.createElement("div")
   new_darker.setAttribute("class", "screen-darker")

   document.body.append(message_div)
   document.body.append(new_darker)

   // if the load image button is clicked, bring a pop-menu that allows for selection of desired image

   if (item != 'question'){
       var load_image = document.getElementById("upload_image")
       load_image.addEventListener('click', e=>{
            e.preventDefault()
            loader = document.getElementById("input_upload_image")
            loader.click()

       })
   }


    var closer = document.getElementById("create_or_edit_message_box_closer")
    closer.addEventListener("click", e=>{
        closeMessageBox(message_div, new_darker)
    })


}


// Takes care of closing the message box
function closeMessageBox(message_div, new_darker){
    //let message_div = document.getElementById(message_div)
    message_div.remove()
    new_darker.remove()
    document.body.setAttribute("style", "overflow:scroll;")

}

export {showMessageBox, closeMessageBox}