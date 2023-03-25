import { render, screen } from '@testing-library/react';
import App from './App';
import {title} from "./constants/constants"

test('renders learn react link', () => {
  render(<App />);
  const headerElement = screen.getByText(title);
  expect(headerElement).toBeInTheDocument();
});
