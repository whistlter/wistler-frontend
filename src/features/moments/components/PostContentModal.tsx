import { AppIcons } from '@/constants/constant';
import { formatNumber } from '@/utils/helper';

type Props = {
    close: () => void;
    image?: string | null;
    post_content: string;
    topic: string;
    category: string;
    date: string;
    user_name: string;
    user_image?: string | null;
    user_status: string;
    flags_count: number;
    reports_count: number;
    reach_count: number;
    participants_count: number;
    likes: number;
    comments: number;
    onViewProfile: () => void;
    onRemovePost: () => void;
    onSuspendUser: () => void;
};

export function PostContentModal({
    close,
    image,
    post_content,
    topic,
    category,
    date,
    user_name,
    user_image,
    user_status,
    flags_count,
    reports_count,
    reach_count,
    participants_count,
    likes,
    comments,
    onViewProfile,
    onRemovePost,
    onSuspendUser,
}: Props) {

    return (
        <div className="flex h-full flex-col bg-[#fcfcfc]">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 bg-white border-b border-[#E8E8E8] shrink-0">
                <h2 className="text-[16px] font-medium text-[#1a1a1a]">Post content</h2>
                <button onClick={close} className="cursor-pointer w-5 h-5 flex items-center justify-center">
                    <img src={AppIcons.x} alt="Close" className="w-[10px] h-[10px]" />
                </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
                <div className="flex flex-col gap-0 bg-white mx-4 my-4 rounded-lg overflow-hidden">

                    {/* Post Content */}
                    <div className="flex flex-col gap-2 p-4 border-b border-[#EFEFF3]">
                        <div className="w-full h-[180px] rounded-[6px] bg-[#efeff3] overflow-hidden">
                            {image && <img src={image} alt="Post" className="w-full h-full object-cover" />}
                        </div>
                        <p className="text-[13px] font-medium text-[#1a1a1a] leading-[18px]">{post_content}</p>
                    </div>

                    {/* Post Information */}
                    <div className="flex flex-col gap-4 p-4 border-b border-[#EFEFF3]">
                        <p className="text-[13px] font-medium text-[#1a1a1a]">Post Information</p>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-[6px]">
                                <div className="flex items-center gap-1 min-w-[81px]">
                                    <img src={AppIcons.messageMultipleBlue} alt="" className="w-4 h-4 shrink-0" />
                                    <span className="text-[13px] font-medium text-[#666]">Topic:</span>
                                </div>
                                <span className="text-[13px] font-medium text-[#484848]">{topic}</span>
                            </div>
                            <div className="flex items-center gap-[6px]">
                                <div className="flex items-center gap-1 min-w-[81px]">
                                    <img src={AppIcons.dashboard} alt="" className="w-4 h-4 shrink-0" />
                                    <span className="text-[13px] font-medium text-[#666]">Category:</span>
                                </div>
                                <span className="text-[13px] font-medium text-[#484848]">{category}</span>
                            </div>
                            <div className="flex items-center gap-[6px]">
                                <div className="flex items-center gap-1 min-w-[81px]">
                                    <img src={AppIcons.calendar} alt="" className="w-4 h-4 shrink-0" />
                                    <span className="text-[13px] font-medium text-[#666]">Posted:</span>
                                </div>
                                <span className="text-[13px] font-medium text-[#484848]">{date}</span>
                            </div>
                        </div>
                    </div>

                    {/* Author Details */}
                    <div className="flex flex-col gap-4 p-4 border-b border-[#EFEFF3]">
                        <p className="text-[13px] font-medium text-[#1a1a1a]">Author Details</p>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-[6px] flex-wrap">
                                <div className="flex items-center gap-1 min-w-[53px]">
                                    <img src={AppIcons.user} alt="" className="w-4 h-4 shrink-0" />
                                    <span className="text-[13px] font-medium text-[#666]">User:</span>
                                </div>
                                <div className="flex items-center gap-1 px-1 py-1 pr-2 bg-[#f5f5f5] rounded">
                                    <div className="w-[18px] h-[18px] rounded-full bg-[#d9d9d9] overflow-hidden shrink-0">
                                        {user_image && <img src={user_image} alt="" className="w-full h-full object-cover" />}
                                    </div>
                                    <span className="text-[13px] font-medium text-[#484848]">{user_name}</span>
                                </div>
                                <button
                                    className="flex items-center gap-1 cursor-pointer"
                                    onClick={onViewProfile}
                                >
                                    <span className="text-[13px] font-medium text-[#ff2860]">View Profile</span>
                                    <img src={AppIcons.propertySearch} alt="" className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex items-center gap-[6px]">
                                <div className="flex items-center gap-1">
                                    <img src={AppIcons.lightning} alt="" className="w-4 h-4 shrink-0" />
                                    <span className="text-[13px] font-medium text-[#666]">Account Status:</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-1 bg-white border border-[#E8E8E8] rounded-full">
                                    <span className={`w-[6px] h-[6px] rounded-full shrink-0 ${user_status === 'active' ? 'bg-[#57a523]' : 'bg-[#9e9e9e]'}`} />
                                    <span className="text-[13px] font-medium text-[#666] capitalize">
                                        {user_status === 'active' ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Post Metadata */}
                    <div className="flex flex-col gap-4 p-4">
                        <p className="text-[13px] font-medium text-[#1a1a1a]">Post Metadata</p>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-[6px]">
                                <div className="flex items-center gap-1 min-w-[73px]">
                                    <img src={AppIcons.flag} alt="" className="w-4 h-4 shrink-0" />
                                    <span className="text-[13px] font-medium text-[#666]">Flags:</span>
                                </div>
                                <span className="text-[13px] font-medium text-[#484848]">{flags_count}</span>
                            </div>
                            <div className="flex items-center gap-[6px]">
                                <div className="flex items-center gap-1 min-w-[73px]">
                                    <img src={AppIcons.alert} alt="" className="w-4 h-4 shrink-0" />
                                    <span className="text-[13px] font-medium text-[#666]">Reports:</span>
                                </div>
                                <span className="text-[13px] font-medium text-[#484848]">{reports_count}</span>
                            </div>
                            <div className="flex items-center gap-[6px]">
                                <div className="flex items-center gap-1 min-w-[73px]">
                                    <img src={AppIcons.users} alt="" className="w-4 h-4 shrink-0" />
                                    <span className="text-[13px] font-medium text-[#666]">Reach:</span>
                                </div>
                                <span className="text-[13px] font-medium text-[#484848]">{formatNumber(reach_count)}</span>
                            </div>
                        </div>
                        {/* Engagement */}
                        <div className="flex flex-col gap-2">
                            <p className="text-[13px] font-medium text-[#666]">Engagement</p>
                            <div className="flex items-start gap-6 px-4 py-[13px] bg-[#fcfcfc] rounded-lg border border-[#EFEFF3]">
                                <div className="flex flex-col gap-2">
                                    <span className="text-[13px] font-medium text-[#666]">Likes</span>
                                    <span className="text-[13px] font-medium text-[#666]">{formatNumber(likes)}</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className="text-[13px] font-medium text-[#666]">Comments</span>
                                    <span className="text-[13px] font-medium text-[#484848]">{comments}</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className="text-[13px] font-medium text-[#666]">Participants in replies</span>
                                    <span className="text-[13px] font-medium text-[#484848]">{participants_count}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-2 px-4 py-3 bg-white border-t border-[#E8E8E8] shrink-0">
                <button
                    className="flex-1 py-[10px] text-[13px] font-medium text-[#666] border border-[#E8E8E8] rounded-lg cursor-pointer hover:bg-[#f5f5f5] transition-colors"
                    onClick={onRemovePost}
                >
                    Remove Post
                </button>
                <button
                    className="flex-1 py-[10px] text-[13px] font-medium text-[#666] border border-[#E8E8E8] rounded-lg cursor-pointer hover:bg-[#f5f5f5] transition-colors"
                    onClick={onSuspendUser}
                >
                    Suspend User
                </button>
            </div>
        </div>
    );
}
