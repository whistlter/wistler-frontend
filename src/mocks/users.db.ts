// src/mocks/db/users.db.ts
import type { UserApi } from "@/features/users/types/user.types";

export const USERS_DB: UserApi[] = Array.from(
    { length: 137 },
    (_, i) => ({
        id: i + 1,
        first_name: `First${i + 1}`,
        last_name: `Last${i + 1}`,
        email: `user${i + 1}@example.com`,
        username: `user${i + 1}`,
        facebook_id: null,
        google_id: null,
        apple_id: null,
        country_code: "234",
        phone: "8123456789",
        dob: "1990-01-01",
        gender: "male",
        email_otp: null,
        phone_otp: null,
        email_otp_validated: true,
        phone_otp_validated: true,
        image: null,
        banner: null,
        status: i % 3 === 0 ? "active" : i % 3 === 1 ? "non-onboarded" : "blocked",
        country: "Nigeria",
        refer_by_username: null,
        biography: "I am a user",
        last_active: null,
        is_deleted: false,
        createdAt: new Date(Date.now() - i * 86_400_000).toISOString(),
        updatedAt: new Date(Date.now() - i * 86_400_000).toISOString(),
        community_members: [],
        myCommunityCount: Math.floor(Math.random() * 10),
    })
);
