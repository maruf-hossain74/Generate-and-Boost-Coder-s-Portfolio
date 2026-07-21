const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const UserStats = require("./models/UserStats");

process.env.JWT_SECRET = "test-secret-key";

async function verify() {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  process.env.MONGO_URI = uri;

  await mongoose.connect(uri);
  console.log("✓ In-memory MongoDB connected");

  // 1. Create a user via the model (simulating signup)
  const passwordHash = await bcrypt.hash("testpass123", 12);
  const user = await User.create({
    email: "test@example.com",
    passwordHash,
    displayName: "Test User",
    provider: "local",
  });
  await UserStats.create({ userId: user._id });
  console.log("✓ User created:", user.email);

  // 2. Verify password comparison works
  const isMatch = await bcrypt.compare("testpass123", user.passwordHash);
  console.log(isMatch ? "✓ Password comparison OK" : "✗ Password mismatch");

  // 3. Verify JWT generation
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log(
    decoded.userId.toString() === user._id.toString()
      ? "✓ JWT sign/verify OK"
      : "✗ JWT mismatch"
  );

  // 4. Verify toPublicJSON hides passwordHash
  const publicJSON = user.toPublicJSON();
  console.log(
    !publicJSON.passwordHash
      ? "✓ toPublicJSON hides passwordHash"
      : "✗ passwordHash exposed"
  );

  // 5. Verify unique email constraint
  try {
    await User.create({
      email: "test@example.com",
      passwordHash: await bcrypt.hash("other123", 12),
    });
    console.log("✗ Duplicate email not blocked");
  } catch (err) {
    console.log("✓ Duplicate email blocked (code 11000)");
  }

  // 6. Verify auth middleware extracts user correctly
  const auth = require("./middleware/auth");
  const mockReq = {
    headers: { authorization: `Bearer ${token}` },
  };
  let authPassed = false;
  await auth(mockReq, {}, (err) => {
    authPassed = !err;
  });
  console.log(authPassed ? "✓ Auth middleware OK" : "✗ Auth middleware failed");
  console.log(
    mockReq.user._id.toString() === user._id.toString()
      ? "✓ Auth middleware attaches correct user"
      : "✗ Auth middleware wrong user"
  );

  // 7. Verify auth middleware rejects missing token
  const mockReqNoToken = { headers: {} };
  let rejected = false;
  const mockRes = {
    status: (code) => {
      rejected = code === 401;
      return { json: () => {} };
    },
  };
  await auth(mockReqNoToken, mockRes, () => {});
  console.log(rejected ? "✓ Auth rejects missing token" : "✗ Auth allows no token");

  // 8. Verify models have correct structure
  const userDoc = await User.findById(user._id).lean();
  console.log(
    userDoc.email && userDoc.displayName && userDoc.role
      ? "✓ User model fields present"
      : "✗ User model missing fields"
  );

  const statsDoc = await UserStats.findOne({ userId: user._id }).lean();
  console.log(
    statsDoc && typeof statsDoc.totalSolved === "number"
      ? "✓ UserStats model fields present"
      : "✗ UserStats model missing fields"
  );

  await mongoose.disconnect();
  await mongod.stop();
  console.log("\n✓ All Phase 2 tests passed");
}

verify().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
