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
        this.activeActions = new Set()
        this.actions = new Map()
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
    attach() {
            this.target.addEventListener('keydown', this.keyDown)
            this.target.addEventListener('keyup', this.keyUp)
            console.log("метод attach вызван")
    }

    detach() {
        if (this.focused) {
            this.target.removeEventListener('keydown', this.keyDown)
            this.target.removeEventListener('keyup', this.keyUp)
        }
        console.log("метод detach вызван")
    }

    focus() {
        this.focused = true;
        console.log("метод focus вызван")
    }
    

    unfocus() {
        this.focused = false;
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

    keyDown(event) {
        const key = event.keyCode
        console.log(key, "Нажата клавиша")
    }

    keyUp (event) {
        const key = event.keyCode
        console.log(key, "Отжата клавиша")
    }

}

window.InputController = InputController;