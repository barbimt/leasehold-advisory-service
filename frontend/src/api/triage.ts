import { ApiError, postJson } from './http.ts';
import type { ScenarioValue } from '../features/enquiry/scenarios.ts';

export const TRIAGE_PATH = '/api/triage/';
export const UNKNOWN_TOPIC_SLUG = 'unknown';

export type TriageRequest = {
  scenario?: ScenarioValue;
  description?: string;
};

export type GuidanceResource = {
  title: string;
  summary: string;
  url: string;
  linkText: string;
};

export type TriageTopic = {
  slug: string;
  label: string;
  summary: string;
  nextStep: string;
  primaryResource: GuidanceResource | null;
  relatedResources: GuidanceResource[];
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const parseGuidanceResource = (value: unknown): GuidanceResource => {
  if (!isRecord(value)) {
    throw new ApiError('invalid-response');
  }

  const { title, summary, url, linkText } = value;

  if (
    typeof title !== 'string' ||
    typeof summary !== 'string' ||
    typeof url !== 'string' ||
    typeof linkText !== 'string'
  ) {
    throw new ApiError('invalid-response');
  }

  return { title, summary, url, linkText };
};

const parseTriageTopic = (value: unknown): TriageTopic => {
  if (!isRecord(value) || !isRecord(value.topic)) {
    throw new ApiError('invalid-response');
  }

  const { slug, label, summary, nextStep, primaryResource, relatedResources } =
    value.topic;

  if (
    typeof slug !== 'string' ||
    typeof label !== 'string' ||
    typeof summary !== 'string' ||
    typeof nextStep !== 'string' ||
    !Array.isArray(relatedResources)
  ) {
    throw new ApiError('invalid-response');
  }

  return {
    slug,
    label,
    summary,
    nextStep,
    primaryResource:
      primaryResource === null ? null : parseGuidanceResource(primaryResource),
    relatedResources: relatedResources.map(parseGuidanceResource),
  };
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
