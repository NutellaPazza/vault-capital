import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { ForgotPasswordModal, MAX_CODE_ATTEMPTS, RESEND_COOLDOWN_SECONDS } from './ForgotPasswordModal';
import { toast } from '@/hooks/use-toast';

vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
}));

const toastMock = toast as unknown as ReturnType<typeof vi.fn>;

const renderModal = () =>
  render(<ForgotPasswordModal open onOpenChange={vi.fn()} defaultEmail="" />);

const advance = async (ms: number) => {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
};

const typeInto = (el: HTMLElement, value: string) => {
  fireEvent.change(el, { target: { value } });
};

const getMockCode = () => screen.getByTestId('mock-code').textContent || '';

const wrongCodeFor = (correct: string) => {
  const firstDigit = correct[0];
  const replaced = ((parseInt(firstDigit, 10) + 1) % 10).toString();
  return replaced + correct.slice(1);
};

const sendEmailAndReachStep2 = async (email = 'alex@example.com') => {
  typeInto(screen.getByLabelText('Email'), email);
  fireEvent.click(screen.getByRole('button', { name: /send reset code/i }));
  await advance(500);
};

describe('ForgotPasswordModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows an Invalid email toast and stays on step 1', async () => {
    renderModal();
    typeInto(screen.getByLabelText('Email'), 'not-an-email');
    fireEvent.click(screen.getByRole('button', { name: /send reset code/i }));

    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Invalid email', variant: 'destructive' }),
    );
    expect(screen.getByText('Reset your password')).toBeInTheDocument();
  });

  it('decrements attempts and shows toast on invalid code', async () => {
    renderModal();
    await sendEmailAndReachStep2();

    const correct = getMockCode();
    expect(correct).toMatch(/^\d{6}$/);

    typeInto(screen.getByLabelText('Verification code'), wrongCodeFor(correct));
    fireEvent.click(screen.getByRole('button', { name: /verify/i }));

    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Invalid code', variant: 'destructive' }),
    );
    expect(screen.getByTestId('attempts-left')).toHaveTextContent(
      `${MAX_CODE_ATTEMPTS - 1} of ${MAX_CODE_ATTEMPTS} attempts remaining`,
    );
  });

  it('locks after the max number of attempts and shows Start over', async () => {
    renderModal();
    await sendEmailAndReachStep2();
    const correct = getMockCode();
    const wrong = wrongCodeFor(correct);

    for (let i = 0; i < MAX_CODE_ATTEMPTS; i++) {
      const input = screen.getByLabelText('Verification code') as HTMLInputElement;
      typeInto(input, wrong);
      fireEvent.click(screen.getByRole('button', { name: /verify/i }));
    }

    expect(toastMock).toHaveBeenLastCalledWith(
      expect.objectContaining({ title: 'Too many attempts', variant: 'destructive' }),
    );
    const alert = screen.getByRole('alert');
    expect(within(alert).getByText('Too many attempts')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start over/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^verify/i })).not.toBeInTheDocument();
  });

  it('disables Resend during cooldown and re-enables after it elapses', async () => {
    renderModal();
    await sendEmailAndReachStep2();

    const resendBtn = screen.getByTestId('resend-button') as HTMLButtonElement;
    expect(resendBtn).toBeDisabled();
    expect(resendBtn).toHaveTextContent(`Resend code in ${RESEND_COOLDOWN_SECONDS}s`);

    // Burn one attempt so we can verify resend resets the counter
    const correct = getMockCode();
    typeInto(screen.getByLabelText('Verification code'), wrongCodeFor(correct));
    fireEvent.click(screen.getByRole('button', { name: /verify/i }));
    expect(screen.getByTestId('attempts-left')).toHaveTextContent(
      `${MAX_CODE_ATTEMPTS - 1} of ${MAX_CODE_ATTEMPTS} attempts remaining`,
    );

    await advance(RESEND_COOLDOWN_SECONDS * 1000);
    expect(resendBtn).not.toBeDisabled();
    expect(resendBtn).toHaveTextContent('Resend code');

    fireEvent.click(resendBtn);
    await advance(300);

    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Code resent' }),
    );
    expect(screen.getByTestId('attempts-left')).toHaveTextContent(
      `${MAX_CODE_ATTEMPTS} of ${MAX_CODE_ATTEMPTS} attempts remaining`,
    );
    expect(resendBtn).toBeDisabled();
    expect(resendBtn).toHaveTextContent(`Resend code in ${RESEND_COOLDOWN_SECONDS}s`);
  });

  it('keeps Update password disabled when the password is weak', async () => {
    renderModal();
    await sendEmailAndReachStep2();
    const correct = getMockCode();
    typeInto(screen.getByLabelText('Verification code'), correct);
    fireEvent.click(screen.getByRole('button', { name: /verify/i }));

    expect(screen.getByText('Set a new password')).toBeInTheDocument();
    typeInto(screen.getByLabelText('New password'), 'weak');

    const updateBtn = screen.getByRole('button', { name: /update password/i });
    expect(updateBtn).toBeDisabled();
    // At least one unmet requirement is shown
    expect(screen.getByText('One uppercase letter')).toBeInTheDocument();
  });

  it('completes the full flow with a strong password', async () => {
    renderModal();
    await sendEmailAndReachStep2();
    const correct = getMockCode();
    typeInto(screen.getByLabelText('Verification code'), correct);
    fireEvent.click(screen.getByRole('button', { name: /verify/i }));

    typeInto(screen.getByLabelText('New password'), 'Strong1!aB');
    const updateBtn = screen.getByRole('button', { name: /update password/i });
    expect(updateBtn).not.toBeDisabled();

    fireEvent.click(updateBtn);
    await advance(400);

    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Password updated' }),
    );
    expect(screen.getByText('Password updated')).toBeInTheDocument();
  });
});
