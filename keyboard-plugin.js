class KeyboardPlugin {
    constructor(controller, target = window) {
        this.controller = controller
        //this.mouseDown = this.mouseDown.bind(this)
        //this.mouseUp = this.mouseUp.bind(this)
        //this.pressedButtons = new Set()
        this.target = target
    }

    keyboardOn() {
        console.log("подключена клава")
        this.controller.pluginOn("keyboard")
        this.target.addEventListener('keydown', this.keyDown)
        this.target.addEventListener('keyup', this.keyUp)
    }

    keyboardOff() {
        console.log("отключена клава")
        this.controller.pluginOff("keyboard")
        this.target.removeEventListener('keydown', this.keyDown)
        this.target.removeEventListener('keyup', this.keyUp)
        constructor.pressedKeys.clear()
    }

    keyDown(event) {
        console.log("клавишу нажали")
        let keyCode = event.keyCode
        this.controller.keyDown(keyCode)
        
    }
    keyUp(event) {
        console.log("клавишу отжали")
        let keyCode = event.keyCode
        this.controller.keyUp(keyCode)
    }
}
