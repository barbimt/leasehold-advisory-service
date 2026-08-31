import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import axe from 'axe-core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../../App.tsx';
import { RESULT_HEADING_ID, SUBMISSION_ERROR_ID } from '../enquiry/ids.ts';
import { LEASE_ENQUIRY_URL, LEASE_HOME_URL } from './leaseLinks.ts';
import {
  fetchMock,
  jsonResponse,
  primaryResource,
  relatedResource,
  stubTriageFetch,
  unknownTopic,
} from '../../test/appTest.ts';

describe('result page', () => {
  beforeEach(() => {
    stubTriageFetch();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('replaces the form with a result after a successful response', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getAllByRole('radio')[0]);
    await user.type(screen.getByRole('textbox'), 'The roof needs work');
    await user.click(screen.getByRole('button', { name: /find guidance/i }));

    const heading = await waitFor(() => {
      const node = document.getElementById(RESULT_HEADING_ID);
      expect(node).toBeInTheDocument();
      return node;
    });

    expect(heading?.textContent).toEqual(expect.any(String));
    expect(heading?.textContent?.trim()).not.toBe('');
    expect(heading?.textContent).toMatch(/relate to/i);
    expect(document.title).toMatch(/relate to/i);
    expect(
      screen.queryByRole('button', { name: /find guidance/i }),
    ).not.toBeInTheDocument();
    expect(
      document.getElementById(SUBMISSION_ERROR_ID),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /primary guide/i }),
    ).toHaveAttribute('href', primaryResource.url);
    expect(
      screen.getByRole('link', { name: /related guide/i }),
    ).toHaveAttribute('href', relatedResource.url);

    await waitFor(() => {
      expect(document.activeElement).toBe(heading);
    });
  });

  it('does not present unknown as a known topic result', async () => {
    fetchMock().mockResolvedValueOnce(jsonResponse({ topic: unknownTopic }));

    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getAllByRole('radio')[0]);
    await user.click(screen.getByRole('button', { name: /find guidance/i }));

    const heading = await waitFor(() => {
      const node = document.getElementById(RESULT_HEADING_ID);
      expect(node).toBeInTheDocument();
      return node;
    });

    expect(heading?.textContent).not.toMatch(/relate to/i);
    expect(document.title).not.toMatch(/relate to/i);
    expect(
      screen.queryByRole('link', { name: /primary guide/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /browse all/i })).toHaveAttribute(
      'href',
      LEASE_HOME_URL,
    );
    expect(
      screen.getByRole('link', { name: /request advice/i }),
    ).toHaveAttribute('href', LEASE_ENQUIRY_URL);
  });

  it('treats unknown slug as unmatched even if resources are present', async () => {
    fetchMock().mockResolvedValueOnce(
      jsonResponse({
        topic: {
          ...unknownTopic,
          primaryResource,
          relatedResources: [relatedResource],
        },
      }),
    );

    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getAllByRole('radio')[0]);
    await user.click(screen.getByRole('button', { name: /find guidance/i }));

    const heading = await waitFor(() => {
      const node = document.getElementById(RESULT_HEADING_ID);
      expect(node).toBeInTheDocument();
      return node;
    });

    expect(heading?.textContent).not.toMatch(/relate to/i);
    expect(
      screen.queryByRole('link', { name: /primary guide/i }),
    ).not.toBeInTheDocument();
  });

  it('returns to a clean form after start again', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getAllByRole('radio')[0]);
    await user.type(screen.getByRole('textbox'), 'The roof needs work');
    await user.click(screen.getByRole('button', { name: /find guidance/i }));

    await waitFor(() => {
      expect(document.getElementById(RESULT_HEADING_ID)).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /start again/i }));

    expect(
      screen.getByRole('button', { name: /find guidance/i }),
    ).toBeEnabled();
    expect(
      screen
        .getAllByRole('radio')
        .every((radio) => radio instanceof HTMLInputElement && !radio.checked),
    ).toBe(true);
    expect(screen.getByRole('textbox')).toHaveValue('');
    expect(document.getElementById(RESULT_HEADING_ID)).not.toBeInTheDocument();

    await waitFor(() => {
      expect(document.activeElement).toBe(screen.getAllByRole('radio')[0]);
    });
  });

  it('returns to the form with values kept after change my answers', async () => {
    const marker = 'UNIQUE_ENQUIRY_MARKER_change_answers';
    const user = userEvent.setup();
    render(<App />);

    const selected = screen.getAllByRole('radio')[1];
    await user.click(selected);
    await user.type(screen.getByRole('textbox'), marker);
    await user.click(screen.getByRole('button', { name: /find guidance/i }));

    await waitFor(() => {
      expect(document.getElementById(RESULT_HEADING_ID)).toBeInTheDocument();
    });
    expect(screen.getByText(marker)).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: /change my answers/i }),
    );

    expect(
      screen.getByRole('button', { name: /find guidance/i }),
    ).toBeEnabled();
    expect(screen.getAllByRole('radio')[1]).toBeChecked();
    expect(screen.getByRole('textbox')).toHaveValue(marker);
    expect(document.getElementById(RESULT_HEADING_ID)).not.toBeInTheDocument();

    await waitFor(() => {
      expect(document.activeElement).toBe(screen.getAllByRole('radio')[1]);
    });
  });

  it('focuses the description when changing answers with no situation', async () => {
    const marker = 'UNIQUE_ENQUIRY_MARKER_description_only';
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('textbox'), marker);
    await user.click(screen.getByRole('button', { name: /find guidance/i }));

    await waitFor(() => {
      expect(document.getElementById(RESULT_HEADING_ID)).toBeInTheDocument();
    });

    await user.click(
      screen.getByRole('button', { name: /change my answers/i }),
    );

    expect(screen.getByRole('textbox')).toHaveValue(marker);
    expect(
      screen
        .getAllByRole('radio')
        .every((radio) => radio instanceof HTMLInputElement && !radio.checked),
    ).toBe(true);

    await waitFor(() => {
      expect(document.activeElement).toBe(screen.getByRole('textbox'));
    });
  });

  it('has no automated accessibility violations on a known result', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    await user.click(screen.getAllByRole('radio')[0]);
    await user.click(screen.getByRole('button', { name: /find guidance/i }));

    await waitFor(() => {
      expect(document.getElementById(RESULT_HEADING_ID)).toBeInTheDocument();
    });

    const results = await axe.run(container);

    expect(results.violations).toEqual([]);
  });

  it('has no automated accessibility violations on an unknown result', async () => {
    fetchMock().mockResolvedValueOnce(jsonResponse({ topic: unknownTopic }));

    const user = userEvent.setup();
    const { container } = render(<App />);

    await user.click(screen.getAllByRole('radio')[0]);
    await user.click(screen.getByRole('button', { name: /find guidance/i }));

    await waitFor(() => {
      expect(document.getElementById(RESULT_HEADING_ID)).toBeInTheDocument();
    });

    const results = await axe.run(container);

    expect(results.violations).toEqual([]);
  });
});
