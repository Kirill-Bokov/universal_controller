class KeyboardPlugin {
    constructor(controller) {
        this.controller = controller
        console.log(this.controller.activeActions, "при инициализации клавы")
        this.keyDown = this.keyDown.bind(this)
        this.keyUp = this.keyUp.bind(this)
        this.pressedKeys = new Set()
        this.target = this.controller.target
    }

    keyboardOn() {
        console.log("подключение клавиатуры")
        if (this.controller.attached) {
            this.controller.pluginOn("keyboard")
            this.target.addEventListener('keydown', this.keyDown)
            this.target.addEventListener('keyup', this.keyUp)
        } else {
            console.log("Конструктор не присоединён к элементу")
        }
    }

    keyboardOff() {
        console.log("отключение клавиатуры")
        this.target.removeEventListener('keydown', this.keyDown)
        this.target.removeEventListener('keyup', this.keyUp)
        for (let key in this.pressedKeys) {
            this.keyDown(key)
        }
        this.pressedKeys.clear()
        this.controller.pluginOff("keyboard")
    }

    keyCodeToActionName(keyCode) {
        for (let value of this.controller.actions) {
            for (let key in value[1].keys) {
                if (value[1].keys[key] == keyCode && value[1].enabled == true) {
                    let actionName = value[0]
                    return actionName
                }
            }
        }
        console.log("нет такого разблокированного кода")
        return false
    }

    haskeyDublicates(keyCode) {
        let samePressedKeys = 0
        for (let key of this.pressedKeys) {
            if (this.keyCodeToActionName(keyCode) == this.keyCodeToActionName(key)) {
                samePressedKeys++
            }
        }
        if (samePressedKeys > 1) {
            return true
        }
        return false
    }

    keyDown(event) {
        if (this.haskeyDublicates(event.keyCode)) {
            this.pressedKeys.add(event.keyCode)
            return
        }
        let actionName = this.keyCodeToActionName(event.keyCode)
        this.pressedKeys.add(event.keyCode)
        if (actionName && !this.controller.activeActions.has(actionName)) {
            this.controller.activateAction(actionName)
        }
    }

    keyUp(event) {
        if (this.haskeyDublicates(event.keyCode)) {
            this.pressedKeys.delete(event.keyCode)
            return
        }

        let actionName = this.keyCodeToActionName(event.keyCode)
        this.pressedKeys.delete(event.keyCode)
        if (actionName && this.controller.activeActions.has(actionName)) {
            this.controller.deactivateAction(actionName)
        }
    }
}
