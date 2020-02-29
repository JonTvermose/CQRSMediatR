import React, { FunctionComponent } from 'react';
import posed, { PoseGroup } from 'react-pose';

interface ModalProps {
    visible: boolean;
    headerText: string;
    saveText: string;
    closeText: string;
    onSaveClick(): void;
    onCloseClick(): void;
}

const ModalDiv = posed.div({
    enter: {
        opacity: 1,
        delay: 300,
        transition: { duration: 300 }
    },
    exit: {
        opacity: 0,
        transition: { duration: 150 }
    }
});

const ModalContentDiv = posed.div({
    enter: {
        y: 0,
        opacity: 1,
        delay: 300,
        transition: {
            y: { type: 'spring', stiffness: 1000, damping: 50 },
            default: { duration: 300 }
        }
    },
    exit: {
        y: -300,
        opacity: 0,
        transition: { duration: 150 }
    }
});

export const Modal: FunctionComponent<ModalProps> = (props) => {

    function handleModalClose(e) {
        if (e.target.className === "modal") {
            props.onCloseClick();
        }
    }

    return (
        <PoseGroup>
            {props.visible &&
                <ModalDiv key="modal" className="modal" role="dialog" style={{ display: "block" }} onClick={handleModalClose}>
                    <ModalContentDiv key="modalContent" className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{props.headerText}</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={props.onCloseClick}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {props.children}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-sm btn-primary" onClick={props.onSaveClick}>{props.saveText}</button>
                                <button type="button" className="btn btn-sm btn-secondary" onClick={props.onCloseClick}>{props.closeText}</button>
                            </div>
                        </div>
                    </ModalContentDiv>
                </ModalDiv>}
        </PoseGroup>

    )
}

