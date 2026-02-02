import { useState } from "react";
import { AppIcons } from "@/constants/constant";
import { showSuccessToast, showErrorToast } from "@/components/common/toastUtils";
import { useCreateCommunity } from "@/features/communities";
import { Button } from "@/components/button/Button";
import { BUTTON_TYPE } from "@/components/button/constants";
import { FormInput } from "@/components/inputs/FormInput";
import { INPUT_TYPES } from "@/components/inputs/constants";
import FileUpload from "@/components/fileUpload/upload";
import { SelectComponent } from "@/components/select/selectComponent";

interface CreateCommunityModalProps {
    close: () => void;
}

export const CreateCommunityModal = ({ close }: CreateCommunityModalProps) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [visibility, setVisibility] = useState("Public");
    const [owner, setOwner] = useState("");
    const [image, setImage] = useState<File | null>(null);

    const { mutate: createCommunity, isPending: isCreating } = useCreateCommunity();
    const Appicon = { ...AppIcons };

    const handleSubmit = () => {
        if (!name.trim()) {
            showErrorToast("Validation Error", "Community name is required");
            return;
        }
        createCommunity({
            title: name,
            desc: description,
            interest_id: "1", // Mock ID or map from category
            visibility: visibility.toLowerCase() as 'public' | 'private',
            is_safe_space: 'no',
            is_member_screening: 'no',
            can_post_anonymously: 'yes',
            user_id: owner || "1", // Default to 1 if not selected
            image: image || undefined,
        }, {
            onSuccess: () => {
                showSuccessToast("Community Created", "You can now manage members for this community.");
                close();
            },
            onError: (err) => {
                showErrorToast("Creation Failed", "Failed to create community");
                console.error(err);
            }
        });
    };

    return (
        <div className="flex h-full flex-col bg-white">
            {/* ... Header ... */}
            <div className="shrink-0 border-b border-[#E8E8E8] px-6 py-5 flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                    Create Community
                </h2>
                <button onClick={close} className="cursor-pointer">
                    <img src={Appicon.x} alt="Close" />
                </button>
            </div>

            {/* SCROLLABLE CONTENT */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
                <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-2">
                        Community Name
                    </label>
                    <FormInput
                        type={INPUT_TYPES.TEXT}
                        placeholder="e.g Young Shall Grow"
                        value={name}
                        onChange={(val) => setName(val)}
                    />
                </div>

                <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-2">
                        Description
                    </label>
                    <textarea
                        className="w-full min-h-[120px] p-3 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-1 focus:ring-[#FF2860] focus:border-[#FF2860] placeholder-gray-400 resize-none outline-none transition-colors"
                        placeholder="Tell people what your community is about..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-2">
                        Category
                    </label>
                    <SelectComponent
                        data={[
                            { value: 'Technology', label: 'Technology' },
                            { value: 'Health', label: 'Health' },
                            { value: 'Education', label: 'Education' },
                            { value: 'Entertainment', label: 'Entertainment' },
                        ]}
                        placeholder="Select category"
                        onChange={(val) => setCategory(String(val))}
                        value={category}
                    />
                </div>

                <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-2">
                        Visibility
                    </label>
                    <div className="flex bg-gray-100 p-1 rounded-lg w-fit">
                        {['Public', 'Private'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setVisibility(type)}
                                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${visibility === type
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-2">
                        Assign Owner (Optional)
                    </label>
                    <FormInput
                        type={INPUT_TYPES.TEXT}
                        placeholder="Search for user"
                        value={owner}
                        onChange={(val) => setOwner(val)}
                    />
                </div>

                <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-2">
                        Cover Image
                    </label>
                    <FileUpload
                        onFileSelect={(file) => setImage(file)}
                    />
                </div>
            </div>

            {/* FOOTER (FIXED) */}
            <div className="shrink-0 border-t border-[#E8E8E8] px-6 py-5 flex items-center justify-end gap-3">
                <Button
                    variant={BUTTON_TYPE.SECONDARY}
                    onClick={close}
                >
                    Cancel
                </Button>
                <Button
                    variant={BUTTON_TYPE.PRIMARY}
                    onClick={handleSubmit}
                    className="bg-[#FF2860] hover:bg-[#E02354] border-transparent"
                    disabled={isCreating}
                >
                    {isCreating ? "Creating..." : "Create Community"}
                </Button>
            </div>
        </div>
    );
};
