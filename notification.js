export default class Notification{
    constructor(page, text, color){
        let container = page.getElementById("notifications")
        if(container == null){
            container = page.createElement("div")
            container.id = "notifications"
            container.classList.add("notifications")
            page.body.append(container)
        }
        let notifciation = page.createElement("div")
        notifciation.classList.add("notificiation")
        notifciation.textContent = text
        container.append(notifciation)
        setTimeout(function(){
            notifciation.remove()
        }, 3000)
    }
}