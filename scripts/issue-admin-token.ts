import { issueAdminToken } from "../src/lib/auth";

async function main() {
  const args = process.argv.slice(2);
  let expiry: string | undefined = "30d";

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--expiry" && args[i + 1]) {
      expiry = args[i + 1];
      i++;
    } else if (arg.startsWith("--expiry=")) {
      expiry = arg.split("=")[1];
    }
  }

  try {
    const token = await issueAdminToken({ expiresIn: expiry });
    process.stdout.write(token + "\n");
  } catch {
    process.stderr.write("Failed to issue admin token\n");
    process.exit(1);
  }
}

main();
