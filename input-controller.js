export class InputController {
    enabled;
    focused;
    static ACTION_ACTIVATED = "input-controller:action-activated";
    static ACTION_DEACTIVATED = "input-controller:action-deactivated";

    constructor(actionsToBind = {}, target = window) {
        console.log(actionsToBind)
        this.enabled = true;
        this.focused = true;
        this.target = target;
        this.activeActions = new Set()
        this.actions = new Map()
        this.bindActions(actionsToBind)
        this.attach(target)
    }

    bindActions(actionsToBind) {
        const action = actionsToBind[actionName]
        this.actions.set(actionName, {
            keys: action.keys,
            enabled: action.enabled ?? true
        })
    }

    disableAction() {
        const action = this.actions.get(actionName)
        if (action) {
            action.enabled = false
        }
    }
    enableAction() {
        const action = this.actions.get(actionName)
        if (action) {
            action.disabled = true
        }
    }
    attach(target = this.target) {
        if (this.focused) {
            this.target.addEventListener('keydown', this.keyDown)
            this.target.addEventListener('keyup', this.keyUp)
        }
    }

    detach() {
        if (this.focused) {
            this.target.removeEventListener('keydown', this.keyDown)
            this.target.removeEventListener('keyup', this.keyUp)
        }
    }

    focus() {
        this.focused = true;
    }

    unfocus() {
        this.focused = false;
    }

    isActionActive(action) {
        if (this.activeActions.has(action)) {
            return true
        }
        return false
    }
    /*isKeyPressed(keyCode) {
        if (this.keys.has(keyCode)) {
            console.log(keyCode, "нажат")
        }
        return this.keys.has(keyCode)
    }*/
    keyDown = (event) => {
        const key = event.keyCode
        console.log(key, "Нажата клавиша")
    }

    keyUp = (event) => {
        const key = event.keyCode
        console.log(key, "Отжата клавиша")
    }

}
