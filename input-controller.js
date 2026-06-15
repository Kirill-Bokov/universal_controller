export class InputController {
    enabled;
    focused;
    ACTION_ACTIVATED;
    ACTION_DEACTIVATED;
    constructor(actionsToBind, target) {
        this.actionsToBind = actionsToBind;
        this.target = target;
        this.keys = new Set()
        target.addEventListener("keydown", event =>
            this.keys.add(event.code)
        )
        target.addEventListener("keyup", event =>
            this.keys.remove(event.code)
        )
        this.activeActions = new Map()

    }
    bindActions(actionsToBind) {
        this.activeActions.push(
            actionsToBind
        )
    }

    enableAction(actionName) {

        if (this.enabled) {
            return this.isActionActive()
        }
        this.actionName.enabled = true;

    }
    disableAction(actionName) {
        this.actionName.enabled = false;
    }

    attach(target, dontEnable) {

    }
    detach() {

    }
    isActionActive(action) {

    }
    isKeyPressed(keyCode) {
        if (this.keys.has(keyCode)) { console.log(keyCode, "") }
        return this.keys.has(keyCode)
    }
}
