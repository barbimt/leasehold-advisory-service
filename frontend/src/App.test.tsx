import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App.tsx';
import {
  ERROR_SUMMARY_ID,
  SITUATION_FIELDSET_ID,
} from './features/enquiry/ids.ts';
import { SCENARIO_OPTIONS } from './features/enquiry/scenarios.ts';

const submitForm = async () => {
  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: /find guidance/i }));
  return user;
};

describe('enquiry page', () => {
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

    expect(document.getElementById(ERROR_SUMMARY_ID)).not.toBeInTheDocument();
    expect(screen.getAllByRole('radio')[0]).toBeChecked();
  });

  it('accepts a description without a situation', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('textbox'), 'The roof needs work');
    await user.click(screen.getByRole('button', { name: /find guidance/i }));

    expect(document.getElementById(ERROR_SUMMARY_ID)).not.toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue('The roof needs work');
  });

  it('shows an error summary when both fields are empty', async () => {
    render(<App />);

    await submitForm();

    const summary = document.getElementById(ERROR_SUMMARY_ID);

    expect(summary).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /situation or tell us/i }),
    ).toHaveAttribute('href', `#${SITUATION_FIELDSET_ID}`);
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

    expect(screen.getAllByRole('radio').every((radio) => !radio.checked)).toBe(
      true,
    );
    expect(screen.getByRole('textbox')).toHaveValue('');
    expect(document.getElementById(ERROR_SUMMARY_ID)).not.toBeInTheDocument();
    expect(document.activeElement).toBe(
      document.getElementById(SITUATION_FIELDSET_ID),
    );
  });

  it('associates help text with the description field', () => {
    render(<App />);

    const description = screen.getByRole('textbox');

    expect(description).toHaveAccessibleName();
    expect(description.getAttribute('aria-describedby')).toBeTruthy();
  });

  it('associates a visible label with each situation choice', () => {
    render(<App />);

    for (const radio of screen.getAllByRole('radio')) {
      expect(radio).toHaveAccessibleName();
    }
  });
});
