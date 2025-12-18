import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import App from './App';

describe('Test Suite for App Component', () => {
  beforeAll(() => jest.spyOn(window, 'fetch'))
  afterAll(() => window.fetch.mockClear())

  test('renders overall UI correctly', async () => {
    window.fetch.mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: async () => ({
        cartID: "999999",
        cartItems: [
        ]
      }),
    })

    render(<App cartId={999999} />);
    await waitFor(() => screen.getByTestId('thanks_id'))
    const element = screen.getByText("Thank you for shopping with us!");
    expect(element).toBeInTheDocument();
  });

  test('renders header text', async () => {
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
          },
          {
            title: "TestItemTwoTitle",
            description: "TestItemOneDesc",
            cost: 222,
            imageUrl: "https://m.media-amazon.com/images/I/51L5EzDC76L._AC_UY218_.jpg"
          }
        ]
      }),
    })

    render(<App cartId={777} />);
    expect(screen.getByText('Loading shopping cart...')).toBeInTheDocument();
    expect(await screen.findByTestId("cart_heading_id")).toBeInTheDocument();
    expect(screen.getByTestId('cart_heading_id')).toHaveTextContent('Shopping Cart')
    expect(window.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith("/api/carts/777", { "cache": "default", "method": "GET" });
    expect(screen.getByTestId('itemscost_id')).toHaveTextContent("Items: $3.33");
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);
  });

  test('handles server error', async () => {
    window.fetch.mockResolvedValueOnce({
      status: 404,
      ok: false,
      json: async () => ({
        message: "Error: Cart ID was not found",
        error: {}
      }),
    })

    render(<App cartId={0} />);
    expect(await screen.findByTestId("error_heading_id")).toHaveTextContent('Failed to retrieve cart (Error: Cart ID was not found)')
    expect(screen.queryByText("Shopping Cart")).toBeNull();
  })

  test('radio button click shipping cost update is reflected', async () => {
    window.fetch.mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: async () => ({
        cartID: "999999",
        cartItems: [
          {
            title: "TestItemOneTitle",
            description: "TestItemOneDesc",
            cost: 111,
            imageUrl: "https://m.media-amazon.com/images/I/51VCKN8qupL._AC_UL320_.jpg"
          },
          {
            title: "TestItemTwoTitle",
            description: "TestItemOneDesc",
            cost: 222,
            imageUrl: "https://m.media-amazon.com/images/I/51L5EzDC76L._AC_UY218_.jpg"
          }
        ]
      }),
    })

    render(<App cartId={777} />);
    expect(await screen.findByTestId("cart_heading_id")).toBeInTheDocument();
    expect(screen.getByText(/^Order Total/)).toHaveTextContent("Order Total: $3.66");

    let freeRB = screen.getByTestId('radio-button-free');
    expect(freeRB.checked).toEqual(true);
    expect(freeRB).toHaveProperty('checked', true)
    expect(screen.getByTestId('radio-button-free')).toBeChecked()
    fireEvent.click(screen.getByText('$20.00 overnight shipping'))
    const overnightRB = screen.getByTestId('radio-button-overnight');
    expect(overnightRB.checked).toEqual(true);
    expect(freeRB.checked).toEqual(false);
    expect(screen.getByText(/^Order Total/)).toHaveTextContent("Order Total: $25.66");
  });
});
