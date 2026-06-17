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
        this.activePlugins = new Set();
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

    pluginOn(pluginName) {
        console.log("метод addPlugin был вызван")
        this.activePlugins.add(pluginName)
    }

    pluginOff(pluginName) {
        console.log("метод removePlugin был вызван")
        this.activePlugins.delete(pluginName)
    }

    isPluginOn(pluginName) {
        console.log("подключённые плагины", this.activePlugins)
        return this.activePlugins.has(pluginName)
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
        }
    }

    detach() {
        console.log("метод detach вызван")
        if (this.focused) {
            this.attached = false
            this.pressedKeys.clear()
        }
    }

    restoreStates() {
        console.log(this.actions, this.pressedKeys)
        for (let keyCode of this.pressedKeys) {
            for (let name of this.actions.keys()) {
                console.log(name)
                if (name == this.keyCodeToActionName(keyCode)) {
                    this.activeActions.add(name)
                }
            }
        }
        console.log(this.activeActions)

        for (let action of this.activeActions) {
            console.log("Восстановлено состояние", InputController.ACTION_ACTIVATED)
            this.target.dispatchEvent(new CustomEvent(InputController.ACTION_ACTIVATED, {
                detail: action
            }))
        }
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

    keyCodeToActionName(keyCode) {
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

    keyDown(keyCode) {
        let downedKey = keyCode
        console.log("нажата клавиша", downedKey)
        let keyDownActionName = this.keyCodeToActionName(downedKey)
        this.pressedKeys.add(downedKey)
        if (keyDownActionName && !this.activeActions.has(keyDownActionName) && this.enabled) {
            console.log(this.pressedKeys)
            this.activeActions.add(keyDownActionName)
            this.callEvent(keyDownActionName, true)
        }
    }

    keyUp(keyCode) {
        let upedKey = keyCode
        let keyUpActionName = this.keyCodeToActionName(upedKey)
        console.log(this.pressedKeys)
        this.pressedKeys.delete(upedKey)
        for (let key of this.pressedKeys) {
            console.log(key)
            if (this.keyCodeToActionName(upedKey) == this.keyCodeToActionName(key)) {
                return
            }
        }

        if (keyUpActionName && this.enabled) {
            this.activeActions.delete(keyUpActionName)
            this.callEvent(keyUpActionName, false)
        }
    }

    callEvent(eventName, activated = true) {
        if (activated) {
            console.log(InputController.ACTION_ACTIVATED, eventName)
            this.target.dispatchEvent(new CustomEvent(InputController.ACTION_ACTIVATED, {
                detail: eventName
            }))

        } else {
            console.log(InputController.ACTION_DEACTIVATED, eventName)
            this.target.dispatchEvent(new CustomEvent(InputController.ACTION_DEACTIVATED, {
                detail: eventName
            }))
        }
    }
}

window.InputController = InputController;