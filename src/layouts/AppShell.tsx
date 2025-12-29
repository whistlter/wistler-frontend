import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppShell() {
    return (
        <div className="h-screen bg-gray-50 overflow-hidden">
            {/* Root layout */}
            <div className="flex h-full">
                {/* Sidebar */}
                <aside className="w-60 shrink-0">
                    <Sidebar />
                </aside>

                {/* Main column */}
                <div className="flex flex-1 flex-col overflow-hidden">
                    {/* Topbar (NOT fixed) */}
                    <Topbar />

                    {/* Content wrapper with max width */}
                    <main className="flex-1 overflow-y-auto">
                        <div className="mx-auto w-full ">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default AppShell;