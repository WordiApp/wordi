export default class Notification{
    constructor(page, text, duration, background_color, text_color){
        // Declares the notification container or sets it up if it doesn't exist
        let container = page.getElementById("notifications")
        if(container == null){
            container = page.createElement("div")
            container.id = "notifications"
            container.classList.add("notifications")
            page.body.append(container)
        }
        if(duration == null){
            duration = 5
        }
        // Creates Notification
        let notifciation = page.createElement("div")
        notifciation.classList.add("notification")
        notifciation.textContent = text
        // Optional Color Scheming
        if (background_color != null){notifciation.style.backgroundColor = background_color}
        if (text_color != null){notifciation.style.color = text_color}
        // Displays notification
        let fade_in_time = Math.min(duration/10, 1)
        let fade_out_time = Math.min(duration/2, 3)
        notifciation.style.animation = "slideIn " + fade_in_time + "s ease forwards, fadeOut " + fade_out_time + "s ease " + (duration - fade_in_time - fade_out_time) + "s forwards"
        container.append(notifciation)
        // Removes after X seconds
        setTimeout(function(){
            notifciation.remove()
        }, duration*1000)
    }
}