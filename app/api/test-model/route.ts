import { NextResponse } from "next/server";
import { DatabaseConnection } from "@/lib/db";
import User from "@/models/User";
import Organization from "@/models/Organization";

export async function POST() {
  try {
    await DatabaseConnection();

    // 1. Create User
    const user = await User.create({
      name: "Muhammad Muzammil",
      email: "muzammil@test.com",
      password: "123456",
    });

    // 2. Create Organization
    const organization = await Organization.create({
      name: "Muzammil Tech",
      slug: "muzammil-tech",
      ownerId: user._id,
    });

    // 3. Update User with Organization ID
    user.organizationId = organization._id;
    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "User and Organization created successfully",
        data: {
          user,
          organization,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}