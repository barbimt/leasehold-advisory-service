import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import axe from 'axe-core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TRIAGE_PATH } from '../../api/triage.ts';
import App from '../../App.tsx';
import {
  DESCRIPTION_FIELD_ID,
  ERROR_SUMMARY_ID,
  RESULT_HEADING_ID,
  SITUATION_FIELDSET_ID,
  SUBMISSION_ERROR_ID,
} from './ids.ts';
import { SCENARIO_OPTIONS } from './scenarios.ts';
import {
  fetchMock,
  jsonResponse,
  postedBody,
  stubTriageFetch,
  submitForm,
  topic,
} from '../../test/appTest.ts';

describe('enquiry page', () => {
  beforeEach(() => {
    stubTriageFetch();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders a page heading', () => {
    render(<App />);

    const heading = screen.getByRole('heading', { level: 1 });

    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toEqual(expect.any(String));
    expect(heading.textContent?.trim()).not.toBe('');
  });

  it('lets the user select each situation with the keyboard', async () => {
    const user = userEvent.setup();
    render(<App />);

    const radios = screen.getAllByRole('radio');

    expect(radios).toHaveLength(SCENARIO_OPTIONS.length);

    for (const radio of radios) {
      radio.focus();
      await user.keyboard(' ');
      expect(radio).toBeChecked();
    }
  });

  it('lets the user enter a description', async () => {
    const user = userEvent.setup();
    render(<App />);

    const description = screen.getByRole('textbox');
    await user.type(description, 'The roof needs work');

    expect(description).toHaveValue('The roof needs work');
  });

  it('accepts a situation without a description', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getAllByRole('radio')[0]);
    await user.click(screen.getByRole('button', { name: /find guidance/i }));

    await waitFor(() => {
      expect(document.getElementById(RESULT_HEADING_ID)).toBeInTheDocument();
    });
    expect(document.getElementById(ERROR_SUMMARY_ID)).not.toBeInTheDocument();
  });

  it('accepts a description without a situation', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('textbox'), 'The roof needs work');
    await user.click(screen.getByRole('button', { name: /find guidance/i }));

    await waitFor(() => {
      expect(document.getElementById(RESULT_HEADING_ID)).toBeInTheDocument();
    });
    expect(document.getElementById(ERROR_SUMMARY_ID)).not.toBeInTheDocument();
  });

  it('shows an error summary when both fields are empty', async () => {
    render(<App />);

    await submitForm();

    const summary = document.getElementById(ERROR_SUMMARY_ID);

    expect(summary).toBeInTheDocument();
    expect(summary).not.toHaveAttribute('role');
    expect(
      screen.getByRole('link', { name: /situation or tell us/i }),
    ).toHaveAttribute('href', `#${SITUATION_FIELDSET_ID}`);
    expect(fetchMock()).not.toHaveBeenCalled();
  });

  it('moves focus to the error summary after invalid submission', async () => {
    render(<App />);

    await submitForm();

    await waitFor(() => {
      expect(document.activeElement).toBe(
        document.getElementById(ERROR_SUMMARY_ID),
      );
    });
  });

  it('clears the situation, description and errors on reset', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getAllByRole('radio')[0]);
    await user.type(screen.getByRole('textbox'), 'The roof needs work');
    await user.click(screen.getByRole('button', { name: /clear/i }));

    expect(
      screen
        .getAllByRole('radio')
        .every((radio) => radio instanceof HTMLInputElement && !radio.checked),
    ).toBe(true);
    expect(screen.getByRole('textbox')).toHaveValue('');
    expect(document.getElementById(ERROR_SUMMARY_ID)).not.toBeInTheDocument();
    expect(document.activeElement).toBe(screen.getAllByRole('radio')[0]);
  });

  it('associates help text with the description field', () => {
    render(<App />);

    const description = screen.getByRole('textbox');

    expect(description).toHaveAccessibleName();
    expect(description.getAttribute('aria-describedby')).toContain(
      `${DESCRIPTION_FIELD_ID}-route`,
    );
  });

  it('associates a visible label with each situation choice', () => {
    render(<App />);

    for (const radio of screen.getAllByRole('radio')) {
      expect(radio).toHaveAccessibleName();
    }
  });

  it('keeps major works and repairs as distinct choices', () => {
    render(<App />);

    const radios = screen.getAllByRole('radio');
    const labelFor = (radio: HTMLElement) => {
      const id = radio.getAttribute('id');
      return id
        ? (document.querySelector(`label[for="${id}"]`)?.textContent?.trim() ??
            '')
        : '';
    };

    expect(labelFor(radios[1])).not.toBe('');
    expect(labelFor(radios[2])).not.toBe('');
    expect(labelFor(radios[1])).not.toBe(labelFor(radios[2]));
  });

  it('has no automated accessibility violations on first load', async () => {
    const { container } = render(<App />);
    const results = await axe.run(container);

    expect(results.violations).toEqual([]);
  });

  it('has no automated accessibility violations after invalid submit', async () => {
    const { container } = render(<App />);

    await submitForm();

    const results = await axe.run(container);

    expect(results.violations).toEqual([]);
  });

  it('submits a selected situation to the triage API', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getAllByRole('radio')[0]);
    await user.click(screen.getByRole('button', { name: /find guidance/i }));

    await waitFor(() => {
      expect(fetchMock()).toHaveBeenCalledWith(
        TRIAGE_PATH,
        expect.objectContaining({ method: 'POST' }),
      );
    });
    expect(postedBody()).toEqual({
      scenario: SCENARIO_OPTIONS[0].value,
    });
  });

  it('submits a description to the triage API', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('textbox'), 'The roof needs work');
    await user.click(screen.getByRole('button', { name: /find guidance/i }));

    await waitFor(() => {
      expect(fetchMock()).toHaveBeenCalledTimes(1);
    });
    expect(postedBody()).toEqual({
      description: 'The roof needs work',
    });
  });

  it('submits both a situation and a description', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getAllByRole('radio')[0]);
    await user.type(screen.getByRole('textbox'), 'The roof needs work');
    await user.click(screen.getByRole('button', { name: /find guidance/i }));

    await waitFor(() => {
      expect(fetchMock()).toHaveBeenCalledTimes(1);
    });
    expect(postedBody()).toEqual({
      scenario: SCENARIO_OPTIONS[0].value,
      description: 'The roof needs work',
    });
  });

  it('shows submitting feedback and prevents a duplicate request', async () => {
    let release: ((value: Response) => void) | undefined;
    fetchMock().mockImplementation(
      () =>
        new Promise((resolve) => {
          release = resolve;
        }),
    );

    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getAllByRole('radio')[0]);
    await user.click(screen.getByRole('button', { name: /find guidance/i }));

    const submitting = await screen.findByRole('button', {
      name: /finding/i,
    });
    expect(submitting).toBeDisabled();
    expect(screen.getByRole('button', { name: /clear/i })).toBeDisabled();

    await user.click(submitting);
    expect(fetchMock()).toHaveBeenCalledTimes(1);

    release?.(jsonResponse({ topic }));

    await waitFor(() => {
      expect(document.getElementById(RESULT_HEADING_ID)).toBeInTheDocument();
    });
    expect(
      screen.queryByRole('button', { name: /find guidance/i }),
    ).not.toBeInTheDocument();
  });

  it('shows accessible feedback when the request fails and keeps values', async () => {
    const marker = 'UNIQUE_ENQUIRY_MARKER_9f3c2a';
    fetchMock().mockRejectedValueOnce(new TypeError('Failed to fetch'));

    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('textbox'), marker);
    await user.click(screen.getByRole('button', { name: /find guidance/i }));

    const error = await waitFor(() => {
      const node = document.getElementById(SUBMISSION_ERROR_ID);
      expect(node).toBeInTheDocument();
      return node;
    });

    expect(error).not.toHaveAttribute('role');
    expect(error?.textContent).toEqual(expect.any(String));
    expect(error?.textContent?.trim()).not.toBe('');
    expect(error?.textContent).not.toContain(marker);
    expect(screen.getByRole('textbox')).toHaveValue(marker);

    await waitFor(() => {
      expect(document.activeElement).toBe(error);
    });
  });

  it('shows accessible feedback for an unexpected server response', async () => {
    fetchMock().mockResolvedValueOnce(jsonResponse({ error: 'nope' }, 500));

    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getAllByRole('radio')[0]);
    await user.click(screen.getByRole('button', { name: /find guidance/i }));

    const error = await waitFor(() => {
      const node = document.getElementById(SUBMISSION_ERROR_ID);
      expect(node).toBeInTheDocument();
      return node;
    });

    expect(error?.textContent?.trim()).not.toBe('');
    expect(error?.textContent).toMatch(/try again later/i);
    expect(error?.textContent).not.toMatch(/check your answers/i);
    expect(screen.getAllByRole('radio')[0]).toBeChecked();
  });
});
