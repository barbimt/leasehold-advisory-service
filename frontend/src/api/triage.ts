import { ApiError, postJson } from './http.ts';
import type { ScenarioValue } from '../features/enquiry/scenarios.ts';

export const TRIAGE_PATH = '/api/triage/';

export type TriageRequest = {
  scenario?: ScenarioValue;
  description?: string;
};

export type TriageTopic = {
  slug: string;
  label: string;
  summary: string;
  nextStep: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const parseTriageTopic = (value: unknown): TriageTopic => {
  if (!isRecord(value) || !isRecord(value.topic)) {
    throw new ApiError('invalid-response');
  }

  const { slug, label, summary, nextStep } = value.topic;

  if (
    typeof slug !== 'string' ||
    typeof label !== 'string' ||
    typeof summary !== 'string' ||
    typeof nextStep !== 'string'
  ) {
    throw new ApiError('invalid-response');
  }

  return { slug, label, summary, nextStep };
};

export const toTriageRequest = (
  scenario: ScenarioValue | null,
  description: string,
): TriageRequest => {
  const request: TriageRequest = {};

  if (scenario !== null) {
    request.scenario = scenario;
  }

  const trimmedDescription = description.trim();
  if (trimmedDescription.length > 0) {
    request.description = trimmedDescription;
  }

  return request;
};

export const submitTriage = async (
  scenario: ScenarioValue | null,
  description: string,
): Promise<TriageTopic> => {
  const payload = await postJson(
    TRIAGE_PATH,
    toTriageRequest(scenario, description),
  );

  return parseTriageTopic(payload);
};
