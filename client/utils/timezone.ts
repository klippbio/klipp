import { ICity, TimezoneInfo } from "@/components/ui/timezoneSelect";

function findPartialMatch(itemsToSearch: string, searchString: string) {
  const searchItems = searchString.split(" ");
  return searchItems.every(
    (i) => itemsToSearch.toLowerCase().indexOf(i.toLowerCase()) >= 0
  );
}

function findFromCity(searchString: string, data: ICity[]): ICity[] {
  if (searchString) {
    const cityLookup = data.filter((o) =>
      findPartialMatch(o.city, searchString)
    );
    return cityLookup?.length ? cityLookup : [];
  }
  return [];
}

export const filterByCities = (tz: string, data: ICity[]): ICity[] => {
  const cityLookup = findFromCity(tz, data);
  return cityLookup.map(({ city, timezone }) => ({ city, timezone }));
};

export const addCitiesToDropdown = (cities: ICity[]) => {
  const cityTimezones = cities?.reduce(
    (acc: { [key: string]: string }, city: ICity) => {
      if (city.timezone !== null && !isProblematicTimezone(city.timezone)) {
        acc[city.timezone] = city.city;
      }
      return acc;
    },
    {}
  );
  return cityTimezones || {};
};

export const handleOptionLabel = (option: TimezoneInfo, cities: ICity[]) => {
  const timezoneValue = option.label
    .split(")")[0]
    .replace("(", " ")
    .replace("T", "T ");
  const cityName = option.label.split(") ")[1];
  const refactoredOption = option.value.replace(/_/g, " ");
  const optionLabel =
    cities.length > 0
      ? `${cityName}${timezoneValue}`
      : `${refactoredOption}${timezoneValue}`;
  return optionLabel;
};

function isProblematicTimezone(tz: string): boolean {
  const problematicTimezones = [
    "null",
    "Africa/Malabo",
    "Africa/Maseru",
    "Africa/Mbabane",
    "America/Anguilla",
    "America/Antigua",
    "America/Aruba",
    "America/Bahia",
    "America/Cayman",
    "America/Dominica",
    "America/Grenada",
    "America/Guadeloupe",
    "America/Kralendijk",
    "America/Lower_Princes",
    "America/Maceio",
    "America/Marigot",
    "America/Montserrat",
    "America/Nassau",
    "America/St_Barthelemy",
    "America/St_Kitts",
    "America/St_Lucia",
    "America/St_Thomas",
    "America/St_Vincent",
    "America/Tortola",
    "Antarctica/McMurdo",
    "Arctic/Longyearbyen",
    "Asia/Bahrain",
    "Atlantic/St_Helena",
    "Europe/Busingen",
    "Europe/Guernsey",
    "Europe/Isle_of_Man",
    "Europe/Mariehamn",
    "Europe/San_Marino",
    "Europe/Vaduz",
    "Europe/Vatican",
    "Indian/Comoro",
    "Pacific/Saipan",
    "Africa/Asmara",
  ];
  return problematicTimezones.includes(tz);
}
