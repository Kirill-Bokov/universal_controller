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
        this.activeActions = new Set();
        this.actions = new Map();
        this.pressedKeys = new Set();
        this.bindActions(actionsToBind)
        this.attach()
        console.log("Конце инициализации класса")
    }

    bindActions(actionsToBind) {
        for (const actionName in actionsToBind) {
            const action = actionsToBind[actionName]
            this.actions.set(actionName, { keys: action.keys, enabled: action.enabled ?? true })
        }
        console.log("экшнс", this.actions)
        console.log("метод bindActions вызван")
    }

    disableAction(actionName) {
        const action = this.actions.get(actionName)
        if (action) {
            action.enabled = false
        }
        console.log("метод disableAction вызван")
    }

    enableAction(actionName) {
        const action = this.actions.get(actionName)
        if (action) {
            action.enabled = true
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
            this.activeActions.clear()
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
        this.activeActions.clear()
        console.log("метод unfocus вызван")
    }

    isActionActive(action) {
        if (this.activeActions.has(action)) {
            return true
        }
        console.log("метод isActionActive вызван")
        return false

    }
    isKeyPressed(keyCode) {
        if (this.keys.has(keyCode)) {
            console.log(keyCode, "нажат")
        }
        console.log("метод isKeyPressed вызван")
        return this.keys.has(keyCode)
    }
    keyToAction(keyCode) {
        for (let value of this.actions) {
            let key = keyCode
            for (key in value[1].keys) {
                if (value[1].keys[key] == keyCode) {
                    console.log(value[1].keys[key], "эй там на корабле")
                    let actionName = value[0]
                    let actionValue = this.actions.get(actionName)
                    console.log("экшнвелю",actionValue)
                    let returnMap = {actionName, actionValue}
                    console.log("ретюрнекшн", returnMap)
                    return returnMap
                }

            }

        }

    }

    keyDown = (event) => {
        let keyDownAction = this.keyToAction(event.keyCode)
        console.log("кейдаунекшн",keyDownAction)
        this.activeActions.add(keyDownAction)
        console.log("эктивекшнс", this.activeActions)
        if (keyDownAction && !this.actions.has(keyDownAction)) {
            this.target.dispatchEvent(new CustomEvent(InputController.ACTION_ACTIVATED, {
                detail: actionName
            }))
        }
        for (let value of this.actions) {
            console.log(value, "вэлью")
            let key = inputKey
            for (key in value[1].keys) {
                if (value[1].keys[key] == inputKey) {
                    console.log(value[1].keys[key], "эй там на корабле")
                    let actionName = value[0]
                    this.target.dispatchEvent(new CustomEvent(InputController.ACTION_ACTIVATED, {
                        detail: actionName
                    }))
                    console.log(InputController.ACTION_ACTIVATED, "на ключе", inputKey)
                }

            }

        }
        console.log(this.actions)


        console.log(inputKey, "Нажата клавиша")
    }

    keyUp = (event) => {
        const key = event.keyCode
        console.log(key, "Отжата клавиша")
    }

}

window.InputController = InputController;