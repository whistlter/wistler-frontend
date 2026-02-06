import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, MessageSquare, Flag, Settings, LogOut } from 'lucide-react';
import { useAuthUser, useLogoutAction } from '@/features/auth/stores/auth.store';
import { AppIcons } from '@/constants/constant';
import { BUTTON_TYPE } from '@/components/button/constants';
import { ActionModal } from '@/components/modal/actionModal';
import { ProfileModal } from '@/components/modal/ProfileModal';
import { ChangePasswordModal } from '@/components/modal/ChangePasswordModal';
import { useModal } from '@/components/modal';
import { showSuccessToast } from "@/components/common/toastUtils";


const Sidebar = () => {
    const { openModal, } = useModal();
    const icon = { ...AppIcons }
    const navigate = useNavigate();
    const location = useLocation();
    const user = useAuthUser();
    const logout = useLogoutAction();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    const Path = {
        DashBoard: '/',
        User: '/users',
        Community: '/community',
        Moderation: '/activity-logs'
        // Moderation: '/moderation'

    };

    const mainMenuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: Path.DashBoard },
        { icon: Users, label: 'User Management', path: Path.User },
        { icon: MessageSquare, label: 'Communities', path: Path.Community },
        { icon: Flag, label: 'Activity Logs', path: Path.Moderation },
        // { icon: Flag, label: 'Moderation', path: Path.Moderation },
    ];
    /* 
     * Account items are handled separately:
     * - Settings is a link (placeholder for now)
     * - Logout is a button
     */
    const logoutFnc = () => {
        openModal(({ close }) => (
            <ActionModal
                close={close}
                icon={{
                    eclipse: AppIcons.eclipseYellow,
                    icon: AppIcons.warningYellow
                }}
                title="User Logout"
                description={`Are you sure you want to log out of your account? You'll need to sign in again to continue.`}
                secondaryLabel="No, Stay"
                primaryLabel="Yes, Logout"
                primaryIntent="danger"
                showLoader
                buttonVariant={BUTTON_TYPE.PRIMARY}
                onPrimaryAction={async () => {
                    handleLogout();
                    showSuccessToast("Logged Out", "You have been successfully logged out.");
                }}
            />
        ));
    }

    return (
        <div className="w-60 h-screen bg-[#1A1A1A] flex flex-col fixed left-0 top-0">
            {/* Logo */}
            <div className="px-6 pt-6 pb-4">
                <h1 className="text-[22px] font-bold tracking-tight flex items-center">
                    <span className="text-[#ff0055]">
                        <img
                            src={icon.logoW}
                            alt=""
                            className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10"
                        />
                    </span>
                    <span className="text-white">histler</span>
                </h1>
            </div>

            {/* User Profile */}
            <div
                className="px-6 py-2 flex flex-col items-center cursor-pointer  transition-colors duration-200"
            >
                <div className="w-[72px] h-[72px] rounded-full p-[3px] mb-3">
                    <div className="w-full h-full rounded-full bg-[#3d3d6b] flex items-center justify-center overflow-hidden">
                        {/* Initials or generic avatar */}
                        {user?.image ? (
                            <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-white text-[13px] font-medium ">
                                <img src={icon.profile} alt="" />
                            </span>
                        )}
                    </div>
                </div>
                <h2 className="text-white font-medium text-[15px] mb-0.5 capitalize">
                    <div className="flex">
                        {(user?.first_name + ' ' + user?.last_name) || 'Guest User'}
                        <img src={AppIcons.edit} alt="" className="w-4 h-4 opacity-40 ml-1"
                            onClick={() => openModal(({ close }) => (
                                <ProfileModal
                                    close={close}
                                    image={user?.image}
                                    title={(user?.first_name + ' ' + user?.last_name) || 'Guest User'}
                                    description={user?.email || 'No email'}
                                    primaryLabel="Sign out"
                                    onPrimaryAction={logoutFnc}
                                    body={
                                        <div className="w-full bg-[#F9FAFB] border border-[#EAECF0] rounded-lg p-2.5 flex items-center justify-between gap-3 mb-2">
                                            <div className="flex items-center gap-2 flex-1">
                                                <img src={AppIcons.lock} alt="" className="w-4 h-4 opacity-40 ml-1" />
                                                <span className="text-[13px] text-[#666666] font-medium">Password</span>
                                                <div className="text-[18px] text-[#666666] tracking-widest pt-1 px-4">•••••••••••••</div>
                                            </div>
                                            <button
                                                className="text-[13px] font-semibold text-[#FF2860] hover:text-[#D11A4B] whitespace-nowrap px-2 cursor-pointer"
                                                onClick={() => {
                                                    close(); // Close profile modal first
                                                    setTimeout(() => {
                                                        openModal(({ close }) => (
                                                            <ChangePasswordModal close={close} />
                                                        ));
                                                    }, 200); // Small delay for smooth transition
                                                }}
                                            >
                                                Change Password
                                            </button>
                                        </div>
                                    }
                                />
                            ), { type: 'center', width: 'max-w-[480px]' })} />
                    </div>
                </h2>
                <p className="text-center text-[11px] font-semibold text-[#666]">
                    {user?.email || 'No email'}
                </p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-6 overflow-y-auto">
                {/* MAIN Section */}
                <div className="mb-8">
                    <div className="px-3 mb-3">
                        <span className="text-[#666] text-[11px] font-semibold">
                            MAIN
                        </span>
                    </div>
                    <div className="space-y-1">
                        {mainMenuItems.map((item) => {
                            const Icon = item.icon;
                            if (!Icon) {
                                console.error(`Icon for ${item.label} is missing`, item);
                                return null;
                            }

                            return (
                                <NavLink
                                    key={item.label}
                                    to={item.path}
                                    className={({ isActive = location.pathname === item.path || location.pathname.startsWith(item.path) }) => `
                                            w-full flex items-center gap-2
                                            px-[12px] py-[10px]
                                            rounded-[12px]
                                            transition-all duration-200
                                            ${isActive
                                            ? `
                                                text-white
                                                
                                                bg-gradient-to-b from-white/15 to-[#999]/15
                                                `
                                            : `
                                                text-[#9ca3af]
                                                hover:bg-[#252525]
                                                hover:text-white
                                                `}
                                            `}
                                >
                                    {({ isActive }) => (
                                        <>
                                            <Icon
                                                className={`w-[18px] h-[18px] ${isActive ? "text-white" : "text-[#9ca3af] group-hover:text-white"
                                                    }`}
                                            />
                                            <span className="text-[14px] font-medium">{item.label}</span>
                                        </>
                                    )}
                                </NavLink>
                            );
                        })}
                    </div>
                </div>

                {/* ACCOUNT Section */}
                <div>
                    <div className="px-3 mb-3">
                        <span className="text-[#666666] text-[11px] font-semibold uppercase tracking-wider">
                            ACCOUNT
                        </span>
                    </div>
                    <div className="space-y-1">
                        <NavLink to={'/settings'} className={({ isActive }) => `
                                            w-full flex items-center gap-2
                                            px-[12px] py-[10px]
                                            rounded-[12px]
                                            transition-all duration-200
                                            ${isActive
                                ? `
                                                text-white
                                                
                                                bg-gradient-to-b from-white/15 to-[#999]/15
                                                `
                                : `
                                                text-[#9ca3af]
                                                hover:bg-[#252525]
                                                hover:text-white
                                                `}
                                            `}>
                            <Settings className="w-[18px] h-[18px] text-[#9ca3af] group-hover:text-white" />
                            <span className="text-[14px] font-medium">Settings</span>

                        </NavLink>
                        <button
                            onClick={logoutFnc}
                            className="w-full flex cursor-pointer items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group text-[#9ca3af] hover:bg-red-900/20 hover:text-red-400"
                        >
                            <LogOut className="w-[18px] h-[18px] text-[#9ca3af] group-hover:text-red-400" />
                            <span className="text-[14px] font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;