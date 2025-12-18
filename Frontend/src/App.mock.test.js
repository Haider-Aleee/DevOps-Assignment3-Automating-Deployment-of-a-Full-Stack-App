import React from 'react';
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import App from './App';

jest.mock("./cartItem", () => {
  return function DummyCartItem(props) {
    return (
      <div data-testid="dummycartitem">
        Dummy CartItem
      </div>
    );
  };
});

describe('Test Suite for App Component', () => {
  beforeAll(() => jest.spyOn(window, 'fetch'))
  afterAll(() => window.fetch.mockClear())

  test('renders with mocked out CartItem', async () => {
    window.fetch.mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: async () => ({
        cartID: "777",
        cartItems: [
          {
            title: "TestItemOneTitle",
            description: "TestItemOneDesc",
            cost: 111,
            imageUrl: "https://m.media-amazon.com/images/I/51VCKN8qupL._AC_UL320_.jpg"
          }
        ]
      }),
    })

    render(<App cartId={777} />);
    expect(await screen.findByTestId("dummycartitem")).toBeInTheDocument();
    expect(screen.getByTestId('dummycartitem')).toHaveTextContent('Dummy CartItem')
  });
});
