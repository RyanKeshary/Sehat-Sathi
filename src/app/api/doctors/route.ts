import { mockDoctors } from "@/app/consult/mockData";
import { NextResponse } from "next/server";

export async function GET() {
  // Simple mock API for MVP
  return NextResponse.json(mockDoctors);
}
