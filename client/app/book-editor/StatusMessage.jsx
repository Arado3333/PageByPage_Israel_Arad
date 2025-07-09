export default function StatusMessage({ message, color }) {


    return (
        <div
            className={`save-message bg-${color}-100 border border-${color}-400 text-${color}-700 px-4 py-3 rounded relative transition duration-500`}
            role="alert"
        >
            <span className="block sm:inline">{message}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3"></span>
        </div>
    );
}
