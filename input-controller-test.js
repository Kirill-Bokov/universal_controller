

function inputControllerTest() {
    const actionsToBind = {
        "left": {
            keys: [37, 65],
            enabled: false
        },
        "right": {
            keys: [39, 68]
        }
    }


    let controller = new InputController(actionsToBind)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            controller.blur()
        } else {
            controller.focus()
        }
    });

    const game = document.getElementById('game')
    console.log("ЭКШАН АКТИВЕЙТЕД",InputController.ACTION_ACTIVATED)
    window.addEventListener(
        InputController.ACTION_ACTIVATED, (event) => {
            console.log("ДЕТАЛИ ИВЕНТА",event.detail)
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
