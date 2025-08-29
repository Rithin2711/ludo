import { render, screen } from '@testing-library/react';
import App from './App';

test('renders navbar brand', () => {
  render(<App />);
  const brand = screen.getByLabelText(/LudoMaster home/i);
  expect(brand).toBeInTheDocument();
});
