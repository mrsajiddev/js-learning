import react from "react";
import { Menu } from "lucide-react";
const Footer = () => {
    return (
        <div className="w-full h-auto">
                <div className="h-auto flex items-center justify-between p-4 border-t border-gray-200 bg-white ">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                            <button className="">
                                <Menu size={24} />
                            </button>
                            <h2 className="text-xl font-semibold">Chat</h2>
                        </div>
                    </div>
                </div>
        </div>
    );
}
export default Footer;
