class InputController {
    enabled;
    focused;
    static ACTION_ACTIVATED = "input-controller:action-activated";
    static ACTION_DEACTIVATED = "input-controller:action-deactivated";

    constructor(actionsToBind = {}, target = window) {
        console.log("Инициализация класса")
        this.enabled = true;
        this.focused = true;
        this.attached = false;
        this.target = target;
        this.activeActions = new Set();
        this.actions = new Map();
        this.activePlugins = new Set();
        this.actionsToRestore = new Set();
        this.bindActions(actionsToBind)
        this.initListeners()
        this.attach()
        
        

        console.log("Конце инициализации класса")
    }
    getApi() {
        return {
            getActions: (name) => this.actions,
            isActionActive: (name) => this.isActionActive(name),
            dispatch: () => this.target,
            isAttached: () => this.attached
        }
    }

    initListeners() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.blur()
            } else {
                this.focus()
            }
        });
        this.target.addEventListener('keyboardon', () => {
            this.pluginOn('keyboard')
        });
        this.target.addEventListener('keyboardoff', () => {
            this.pluginOff('keyboard')
        })
        this.target.addEventListener('mouseon', () => {
            this.pluginOn('mouse')
        });
        this.target.addEventListener('mouseoff', () => {
            this.pluginOff('mouse')
        })
        this.target.addEventListener('activateAction', (event) => {
            const detail = event.detail
            this.activateAction(detail)
        });
        this.target.addEventListener('deactivateAction', (e) => {
            const detail = e.detail
            this.deactivateAction(detail)
        })
    }

    activate() {
        console.log("контроллер активирован")
        this.enabled = true
        this.restoreStates()
    }
    deactivate() {
        console.log("контроллер деактивирован")
        this.enabled = false
        for (let action of this.activeActions) {
            this.actionsToRestore.add(action)
        }
        this.activeActions.clear()
    }

    isObject(item) {
        return (item && typeof item === 'object' && !Array.isArray(item));
    }

    deepMerge(target, source) {
        const output = { ...target };
        if (this.isObject(target) && this.isObject(source)) {
            Object.keys(source).forEach(key => {
                if (this.isObject(source[key])) {
                    if (!(key in target)) {
                        Object.assign(output, { [key]: source[key] });
                    } else {
                        output[key] = this.deepMerge(target[key], source[key]);
                    }
                } else {
                    Object.assign(output, { [key]: source[key] });
                }
            });
        }

        return output;
    }

    bindActions(actionsToBind) {
        console.log("метод bindActions вызван")
        let actionsObject = Object.fromEntries(this.actions);
        let merged = this.deepMerge(actionsObject, actionsToBind)
        this.actions = new Map(Object.entries(merged))
        console.log("экшнс", this.actions)
    }

    pluginOn(pluginName) {
        console.log("метод addPlugin был вызван")
        this.activePlugins.add(pluginName)
        console.log(this.activePlugins)
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
        console.log("метод disableAction вызван")
        for (let key of this.actions.keys()) {
            if (key == actionName) {
                this.actions.get(key).enabled = false
                if (this.activeActions.has(key)) {
                    this.actions.get(key).enabled = false
                }
            }
        }

    }

    enableAction(actionName) {
        console.log("метод enableAction вызван")
        for (let key of this.actions.keys()) {
            if (key == actionName) {
                this.actions.get(key).enabled = true
                if (this.activeActions.has(key)) {
                    this.actions.get(key).enabled = true
                }
            }
        }
    }

    attach(target = this.target, dontEnable = false) {
        console.log("метод attach вызван")
        if (!dontEnable && this.focused) {
            this.attached = true
            this.target = target
        }
    }

    detach() {
        console.log("метод detach вызван")
        if (this.focused) {
            this.attached = false
        }
    }

    restoreStates() {
        for (let action of this.actionsToRestore) {
            console.log(action, this.actionsToRestore)
            this.restoreState(action)
            this.actionsToRestore.delete(action)
        }
    }

    restoreState(actionToRestoreName) {
        console.log("Восстановлено состояние", actionToRestoreName, InputController.ACTION_ACTIVATED)
        this.activeActions.add(actionToRestoreName)
        this.target.dispatchEvent(new CustomEvent(InputController.ACTION_ACTIVATED, {
            detail: actionToRestoreName
        }))
    }

    focus() {
        this.focused = true;
        console.log("метод focus вызван")
    }


    blur() {
        this.focused = false;
        console.log("метод blur вызван")
    }

    isActionActive(action) {
        console.log("метод isActionActive вызван")
        if (this.activeActions.has(action) && this.enabled) {
            return true
        }

        return false

    }

    activateAction(actionName) {
        if (this.enabled) {
            this.activeActions.add(actionName)
            console.log(InputController.ACTION_ACTIVATED, actionName)
            this.target.dispatchEvent(new CustomEvent(InputController.ACTION_ACTIVATED, {
                detail: actionName
            }))

        } else {
            console.log("Контроллер выключен", actionName)
            this.actionsToRestore.add(actionName)
        }
    }
    deactivateAction(actionName) {
        if (this.enabled) {
            this.activeActions.delete(actionName)
            console.log(InputController.ACTION_DEACTIVATED, actionName)
            this.target.dispatchEvent(new CustomEvent(InputController.ACTION_DEACTIVATED, {
                detail: actionName
            }))

        } else {
            console.log("Контроллер выключен", actionName)
            this.actionsToRestore.delete(actionName)
        }
    }
}

window.InputController = InputController;