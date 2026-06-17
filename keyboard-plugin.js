class KeyboardPlugin {
    constructor(controller, target = window) {
        this.controller = controller
        //this.mouseDown = this.mouseDown.bind(this)
        //this.mouseUp = this.mouseUp.bind(this)
        this.pressedKeys = new Set()
        this.target = target
    }

    keyboardOn() {
        this.controller.pluginOn("keyboard")
        this.target.addEventListener('keydown', this.keyDown)
        this.target.addEventListener('keyup', this.keyUp)
    }

    keyboardOff() {
        this.controller.pluginOff("keyboard")
        this.target.removeEventListener('keydown', this.keyDown)
        this.target.removeEventListener('keyup', this.keyUp)
        constructor.pressedKeys.clear()
    }

    keyDown(event) {
        let keyCode = event.keyCode
        this.controller.keyDown(keyCode)

    }
    keyUp(event) {
        let keyCode = event.keyCode
        this.controller.keyUp(keyCode)
    }

    isKeyPressed(keyCode) {
        console.log("метод isKeyPressed вызван")
        if (this.pressedKeys.has(keyCode)) {
        }
        return this.pressedKeys.has(keyCode)
    }

}
