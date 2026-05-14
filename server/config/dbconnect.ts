import dotenv from "dotenv";
import { prisma } from "../lib/prisma.ts";
import { normalizePhoneDigits } from "../utils/phoneNormalize.ts";

dotenv.config();

async function backfillPhoneNormalized(): Promise<void> {
  const rows = await prisma.studentApplication.findMany({
    where: {
      OR: [{ phoneNormalized: null }, { phoneNormalized: "" }],
    },
    select: { id: true, phone: true },
  });
  for (const r of rows) {
    const digits = normalizePhoneDigits(r.phone);
    if (digits.length >= 5) {
      await prisma.studentApplication.update({
        where: { id: r.id },
        data: { phoneNormalized: digits },
      });
    }
  }
  if (rows.length) {
    console.log(`Checked phone_normalized for ${rows.length} application row(s)`);
  }
}

export async function connectDB(): Promise<void> {
  await prisma.$connect();
  console.log("PostgreSQL connected ✔");
  await backfillPhoneNormalized();
}
