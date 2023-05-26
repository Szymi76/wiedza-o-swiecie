import { redisClient } from "@/lib/redisClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const cachedCountries = await redisClient.get("countries");
  if (cachedCountries) return NextResponse.json({ countries: JSON.parse(cachedCountries) });

  const response = await fetch("https://restcountries.com/v3.1/all");
  const countries = await response.json();
  await redisClient.set("countries", JSON.stringify(countries));

  return NextResponse.json({ countries });
}
