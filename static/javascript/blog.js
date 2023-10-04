var loader = document.getElementById("load_more")
var items = [...document.getElementsByClassName("items")]


// loader that rolls before other messages are displayed when load more is clicked
loader.addEventListener("click", e=>{
    loader.remove()

    items[0].insertAdjacentHTML('afterend',
    `
        <div class="loading_circle">

        </div>
    `)


    // the loading_circle while waiting
    //loading_circle = document.createElement('div')
    //loading_circle.setAttribute("class", "loading_circle")

    setTimeout(loadMoreItems, 1000)

    function loadMoreItems(){
        items.forEach(item=>{
             item.style= `
                display: grid;
                grid-template-columns: 1fr 12fr;
            `
        })
        let loader_cycle = document.getElementsByClassName("loading_circle")[0]
        loader_cycle.style.display = "none"

        // the load more button
        items[items.length-1].insertAdjacentHTML('afterend',
        `   <div id="load_more">
                ${loader.innerHTML}
            </div>
        `
        )

    }
})



 // provides the first letter in the blog_profile_div
    let blog_profile_div = document.getElementsByClassName("blog_profile_div")
    for(let i=0; i<blog_profile_div.length; i++){
        if (blog_profile_div){
           // document.body.addEventListener("load", e=>{
               blog_profile_div[i].innerHTML = blog_profile_div[i].innerHTML.trim().substring(0,1)
               //alert(blog_profile_div[i].innerHTML)
                //let g = "me"
                //alert(g.substring(0,1))
            //})
        }
    }