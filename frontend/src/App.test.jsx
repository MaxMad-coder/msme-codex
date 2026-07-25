import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import App from './App';

vi.mock('axios');

describe('App', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: { status: 'ok' } });
  });

  it('renders main dashboard and can submit a query', async () => {
    axios.post.mockResolvedValue({ data: { final_answer: 'Test answer', confidence: 0.8, reasoning_chain: [] } });

    render(<App />);

    expect(screen.getByText(/MSME AI Copilot/i)).toBeInTheDocument();
    expect(await screen.findByText(/Backend status:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Ask Copilot/i })).toBeEnabled();

    const textarea = screen.getByRole('textbox', { name: /Business question/i });
    fireEvent.change(textarea, { target: { value: 'Check sugar stock for reorder' } });

    fireEvent.click(screen.getByRole('button', { name: /Ask Copilot/i }));

    await waitFor(() => expect(screen.getByText(/Test answer/i)).toBeInTheDocument());
  });
});
