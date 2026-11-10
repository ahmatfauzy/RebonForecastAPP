import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getHealth } from '../lib/api';
import { HomePage } from './HomePage';

vi.mock('../lib/api', () => ({
  getHealth: vi.fn(),
}));

const mockedGetHealth = vi.mocked(getHealth);

describe('home page API status', () => {
  beforeEach(() => {
    mockedGetHealth.mockReset();
  });

  it('shows a loading state while checking the API', () => {
    mockedGetHealth.mockReturnValue(new Promise(() => {}));

    render(<HomePage />);

    expect(screen.getByRole('status')).toHaveTextContent('Memeriksa koneksi API');
  });

  it('shows the successful API status', async () => {
    mockedGetHealth.mockResolvedValue({ status: 'ok' });

    render(<HomePage />);

    expect(await screen.findByText('API aktif')).toBeInTheDocument();
  });

  it('lets the user retry after an API failure', async () => {
    mockedGetHealth
      .mockRejectedValueOnce(new Error('network failure'))
      .mockResolvedValueOnce({ status: 'ok' });
    const user = userEvent.setup();

    render(<HomePage />);

    expect(await screen.findByRole('alert')).toHaveTextContent('API belum dapat dihubungi');
    await user.click(screen.getByRole('button', { name: 'Coba lagi' }));

    await waitFor(() => expect(mockedGetHealth).toHaveBeenCalledTimes(2));
    expect(await screen.findByText('API aktif')).toBeInTheDocument();
  });
});
