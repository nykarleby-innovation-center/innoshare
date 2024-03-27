import { interestFormSchema } from "@/schemas/interest-form";

export async function POST(req: Request) {
  const data = interestFormSchema.parse(await req.json());

  console.log(data);

  return Response.json([]);
}
