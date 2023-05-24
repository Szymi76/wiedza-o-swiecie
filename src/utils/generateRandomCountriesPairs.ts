import { Country } from "@/types";

export default function generateRandomCountriesPairs(countries: Country[]) {
  let array = [...countries];
  const pairs: [Country, Country][] = [];

  if (array.length % 2 != 0) array.pop();

  while (array.length > 1) {
    const firstRandomIndex = Math.floor(Math.random() * array.length);
    const secondRandomIndex = Math.floor(Math.random() * array.length);

    if (firstRandomIndex == secondRandomIndex) continue;

    pairs.push([array[firstRandomIndex], array[secondRandomIndex]]);

    array = array.filter((_, index) => index != firstRandomIndex && index != secondRandomIndex);
  }

  return { pairs };
}
