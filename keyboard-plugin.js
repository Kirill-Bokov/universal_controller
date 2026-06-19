class KeyboardPlugin {
    constructor(api) {
        this.api = api
        console.log(this.api, "при инициализации клавы")
        this.keyDown = this.keyDown.bind(this)
        this.keyUp = this.keyUp.bind(this)
        this.pressedKeys = new Set()
        this.target = this.api.target

    }

    keyboardOn() {
        console.log("подключение клавиатуры")

        if (this.api.attached) {
            this.target.dispatchEvent(new CustomEvent('keyboardon'))
            this.target.addEventListener('keydown', this.keyDown)
            this.target.addEventListener('keyup', this.keyUp)
        } else {
            console.log("Конструктор не присоединён к элементу")
        }
    }

    keyboardOff() {
        this.target.dispatchEvent(new CustomEvent('keyboardoff'))
        this.target.removeEventListener('keydown', this.keyDown)
        this.target.removeEventListener('keyup', this.keyUp)
        for (let key in this.pressedKeys) {
            this.keyDown(key)
        }
        this.pressedKeys.clear()
    }

    keyCodeToActionName(keyCode) {
        console.log(this.api.actions)
        for (let value of this.api.actions) {
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
        if (actionName && !this.api.activeActions.has(actionName)) {
            this.target.dispatchEvent(new CustomEvent('activateAction'), { detail: actionName })
        }
    }

    keyUp(event) {
        if (this.haskeyDublicates(event.keyCode)) {
            this.pressedKeys.delete(event.keyCode)
            return
        }

        let actionName = this.keyCodeToActionName(event.keyCode)
        this.pressedKeys.delete(event.keyCode)
        if (actionName && this.api.activeActions.has(actionName)) {
            this.target.dispatchEvent(new CustomEvent('deactivateAction'), {
                detail: actionName
            })
        }
    }
}
