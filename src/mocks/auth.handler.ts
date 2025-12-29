import { http, HttpResponse } from "msw";

type LoginBody = {
  email: string;
  password: string;
};

export const authHandler = http.post(
  "http://localhost:3000/api/auth/login",
  async ({ request }) => {
    const body = (await request.json()) as LoginBody;

    if (
      body.email === "admin@test.com" &&
      body.password === "password"
    ) {
      return HttpResponse.json({
        accessToken: "fake-access-token",
        refreshToken: "fake-refresh-token",
        user: {
          id: 1,
          email: body.email,
          name: "Admin User",
        },
      });
    }

    return HttpResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }
);