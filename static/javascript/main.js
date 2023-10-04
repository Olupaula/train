import { showMessageBox, closeMessageBox }  from './utilities.js';
//imports

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


/*open_close_comment = document.getElementById(`${submittedMessageId}b`)
comment_div = document.getElementsByClassName(`${submittedMessageId}cdiv`)
console.log(open_close_comment.innerHTML)*/



/*
function removeEndYear(){
    current_ticked = document.getElementById("tick"); // Checking if the current year is ticked
    const end_year_input = document.getElementById("id_end_year")
    const end_year_label = document.getElementById("End year")
    // If the checkbox is unchecked
   if (current_ticked.checked==false){
         //alert("unchecked");
         form = document.getElementById("empCredForm")

         //form.appendChild(end_year_label); NB: The comment code was said to work by W3school but didn't work for me
         //form.appendChild(end_year_input);

         // Putting back the label
         const end_year_label = document.createElement("p");
         const end_year_text = document.createTextNode("End Year");
         end_year_label.appendChild(end_year_text);
         end_year_label.setAttribute('id','End year')
         form.insertBefore(end_year_label, form.children[9])

         // Putting back the input
         const end_year_input = document.createElement("input");
         end_year_input.setAttribute('type', 'date');
         end_year_input.setAttribute('id', 'id_end_year');
         form.insertBefore(end_year_input, form.children[10])
         }

    // If the checkbox is checked
    else{
        //alert("checked");
        //end_year_input.parentNode.removeChild(end_year_input) NB: Goes with the above by w3school
        //end_year_label.parentNode.removeChild(end_year_label)

         end_year_input.remove()
         end_year_label.remove()
         current_ticked.checked = true;
    }
}

*/


function removeEndYear(tick_id, label_id, input_id, form_id, reference_child_no){
    current_ticked = document.getElementById(tick_id); // Checking if the current year is ticked
    const end_year_input = document.getElementById(input_id)
    const end_year_label = document.getElementById(label_id)
    // If the checkbox is unchecked
   if (current_ticked.checked==false){
         //alert("unchecked");
         form = document.getElementById(form_id)

         //form.appendChild(end_year_label); NB: The comment code was said to work by W3school but didn't work for me
         //form.appendChild(end_year_input);

         // Putting back the label
         const end_year_label = document.createElement("p");
         const end_year_text = document.createTextNode(label_id);
         end_year_label.appendChild(end_year_text);
         end_year_label.setAttribute('id',label_id)
         form.insertBefore(end_year_label, form.children[parseInt(reference_child_no)])

         // Putting back the input
         const end_year_input = document.createElement("input");
         end_year_input.setAttribute('type', 'date');
         end_year_input.setAttribute('id', input_id);
         form.insertBefore(end_year_input, form.children[parseInt(reference_child_no)+1])
         }

    // If the checkbox is checked
    else {
        //alert("checked");
        //end_year_input.parentNode.removeChild(end_year_input) NB: Goes with the above by w3school
        //end_year_label.parentNode.removeChild(end_year_label)

         end_year_input.remove()
         end_year_label.remove()
         current_ticked.checked = true;
    }
};


//  AJAX SECTION

//const loadBtn = document.getElementById("loadBtn");
//endBox = document.getElementById("endbox")


// this takes care of the django csrf-token
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


// Handles Questioning
var questioner = document.getElementById("questions")

if (questioner != null){
    questioner.addEventListener('click', e=>{
        showMessageBox('question')
    })
}

//import {showMessageBox, closeMessageBox} from './utilities.js'

// Handles answers given to question
var answers = [...document.getElementsByClassName("answers")]

if (answers != null){
    answers.forEach( answer=>{
        answer.addEventListener('click', e=>{
            let question_id = e.target.getAttribute('id')
            showMessageBox('answer', question_id)
        })
    })
}


// Handles non-forum-posts
var post = document.getElementById("non-forum-post")

if (post != null){
    post.addEventListener('click', e=>{
        showMessageBox('post')
    })
}




//alert("I am working")

// account_menu_container



// the following 'if' is coming in because of the loader than comes before the home to avoid error.
setTimeout(loadLoginIcon, 4003)

function loadLoginIcon(){
let login_icon = document.getElementById("login_button")
    login_icon.addEventListener('click', e=>{
        let menu_content = document.getElementsByClassName("account_menu_content")[0]

        if (menu_content.style.display == "none"){
            menu_content.style.display = "block"
        }
        else {
            menu_content.style.display ="none"
        }
        //alert("I am working")
        //.account_menu_container:hover .account_menu_content{
        //display: block;
    })
}


function me(){
    alert('great!');
}





