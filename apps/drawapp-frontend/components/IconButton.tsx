export function IconButton({icon, onClick}: {
    icon: React.ReactNode;
    onClick: () => void;
}) {
    return <div className="p-2  cursor-pointer rounded-lg border  hover:bg-gray-700 p-2 text-white" onClick={onClick}>
        {icon}
    </div>
}