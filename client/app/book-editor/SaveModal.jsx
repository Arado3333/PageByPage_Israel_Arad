export default function SaveModal({
    buttonText1,
    buttonText2,
    onSaveClick,
    onCreateClick,
}) {
    <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
            <div className="modal-action">
                <form method="dialog">
                    <button
                        onClick={onSaveClick}
                        className="btn-primary mb-2"
                    >
                        {buttonText1}
                    </button>
                    <button
                        onClick={onCreateClick}
                        className="btn-primary"
                    >
                        {buttonText2}
                    </button>
                </form>
            </div>
        </div>
    </dialog>;
}
