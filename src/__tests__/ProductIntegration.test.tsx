'use client';
import { Product } from '@/core/domain/Product';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateProductPage from '@/app/create/page';

// MOCK: usecases
jest.mock('@/core/usecases/product/createProduct', () => ({
  createProduct: () => async (product: Product): Promise<Product> =>
    Promise.resolve(product),
}));

jest.mock('@/core/usecases/product/verifyProductId', () => ({
  verifyProductId: () => async () => false, // no existe en la BD
}));

// MOCK: repository
jest.mock('@/infrastructure/repositories/ProductApiRepository', () => ({
  ProductApiRepository: {},
}));

describe('ProductIntegration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('debe mostrar mensaje de éxito después del submit', async () => {
    render(<CreateProductPage />);

    fireEvent.change(screen.getByLabelText(/id/i), { target: { value: 'P123' } });
    fireEvent.change(screen.getByLabelText(/nombre del producto/i), {
      target: { value: 'Cafetera' },
    });
    fireEvent.change(screen.getByLabelText(/descripción/i), {
      target: { value: 'Hace café automáticamente' },
    });
    fireEvent.change(screen.getByLabelText(/logo/i), {
      target: { value: 'https://logo.com/cafe.png' },
    });
    fireEvent.change(screen.getByLabelText(/fecha de lanzamiento/i), {
      target: { value: '2025-08-01' },
    });
    fireEvent.change(screen.getByLabelText(/fecha de revisión/i), {
      target: { value: '2026-08-01' },
    });

    fireEvent.click(screen.getByRole('button', { name: /enviar/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/producto guardado exitosamente/i)
      ).toBeInTheDocument();
    });
  });
});
