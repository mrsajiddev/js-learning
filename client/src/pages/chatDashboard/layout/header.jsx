import react from "react";
import { MessageCircleIcon } from "lucide-react";
const Header = () => {
    return (
        <div className="w-full h-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white ">
                <div className="flex items-center gap-2">
                    <button className="">
                        <MessageCircleIcon size={24} />
                    </button>
                    <h2 className="text-xl font-semibold">Chat</h2>
                </div>
            </div>
        </div>
    );
}
export default Header;