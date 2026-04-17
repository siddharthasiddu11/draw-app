export function IconButton({icon, onClick, activated}: {
    icon: React.ReactNode;
    onClick: () => void;
    activated: boolean;


}) {
    return <div className={`m-2 cursor-pointer rounded border p-2 bg-black hover:bg-gray-700 ${activated ? "text-red-400" : "text-white"}`} onClick={onClick}>
        {icon}
    </div>
}