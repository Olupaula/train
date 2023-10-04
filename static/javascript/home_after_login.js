
// Loading the home page - allowing every components load before displaying the home page.
// home_page = document.getElementById("home_page")
// home_page.addEventListener('load', e=>{
    //e.preventDefault()
    original = document.body.innerHTML

    document.body.innerHTML =
    `   <div id="temp_header">
        </div>
        <div id="temp_header_sub"></div>
        <div id="d_train"> D-T</div>
        <div id='loading_bar_1'></div>
        <div id='loading_bar_2'></div>
        <div id='loading_bar_3'></div>
    `

    setTimeout(loadBody, 4000)

function loadBody(){
    document.body.innerHTML = original
    document.body.style= "display: block;"
    //alert("I am working")
// provides the first letter in the home_profile_div

   var home_profile_div = document.getElementsByClassName("home_profile_div")

    for(let i=0; i<home_profile_div.length; i++){
        if (home_profile_div){
           // document.body.addEventListener("load", e=>{
               home_profile_div[i].innerHTML = home_profile_div[i].innerHTML.trim().substring(0,1)
               //alert(home_profile_div[i].innerHTML)
                //let g = "me"
                //alert(g.substring(0,1))
            //})
        }
    }

// provides the first letter in the first home_profile_div
    var home_profile_div = document.getElementsByClassName("home_profile_div_first")
    for(let i=0; i<home_profile_div.length; i++){
        if (home_profile_div){
               home_profile_div[i].innerHTML = home_profile_div[i].innerHTML.trim().substring(0,1)
        }
    }

}





