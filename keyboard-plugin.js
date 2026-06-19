class KeyboardPlugin {
    constructor(controller, target = window) {
        this.controller = controller
        //this.mouseDown = this.mouseDown.bind(this)
        //this.mouseUp = this.mouseUp.bind(this)
        this.pressedKeys = new Set()
        this.target = target
    }

    keyboardOn() {
        console.log("подключение клавиатуры")
        this.controller.pluginOn("keyboard")
        this.target.addEventListener('keydown', this.keyDown)
        this.target.addEventListener('keyup', this.keyUp)
    }

    keyboardOff() {
        console.log("отключение клавиатуры")
        this.target.removeEventListener('keydown', this.keyDown)
        this.target.removeEventListener('keyup', this.keyUp)
        for (let key in this.pressedKeys) {
            this.keyDown()
        }
        this.pressedKeys.clear()
        this.controller.pluginOff("keyboard")
    }

    keyCodeToActionName(keyCode) {
        console.log("вызван метод keyCodeToActionName")
        for (let value of this.controller.actions) {
            for (let key in value[1].keys) {
                if (value[1].keys[key] == keyCode && value[1].enabled == true) {
                    console.log("нет такого разблокированного кода")
                        return value[0]
                }
            }
        }
        return false
    }


    keyDown(event) {
        let keyCode = event.keyCode
        console.log(keyCode)
        console.log(this.keyCodeToActionName(keyCode))
        let actionName = this.keyCodeToActionName(keyCode)
        if (actionName) {
            this.controller.activateAction(actionName)
        }
        

    }
    keyUp(event) {
        let actionName = this.keyCodeToActionName(event.keyCode)
        if (actionName) {
            this.controller.activateAction(actionName, activate = false)
        }
    }

    isKeyPressed(keyCode) {
        console.log("метод isKeyPressed вызван")
        return this.pressedKeys.has(keyCode)
    }
}
