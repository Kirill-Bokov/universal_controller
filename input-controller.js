class InputController {
    enabled;
    focused;
    static ACTION_ACTIVATED = "input-controller:action-activated";
    static ACTION_DEACTIVATED = "input-controller:action-deactivated";

    constructor(actionsToBind = {}, target = window) {
        console.log("Инициализация класса")
        this.enabled = true;
        this.focused = true;
        this.target = target;
        this.enabledActions = new Set();
        this.activeActions = new Set();
        this.actions = new Map();
        this.pressedKeys = new Set();
        this.keyDown = this.keyDown.bind(this)
        this.keyUp = this.keyUp.bind(this)
        this.bindActions(actionsToBind)
        this.attach()
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.blur()
            } else {
                this.focus()
            }
        });

        console.log("Конце инициализации класса")
    }
    activate() {
        console.log("контроллер активирован")
        this.enabled = true
        if (this.attached) {
            this.restoreStates()
        }
    }
    deactivate() {
        console.log("контроллер деактивирован")
        this.enabled = false
        if (this.attached) {
            this.activeActions.clear()
        }
    }
    bindActions(actionsToBind) {
        for (let actionName in actionsToBind) {
            const action = actionsToBind[actionName]
            this.actions.set(actionName, { keys: action.keys, enabled: action.enabled ?? true })
        }

        for (let value of this.actions) {
            console.log(value)
            if (value[1].enabled == true) {
                this.enabledActions.add(value[0])
            }
        }

        console.log("экшнс", this.actions)
        console.log("метод bindActions вызван")
    }

    disableAction(actionName) {
        const action = this.actions.get(actionName)
        if (action) {
            this.actions.action.enabled = false
            this.enabledActions.delete(actionName)
        }
        console.log("метод disableAction вызван")
    }

    enableAction(actionName) {
        const action = this.actions.get(actionName)
        if (action) {
            this.actions.action.enabled = true
            this.enabledActions.add(actionName)
        }
        console.log("метод enableAction вызван")
    }

    attach(target = this.target, dontEnable = false) {
        console.log("метод attach вызван")
        console.log(this.actions)
        if (!dontEnable && this.focused) {
            this.attached = true
            this.target.addEventListener('keydown', this.keyDown)
            this.target.addEventListener('keyup', this.keyUp)

        }

    }

    detach() {
        console.log("метод detach вызван")
        if (this.focused) {
            this.attached = false
            this.target.removeEventListener('keydown', this.keyDown)
            this.target.removeEventListener('keyup', this.keyUp)
            this.pressedKeys.clear()
        }

    }

    restoreStates() {
        console.log(this.actions, this.pressedKeys)
        for (let key of this.pressedKeys) {
            for (let name of this.actions.keys()) {
                console.log(name)
                if (name == this.keyToActionName(key)) {
                    this.activeActions.add(name)
                    console.log("Восстановлено состояние", InputController.ACTION_ACTIVATED)
                    this.target.dispatchEvent(new CustomEvent(InputController.ACTION_ACTIVATED, {
                        detail: name
                    }))
                }
            }
        }
        console.log(this.activeActions)
    }

    focus() {
        this.focused = true;
        console.log("метод focus вызван")
    }


    blur() {
        this.focused = false;
        this.pressedKeys.clear()
        console.log("метод blur вызван")
    }

    isActionActive(action) {
        console.log("метод isActionActive вызван")
        if (this.activeActions.has(action) && this.enabled) {
            return true
        }

        return false

    }

    isKeyPressed(keyCode) {
        console.log("метод isKeyPressed вызван")
        if (this.pressedKeys.has(keyCode)) {
        }
        return this.pressedKeys.has(keyCode)
    }

    keyToActionName(keyCode) {
        for (let value of this.actions) {
            for (let key in value[1].keys) {
                if (value[1].keys[key] == keyCode) {
                    let actionName = value[0]
                    if (this.enabledActions.has(actionName)) {
                        return actionName
                    }
                }
            }
        }
        return false
    }

    keyDown(event) {
        let downedKey = event.keyCode
        let keyDownActionName = this.keyToActionName(downedKey)
        this.pressedKeys.add(downedKey)
        if (keyDownActionName && !this.activeActions.has(keyDownActionName) && this.enabled) {
            console.log(this.pressedKeys)
            this.activeActions.add(keyDownActionName)
            console.log(InputController.ACTION_ACTIVATED)
            this.target.dispatchEvent(new CustomEvent(InputController.ACTION_ACTIVATED, {
                detail: keyDownActionName
            }))

        }
    }

    keyUp(event) {
        let upedKey = event.keyCode
        let keyUpActionName = this.keyToActionName(upedKey)
        console.log(this.pressedKeys)
        this.pressedKeys.delete(upedKey)

        for (let key of this.pressedKeys) {
            console.log(key)
            if (this.keyToActionName(upedKey) == this.keyToActionName(key)) {
                return
            }
        }
        if (keyUpActionName && this.enabled) {
            this.activeActions.delete(keyUpActionName)
            console.log(InputController.ACTION_DEACTIVATED)
            this.target.dispatchEvent(new CustomEvent(InputController.ACTION_DEACTIVATED, {
                detail: keyUpActionName
            }))
        }

    }


}

window.InputController = InputController;