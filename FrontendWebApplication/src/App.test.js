import { render, screen } from '@testing-library/react';
import App from './App';

test('renders LudoMaster header', () => {
  render(<App />);
  const title = screen.getByLabelText(/App name/i);
  expect(title).toBeInTheDocument();
});
