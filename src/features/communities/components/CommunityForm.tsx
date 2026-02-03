import { Button } from "@/components/button/Button";
import { BUTTON_TYPE } from "@/components/button/constants";
import { INPUT_TYPES } from "@/components/inputs/constants";
import { FormInput } from "@/components/inputs/FormInput";
import { SelectComponent } from "@/components/select/selectComponent";
import { AppIcons } from "@/constants/constant";
import { useState } from "react";
import FileUpload from "@/components/fileUpload/upload";
import { showErrorToast } from "@/components/common/toastUtils";

import type { CreateCommunityPayload } from "@/features/communities/hooks/useCommunity";

export interface CommunityFormData {
    Community_Name?: string;
    description?: string;
    category?: string;
    Visibility?: string;
    visibility?: string;
    owner?: string;
}

interface CommunityFormProps {
    initialData?: CommunityFormData;
    close: () => void;
    onSubmit: (data: CreateCommunityPayload) => void;
    isPending: boolean;
    title: string;
}

export function CommunityForm({ initialData, close, onSubmit, isPending, title }: CommunityFormProps) {
    const [name, setName] = useState(initialData?.Community_Name || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [category, setCategory] = useState(initialData?.category || "");
    const [visibility, setVisibility] = useState(initialData?.Visibility || initialData?.visibility || "Public");
    const [owner, setOwner] = useState(initialData?.owner || "");
    const [image, setImage] = useState<File | null>(null);

    // Map category to interest_id
    const categoryToInterestId: Record<string, string> = {
        'Technology': '7',
        'Business': '8',
        'Lifestyle': '9',
        'Education': '10',
    };

    // Map owner to user_id
    const ownerToUserId: Record<string, string> = {
        'User 1': '1',
        'User 2': '2',
        'User 3': '3',
    };

    const handleSubmit = () => {
        if (!name.trim()) {
            showErrorToast("Validation Error", "Community name is required");
            return;
        }
        // Map UI fields to API payload format
        onSubmit({
            title: name,
            desc: description,
            interest_id: categoryToInterestId[category] || '1',
            visibility: visibility.toLowerCase() as 'private' | 'public',
            is_safe_space: 'no',
            is_member_screening: 'no',
            can_post_anonymously: 'no',
            user_id: ownerToUserId[owner] || '1',
            image: image || undefined,
        });
    };

    return (
        <div className="flex h-full flex-col bg-white">
            <div className="shrink-0 border-b border-[#E8E8E8] px-6 py-5 flex items-center justify-between">
                <h2 className="text-2xl font-bold">{title}</h2>
                <button onClick={close} className="cursor-pointer">
                    <img src={AppIcons.x} alt="Close" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
                <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-2">Community Name</label>
                    <FormInput
                        placeholder="Enter name"
                        type={INPUT_TYPES.TEXT}
                        value={name}
                        onChange={setName}
                    />
                </div>

                <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-2">Description</label>
                    <FormInput
                        placeholder="Enter description"
                        type={INPUT_TYPES.TEXTAREA}
                        value={description}
                        onChange={setDescription}
                    />
                </div>

                <div>
                    <label className="text-[13px] font-medium text-gray-700 mb-2">Category</label>
                    <SelectComponent
                        data={['Technology', 'Business', 'Lifestyle', 'Education']}
                        placeholder="Select"
                        value={category}
                        onChange={(val) => setCategory(val as string)}
                    />
                </div>

                <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-2">Image</label>
                    <FileUpload onFileSelect={setImage} />
                </div>

                <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-2">Visibility</label>
                    <SelectComponent
                        data={['Public', 'Private']}
                        placeholder="Select Visibility"
                        value={visibility}
                        onChange={(val) => setVisibility(val as string)}
                    />
                </div>

                <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-2">Owner Assignment</label>
                    <p className="text-[13px] text-[#969696] mb-2">Select a user to own and manage this community.</p>
                    <SelectComponent
                        data={['User 1', 'User 2', 'User 3']}
                        placeholder="Select User"
                        value={owner}
                        onChange={(val) => setOwner(val as string)}
                    />
                </div>
            </div>

            <div className="shrink-0 border-t border-[#E8E8E8] bg-white px-6 py-5">
                <div className="flex gap-3">
                    <Button onClick={close} variant={BUTTON_TYPE.SECONDARY}>Cancel</Button>
                    <Button onClick={handleSubmit} loading={isPending}>
                        {initialData ? "Update Community" : "Create Community"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
