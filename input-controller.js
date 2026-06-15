export class InputController {
    enabled;
    focused;
    static ACTION_ACTIVATED = "input-controller:action-activated";
    static ACTION_DEACTIVATED = "input-controller:action-deactivated";

    constructor(actionsToBind = {}, target = window) {
        this.enabled = true;
        this.focused = true;
        this.target = target;
        this.activeActions = new Set()
        this.actionsSource = new Map()
        this.actions = new Map()
        this.bindActions(actions)
        this.attach(target)
    }

    bindActions(actionsToBind) {
        for (let actionName in actionsToBind) {
            this.actions.set(actionName, { keys: actionsToBind[actionName], enabled: true })
        }
    }

    disableAction(actionName) {
        this.actionName.enabled = false;
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
    isKeyPressed(keyCode) {
        if (this.keys.has(keyCode)) {
            console.log(keyCode, "нажат")
        }
        return this.keys.has(keyCode)
    }


}
