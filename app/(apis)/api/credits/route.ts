import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { error } from "console";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const us = await auth();
    if (!us)
      return NextResponse.json({ error: "unAuthorized" }, { status: 403 });
    const existingUser = await db.user.findUnique({
      where: { id: us.user?.id },
    });

    return NextResponse.json({
      credits: existingUser?.credits,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}
