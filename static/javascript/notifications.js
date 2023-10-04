// provides the first letter in the blog_profile_div
// alert("d")
    let notification_profile_div = document.getElementsByClassName("notification_profile_div")
    for(let i=0; i<notification_profile_div.length; i++){
        if (notification_profile_div){
           // document.body.addEventListener("load", e=>{
               notification_profile_div[i].innerHTML = notification_profile_div[i].innerHTML.trim().substring(0,1)
               //alert(blog_profile_div[i].innerHTML)
                //let g = "me"
                //alert(g.substring(0,1))
            //})
        }
    }