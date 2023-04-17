import {Component} from "react";

export enum ControllerButtonType {
    Start = 'start',
    Stop = 'stop',
    Pause = 'pause',
    Reset = 'reset',
    Edit = 'edit',
}
interface ControllerButtonProps {
    buttonType: ControllerButtonType;
    onClick?: () => void;
    disabled: boolean;
}

export default class ControllerButton extends Component<ControllerButtonProps, any> {
    playIcon = <svg fill="currentColor" width="800px" height="800px" viewBox="-7 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <title>Start</title>
        <path d="M0 6.688v18.906c0 0.344 0.156 0.625 0.469 0.813 0.125 0.094 0.344 0.125 0.5 0.125s0.281-0.031 0.438-0.125l16.375-9.438c0.313-0.219 0.5-0.5 0.5-0.844 0-0.313-0.188-0.594-0.5-0.813l-16.375-9.438c-0.563-0.406-1.406 0.094-1.406 0.813z"></path>
    </svg>

    pauseIcon = <svg fill="currentColor" width="800px" height="800px" viewBox="-5.5 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <title>Pause</title>
        <path d="M0 6.563v18.875c0 0.531 0.438 0.969 0.969 0.969h6.625c0.5 0 0.906-0.438 0.906-0.969v-18.875c0-0.531-0.406-0.969-0.906-0.969h-6.625c-0.531 0-0.969 0.438-0.969 0.969zM12.281 6.563v18.875c0 0.531 0.438 0.969 0.938 0.969h6.625c0.531 0 0.969-0.438 0.969-0.969v-18.875c0-0.531-0.438-0.969-0.969-0.969h-6.625c-0.5 0-0.938 0.438-0.938 0.969z"></path>
    </svg>

    stopIcon = <svg fill="currentColor" width="800px" height="800px" viewBox="-5.5 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <title>Stop</title>
        <path d="M0 6.563v18.875c0 0.531 0.438 0.969 0.969 0.969h18.875c0.531 0 0.969-0.438 0.969-0.969v-18.875c0-0.531-0.438-0.969-0.969-0.969h-18.875c-0.531 0-0.969 0.438-0.969 0.969z"></path>
    </svg>

    resetIcon = <svg fill="currentColor" width="800px" height="800px" viewBox="-6 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <title>Reset</title>
        <path d="M16.75 16.781h2.938c0 2.563-0.969 5.156-2.875 7.063-3.844 3.844-10.094 3.844-13.938 0s-3.844-10.094 0-13.938c1.75-1.75 4.031-2.688 6.344-2.844v-2.75l7.531 4.344-7.531 4.375v-3.031c-1.563 0.125-3.063 0.813-4.25 2-2.719 2.688-2.719 7.063 0 9.75 2.688 2.719 7.063 2.719 9.75 0 1.375-1.344 2.063-3.188 2.031-4.969z"></path>
    </svg>

    editIcon = <svg fill="currentColor" width="800px" height="800px" viewBox="-5 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <title>pencil</title>
        <path d="M18.344 4.781l-3.406 3.063s1.125 0.688 2.156 1.656c1 0.969 1.719 2.063 1.719 2.063l2.906-3.469s-0.031-0.625-1.406-1.969c-1.406-1.344-1.969-1.344-1.969-1.344zM7.25 21.938l-0.156 1.5 10.813-11.25s-0.719-1-1.594-1.844c-0.906-0.875-1.938-1.563-1.938-1.563l-10.813 11.25 1.688-0.094 0.188 1.813zM0 26.719l2.688-5.5 1.5-0.125 0.125 1.719 1.813 0.25-0.188 1.375-5.438 2.75z"></path>
    </svg>

    getButtonIcon() {
        switch (this.props.buttonType) {
            case ControllerButtonType.Start:
                return this.playIcon;
            case ControllerButtonType.Pause:
                return this.pauseIcon;
            case ControllerButtonType.Stop:
                return this.stopIcon;
            case ControllerButtonType.Reset:
                return this.resetIcon;
            case ControllerButtonType.Edit:
                return this.editIcon;
        }
    }

    render() {
        return (
            <button
                className={`controller_button ${this.props.buttonType}`}
                onClick={this.props.onClick}
                disabled={this.props.disabled}
            >
                {this.getButtonIcon()}
            </button>
        )
    }
}
