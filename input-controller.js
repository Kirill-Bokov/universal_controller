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
        this.bindActions(actionsToBind)
        this.attach()
        console.log("Конце инициализации класса")
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
        if (!dontEnable) {
            this.target.addEventListener('keydown', this.keyDown)
            this.target.addEventListener('keyup', this.keyUp)
            this.enabled = true
            console.log("метод attach вызван")
        }

    }

    detach() {
        if (this.focused) {
            this.target.removeEventListener('keydown', this.keyDown)
            this.target.removeEventListener('keyup', this.keyUp)
            this.enabled = false
            this.pressedKeys.clear()
            this.enabledActions.clear()
        }
        console.log("метод detach вызван")
    }

    focus() {
        this.focused = true;
        console.log("метод focus вызван")
    }


    unfocus() {
        this.focused = false;
        this.pressedKeys.clear()
        this.enabledActions.clear()
        console.log("метод unfocus вызван")
    }

    isActionActive(action) {
        console.log("метод isActionActive вызван")
        if (this.activeActions.has(action)) {
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

    keyDown = (event) => {
        let downedKey = event.keyCode
        let keyDownActionName = this.keyToActionName(downedKey)
        if (keyDownActionName && !this.pressedKeys.has(downedKey)) {
            this.pressedKeys.add(downedKey)
            this.activeActions.add(keyDownActionName)
            console.log(InputController.ACTION_ACTIVATED)
            this.target.dispatchEvent(new CustomEvent(InputController.ACTION_ACTIVATED, {
                detail: keyDownActionName
            }))

        }
    }

    keyUp = (event) => {
        let upedKey = event.keyCode
        let keyUpActionName = this.keyToActionName(upedKey)
        if (keyUpActionName) {
            this.pressedKeys.delete(upedKey)
            this.activeActions.delete(keyUpActionName)
            console.log(InputController.ACTION_DEACTIVATED)
            this.target.dispatchEvent(new CustomEvent(InputController.ACTION_DEACTIVATED, {
                detail: keyUpActionName
            }))
        }

    }

}

window.InputController = InputController;