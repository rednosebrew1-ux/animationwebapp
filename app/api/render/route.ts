import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { titleText, backgroundColor } = await request.json();

  const renderId = `vid-${Date.now()}`;

  const githubResponse = await fetch(
    "https://api.github.com/repos/rednosebrew1-ux/animationwebapp/dispatches",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify({
        event_type: "trigger-video-render",
        client_payload: {
          titleText,
          backgroundColor,
          renderId,
        },
      }),
    }
  );

  if (githubResponse.ok || githubResponse.status === 204) {
    return NextResponse.json({ success: true, renderId });
  } else {
    const err = await githubResponse.text();
    console.error("GitHub dispatch error:", err);
    return NextResponse.json(
      { error: "Failed to queue rendering pipeline" },
      { status: 500 }
    );
  }
}
