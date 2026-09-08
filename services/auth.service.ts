import bcrypt from "bcryptjs";
import User from "@/models/User";
import Organization from "@/models/Organization";
import { RegisterInput } from "@/validations/auth.validation";
import { LoginInput } from "@/validations/auth.validation";
import { generateToken } from "@/utils/generateToken";

export async function registerUser(data: RegisterInput) {
  const { name, email, password, organizationName } = data;

  // Check existing user
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user first
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    provider: "credentials",
    role: "USER",
    isEmailVerified: false,
  });

  try {
    // Create organization
    const organization = await Organization.create({
      name: organizationName,
      slug: `${organizationName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")}-${Date.now()}`,
      ownerId: user._id,
    });

    // Connect user with organization
    user.organizationId = organization._id;

    await user.save();

    // Never return password
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
      provider: user.provider,
      isEmailVerified: user.isEmailVerified,
    };

    return {
      user: userResponse,
      organization,
    };
  } catch (error) {
    // If organization creation fails,
    // remove the user that was just created.
    await User.findByIdAndDelete(user._id);

    throw error;
  }
}


export async function loginUser(data: LoginInput) {
  const { email, password } = data;

  // Find user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Compare password
  const isPasswordCorrect = await bcrypt.compare(
    password,
    user.password!,
  );

  if (!isPasswordCorrect) {
    throw new Error("Invalid email or password");
  }

  // Generate JWT
  const token = generateToken({
    userId: user._id.toString(),
    organizationId: user.organizationId?.toString(),
    role: user.role,
  });

  // Never return password
  const userResponse = {
    id: user._id,
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role,
    organizationId: user.organizationId,
    provider: user.provider,
    isEmailVerified: user.isEmailVerified,
  };

  return {
    user: userResponse,
    token,
  };
}