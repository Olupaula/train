// Loading the home page - allowing every components load before displaying the home page.
window.location.href = "/"
//setTimeout(loadBody, 4000)

/* function loadBody(){
    window.location.href = ""
}
*/


/*
original = document.body.innerHTML
setTimeout(loadBody, 4000)

document.body.innerHTML =
    `   <div id="temp_header">

        </div>
        <div id="temp_header_sub"></div>
        <div id="d_train"> D-T</div>
        <div id='loading_bar_1'></div>
        <div id='loading_bar_2'></div>
        <div id='loading_bar_3'></div>

    `
*/


function loadBody(){
    //document.body.innerHTML = original
    window.location.href= "/"
}