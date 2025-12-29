// src/mocks/db/users.db.ts

import type { UserApi } from "@/features/users/types/user.types";


export const USERS_DB: UserApi[] = Array.from(
  { length: 137 },
  (_, i) => ({
    id: i + 1, // ✅ number, not string
    first_name: `First${i + 1}`,
    last_name: `Last${i + 1}`,
    email: `user${i + 1}@example.com`,
    communities_count: Math.floor(Math.random() * 10),
    is_active: i % 2 === 0,
    joined_at: new Date(
      Date.now() - i * 86_400_000
    ).toISOString(),
  })
);