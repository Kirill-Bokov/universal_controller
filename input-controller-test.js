

function inputControllerTest() {
    const actionsToBind = {
        "left": {
            keys: [37, 38, 65],
            enabled: true
        },
        "right": {
            keys: [39, 68],
            enabled: true
        },
        "shoot": {
            keys: [0]
        },
        "scope": {
            keys: [2]
        }
    }


    const controller = new InputController(actionsToBind);
    //let mouse =  new MousePlugin(controller);
    //mouse.mouseOn()
    let keyboard = new KeyboardPlugin(controller);
    keyboard.keyboardOn()
    
    window.controller = controller;

    const game = document.getElementById('game')
    window.addEventListener(
        InputController.ACTION_ACTIVATED, (event) => {
            if (event.detail == "jump") {
                game.style.backgroundColor = "darkSlateBlue"
            }
        }
    )

    const attachButton = document.getElementById('attach-button');
    attachButton.addEventListener('click', () => {
        controller.attach()
    });
    const detachButton = document.getElementById('detach-button');
    detachButton.addEventListener('click', () => {
        controller.detach()
    });
    const activateController = document.getElementById('activate-controller');
    activateController.addEventListener('click', () => {
        controller.activate()
    });
    const deactivateController = document.getElementById('deactivate-controller');
    deactivateController.addEventListener('click', () => {
        controller.deactivate()
    });
    const bindJump = document.getElementById('bind-jump');
    bindJump.addEventListener('click', () => {
        controller.bindActions({
        "jump": {
            keys: [38],
            enabled: true
        },
    })
    });
}
inputControllerTest()
