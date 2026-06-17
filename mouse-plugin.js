class MousePlugin {


    constructor(controller, target = window) {
        this.mouseDown = this.mouseDown.bind(this)
        this.mouseUp = this.mouseUp.bind(this)
        this.pressedButtons = new Set()
        this.target = target
        this.mouseOn
    }

    mouseOn() {
        console.log("подключена мышь")
        this.pluginOn("mouse")
        this.target.addEventListener('mousedown', this.mouseDown)
        this.target.addEventListener('mouseup', this.mouseUp)

    }

    mouseOff() {
        console.log("отключена мышь")
        this.pluginOff("mouse")
        this.target.removeEventListener('mousedown', this.mouseDown)
        this.target.removeEventListener('mouseup', this.mouseUp)
    }




}