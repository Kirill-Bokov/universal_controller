import { InputController } from "./input-controller"

function inputControllerTest() {
    actionsToBind = {
        "left": {
            keys: [37, 65],
            enabled: false
        },
        "right": {
            keys: [39, 68]
        }
    }


    let controller = new InputController(actionsToBind)

}
