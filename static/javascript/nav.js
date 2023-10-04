
notification_image = document.getElementById("notification_image")
notification_div = document.getElementsByClassName("notification_div")
notification_red_cap = document.getElementById("red_cap")

// When the page loads, show notification: number of notice by a white text on red background called red-cap
notification_image.addEventListener('load', e=>{
    e.preventDefault()

    $.ajax({
        url: '/read_unread_notifications/',
        success: function(response){
            let unread_notifications = response.unread_notifications
            //let display_parameter = response.display_parameter
            //alert(unread_notifications)
            //
                // provided that the number of unread_notifications is not 0, show the red-cap
                if ( unread_notifications > 0){
                    notification_red_cap.innerHTML = unread_notifications
                    notification_red_cap.style = "display: inline"

                    notification_image.addEventListener('click', e=>{
                        $.ajax({
                            url: '/update_unread_notifications/',
                            data: {
                                unread_notifications: 0,
                            },
                            success: function(response){
                                /* let unread_notifications = response.unread_notifications
                                notification_red_cap.innerHTML = unread_notifications
                                notification_red_cap.style = "display: inline" */

                            },

                            error: function(error){

                            }
                        })
                    //
                    })
                }

                // else if the number of notification is 0 remove the red-cap
                else {
                    notification_red_cap.style = "display: none;"
                    // alert('correct')
                }
            //})
        },
        error: function(error){

        }

    })
})

