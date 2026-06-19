class MousePlugin {
    constructor(api) {
        this.api = api
        this.mouseDown = this.mouseDown.bind(this)
        this.mouseUp = this.mouseUp.bind(this)
        this.pressedKeys = new Set()
        this.target = this.api.dispatch()
    }

    mouseOn() {
        console.log("подключение мыши")
        if (this.api.isAttached()) {
            this.target.dispatchEvent(new CustomEvent('mouseon'))
            this.target.addEventListener('mousedown', this.mouseDown)
            this.target.addEventListener('mouseup', this.mouseUp)
        } else {
            console.log("Конструктор не присоединён к элементу")
        }
    }

    mouseOff() {
        console.log("отключение мыши")
        this.target.dispatchEvent(new CustomEvent('mouseoff'))
        this.target.removeEventListener('mousedown', this.mouseDown)
        this.target.removeEventListener('mouseup', this.mouseUp)
        for (let key in this.pressedKeys) {
            this.mouseDown(key)
        }
        this.pressedKeys.clear()
    }

    keyCodeToActionName(keyCode) {
        for (let value of this.api.getActions()) {
            console.log(value[1])
            for (let key in value[1].mouseKeys) {
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
        if (actionName && !this.api.isActionActive(actionName)) {
            this.target.dispatchEvent(new CustomEvent('activateAction', { detail: actionName }))
        }
    }

    mouseUp(event) {
        if (this.haskeyDublicates(event.button)) {
            this.pressedKeys.delete(event.button)
            return
        }

        let actionName = this.keyCodeToActionName(event.button)
        this.pressedKeys.delete(event.button)
        if (actionName && this.api.isActionActive(actionName)) {
            this.target.dispatchEvent(new CustomEvent('deactivateAction', { detail: actionName }))
        }
    }
}
