export const DESCRIPTION_MAX_LENGTH = 2000;

export const SCENARIO_VALUES = [
  'service_charges',
  'major_works',
  'repairs',
  'lease_extension',
  'disputes',
  'not_sure',
] as const;

export type ScenarioValue = (typeof SCENARIO_VALUES)[number];

export type ScenarioOption = {
  value: ScenarioValue;
  label: string;
  hint?: string;
};

export const SCENARIO_OPTIONS: ScenarioOption[] = [
  {
    value: 'service_charges',
    label: 'I have a question about a charge or bill',
    hint: 'This includes service charges, ground rent, administration fees, or a demand you do not understand.',
  },
  {
    value: 'major_works',
    label: 'My building needs repairs or major work',
    hint: 'This includes work to the roof, windows or lifts, or a consultation letter about planned works.',
  },
  {
    value: 'repairs',
    label: 'Something in my building is not being repaired',
    hint: 'This includes damp, leaks, or communal areas that are not being maintained.',
  },
  {
    value: 'lease_extension',
    label: 'I want to extend my lease',
  },
  {
    value: 'disputes',
    label: "I'm having a disagreement with my landlord or managing agent",
    hint: 'This includes poor communication, a formal notice, or a dispute you cannot resolve.',
  },
  {
    value: 'not_sure',
    label: "Something else, or I'm not sure",
  },
];

export const hasMeaningfulInput = (
  scenario: ScenarioValue | null,
  description: string,
) => scenario !== null || description.trim().length > 0;
