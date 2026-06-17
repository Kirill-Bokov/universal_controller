class MousePlugin {
    constructor(controller, target = window) {
        this.controller = controller
        //this.mouseDown = this.mouseDown.bind(this)
        //this.mouseUp = this.mouseUp.bind(this)
        //this.pressedButtons = new Set()
        this.target = target
    }

    mouseOn() {
        console.log("подключена мышь")
        this.controller.pluginOn("mouse")
        this.target.addEventListener('mousedown', this.mouseDown)
        this.target.addEventListener('mouseup', this.mouseUp)
    }

    mouseOff() {
        console.log("отключена мышь")
        this.controller.pluginOff("mouse")
        this.target.removeEventListener('mousedown', this.mouseDown)
        this.target.removeEventListener('mouseup', this.mouseUp)
    }

    mouseDown(event) {
        console.log("мышкой нажали")
        let keyCode = event.button
        this.controller.keyDown(keyCode)
    }
    mouseUp(event) {
        console.log("мышку отжали")
        let keyCode = event.button
        this.controller.keyUp(keyCode)
    }
}
