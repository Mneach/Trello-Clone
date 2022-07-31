import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { SuccessPopUpWithBodyModel, SuccessUpdatePopUpModel } from "../../model/componentModel";

export function SuccessUpdatePopUp({ showSuccessUpdate, setShowSuccessUpdate, title, buttonVariant }: SuccessUpdatePopUpModel) {

    const handleCloseSuccess = () => setShowSuccessUpdate(false);

    return (
        <Modal
            show={showSuccessUpdate}
            onHide={handleCloseSuccess}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Footer>
                <Button variant={buttonVariant} onClick={handleCloseSuccess}>OK</Button>
            </Modal.Footer>
        </Modal>
    )
}

export function SuccessPopUpWithBody({ showSuccessUpdate, setShowSuccessUpdate, title, buttonVariant, messageBody }: SuccessPopUpWithBodyModel) {

    const handleCloseSuccess = () => setShowSuccessUpdate(false);

    return (
        <Modal
            show={showSuccessUpdate}
            onHide={handleCloseSuccess}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {messageBody}
            </Modal.Body>
            <Modal.Footer>
                <Button variant={buttonVariant} onClick={handleCloseSuccess}>OK</Button>
            </Modal.Footer>
        </Modal>
    )
}


