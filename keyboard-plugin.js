class KeyboardPlugin {
    constructor(controller, target = window) {
        this.controller = controller
        console.log(this.controller.activeActions, "при инициализации клавы")
        this.keyDown = this.keyDown.bind(this)
        this.keyUp = this.keyUp.bind(this)
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
                        return value[0]
                }
            }
        }
        console.log("нет такого разблокированного кода")
        return false
    }


    keyDown(event) {
        console.log(this.controller.activeActions, "actionName-keydown")
        let actionName = this.keyCodeToActionName(event.keyCode)
        
        if (actionName && !this.controller.activeActions.has(actionName) && !this.pressedKeys.has(event.keyCode)) {
            this.pressedKeys.add(event.keyCode)
            this.controller.activateAction(actionName)
        }
    }
    keyUp(event) {
        let actionName = this.keyCodeToActionName(event.keyCode)
        if (actionName && !this.pressedKeys.has(event.keyCode)) {
            this.pressedKeys.delete(event.keyCode)
            this.controller.deactivateAction(actionName)
        }
    }
}
