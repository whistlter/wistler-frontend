import { Button } from "@/components/button/Button";
import { BUTTON_TYPE } from "@/components/button/constants";
import { INPUT_TYPES } from "@/components/inputs/constants";
import { FormInput } from "@/components/inputs/FormInput";
import { SelectComponent } from "@/components/select/selectComponent";
import { MultiSelectComponent } from "@/components/select/MultiSelectComponent";
import { AppIcons } from "@/constants/constant";
import { useState, useMemo } from "react";
import FileUpload from "@/components/fileUpload/upload";
import { showErrorToast } from "@/components/common/toastUtils";

import type { CreateCommunityPayload } from "@/features/communities/hooks/useCommunity";
import { useInterests } from "@/features/communities/hooks/useCommunity";
import { useUsers } from "@/features/users/hooks/useUsers";

export interface CommunityFormData {
    Community_Name?: string;
    description?: string;
    category?: string;
    Visibility?: string;
    visibility?: string;
    owner?: string;
    image?: string | null;
    user_id?: number;
    interest_id?: number;
    is_safe_space?: boolean;
    is_member_screening?: boolean;
    can_post_anonymously?: boolean;
    community_interests?: Array<{
        interest_id: number;
        interest: {
            id: number;
            title: string;
        };
    }>;
}

interface CommunityFormProps {
    initialData?: CommunityFormData;
    close: () => void;
    onSubmit: (data: CreateCommunityPayload) => void;
    isPending: boolean;
    title: string;
}

// Helper to capitalize first letter (e.g., "private" -> "Private")
function capitalizeFirst(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function CommunityForm({ initialData, close, onSubmit, isPending, title }: CommunityFormProps) {
    // Fetch interests for category dropdown
    const { data: interestsData } = useInterests();

    // Fetch users for owner dropdown (only in edit mode)
    const { data: usersData } = useUsers(1, 100);

    // Build interest options from API data
    const interestOptions = useMemo(() => {
        const interests = (interestsData as { payload?: { interests?: { id: number; title: string }[] } })?.payload?.interests || [];
        // Map using actual database IDs, not array indexes
        return interests.map(interest => ({
            id: interest.id, // This is the actual database ID
            label: interest.title,
        }));
    }, [interestsData]);

    // Build user options for owner dropdown
    const userOptions = useMemo(() => {
        const users = (usersData as { payload?: { users?: { id: number; username: string }[] } })?.payload?.users || [];
        return users.map(user => ({
            value: user.id,
            label: user.username,
        }));
    }, [usersData]);

    // Derive initial selected categories from community_interests
    const initialSelectedCategories = (() => {
        if (initialData?.community_interests && initialData.community_interests.length > 0) {
            return initialData.community_interests.map(ci => ci.interest_id);
        }
        // Fallback to single interest_id if available
        if (initialData?.interest_id) {
            return [initialData.interest_id];
        }
        return [];
    })();

    const initialOwnerLabel = initialData?.owner || "";

    const [name, setName] = useState(initialData?.Community_Name || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [selectedCategories, setSelectedCategories] = useState<number[]>(initialSelectedCategories);
    const [visibility, setVisibility] = useState(capitalizeFirst(initialData?.Visibility || initialData?.visibility || "Public"));
    const [image, setImage] = useState<File | null>(null);
    const [owner, setOwner] = useState<number | string>(initialData?.user_id || "");

    // Initialize boolean fields from initialData, converting boolean to 'yes'/'no'
    const [isSafeSpace] = useState<'yes' | 'no'>(initialData?.is_safe_space ? 'yes' : 'no');
    const [isMemberScreening] = useState<'yes' | 'no'>(initialData?.is_member_screening ? 'yes' : 'no');
    const [canPostAnonymously] = useState<'yes' | 'no'>(initialData?.can_post_anonymously ? 'yes' : 'no');

    const effectiveOwner = owner || initialOwnerLabel;


    const handleSubmit = async () => {
        if (!name.trim()) {
            showErrorToast("Validation Error", "Community name is required");
            return;
        }

        if (selectedCategories.length === 0) {
            showErrorToast("Validation Error", "Please select at least one category");
            return;
        }

        // Convert selected category IDs to comma-separated string
        const interestIds = selectedCategories.join(',');
        console.log('Selected Categories (Actual DB IDs):', selectedCategories);
        console.log('Interest IDs String:', interestIds);

        // Map UI fields to API payload format
        const payload: CreateCommunityPayload = {
            title: name,
            desc: description,
            interest_id: interestIds,
            visibility: visibility.toLowerCase() as 'private' | 'public',
            is_safe_space: isSafeSpace,
            is_member_screening: isMemberScreening,
            can_post_anonymously: canPostAnonymously,
            image: image || undefined,
        };

        // Only include user_id when editing (initialData exists) and owner is set
        if (initialData && owner) {
            payload.user_id = owner.toString();
        }

        onSubmit(payload);
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
                    <label className="block text-[13px] font-medium text-gray-700 mb-2">Category</label>
                    <MultiSelectComponent
                        data={interestOptions.map(i => ({ value: i.id, label: i.label }))}
                        placeholder="Select categories"
                        value={selectedCategories}
                        onChange={(val) => setSelectedCategories(val as number[])}
                    />
                </div>

                <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-2">Image</label>
                    <FileUpload onFileSelect={setImage} initialImageUrl={initialData?.image} />
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

                {/* Owner Assignment - Only show in edit mode */}
                {initialData && (
                    <div>
                        <label className="block text-[13px] font-medium text-gray-700 mb-2">Owner Assignment</label>
                        <p className="text-[11px] text-gray-500 mb-2">Select a user to own and manage this community.</p>
                        <SelectComponent
                            data={userOptions}
                            placeholder="Select owner"
                            value={effectiveOwner}
                            onChange={(val) => setOwner(val as number)}
                        />
                    </div>
                )}
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
