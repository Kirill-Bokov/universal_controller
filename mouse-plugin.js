class MousePlugin {
    constructor(controller) {
        this.controller = controller
        console.log(this.controller.activeActions, "при инициализации мыши")
        this.mouseDown = this.mouseDown.bind(this)
        this.mouseUp = this.mouseUp.bind(this)
        this.pressedKeys = new Set()
        this.target = this.controller.target
    }

    mouseOn() {
        console.log("подключение мыши")
        if (this.controller.attached) {
            this.controller.pluginOn("mouse")
            this.target.addEventListener('mousedown', this.mouseDown)
            this.target.addEventListener('mouseup', this.mouseUp)
        } else {
            console.log("Конструктор не присоединён к элементу")
        }
    }

    mouseOff() {
        console.log("отключение мыши")
        this.target.removeEventListener('mousedown', this.mouseDown)
        this.target.removeEventListener('mouseup', this.mouseUp)
        for (let key in this.pressedKeys) {
            this.mouseDown(key)
        }
        this.pressedKeys.clear()
        this.controller.pluginOff("mouse")
    }

    keyCodeToActionName(keyCode) {
        for (let value of this.controller.actions) {
            console.log(value[1])
            for (let key in value[1].mouseKeys) {
                console.log(value[1].mouseKeys[key], "кий")
                if (value[1].mouseKeys[key] == keyCode && value[1].enabled == true) {
                    let actionName = value[0]
                    return actionName
                }
            }
        }
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

    mouseDown(event) {
        if (this.haskeyDublicates(event.button)) {
            this.pressedKeys.add(event.button)
            return
        }
        let actionName = this.keyCodeToActionName(event.button)
        this.pressedKeys.add(event.button)
        if (actionName && !this.controller.activeActions.has(actionName)) {
            this.controller.activateAction(actionName)
        }
    }

    mouseUp(event) {
        if (this.haskeyDublicates(event.button)) {
            this.pressedKeys.delete(event.button)
            return
        }

        let actionName = this.keyCodeToActionName(event.button)
        this.pressedKeys.delete(event.button)
        if (actionName && this.controller.activeActions.has(actionName)) {
            this.controller.deactivateAction(actionName)
        }
    }
}
