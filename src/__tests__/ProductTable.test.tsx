import { render, screen, fireEvent } from '@testing-library/react';
import ProductTable from '@/components/table/ProductTable';
import '@testing-library/jest-dom';
import { Product } from '@/core/domain/Product';
const mockProducts: Product[] = [
  {
    id: 'P001',
    name: 'Producto A',
    description: 'Descripción del producto A',
    logo: 'https://example.com/logo-a.png',
    date_release: '2025-08-01',
    date_revision: '2026-08-01',
  },
];

describe('ProductTable', () => {
  it('debe renderizar los productos en la tabla', () => {
    render(
      <ProductTable products={mockProducts} onEdit={jest.fn()} onDelete={jest.fn()} />
    );

    expect(screen.getByText('Producto A')).toBeInTheDocument();
    expect(screen.getByText('Descripción del producto A')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/logo-a.png');
  });

  it('debe llamar a onEdit cuando se hace clic en "Editar"', () => {
    const onEdit = jest.fn();
    render(<ProductTable products={mockProducts} onEdit={onEdit} onDelete={jest.fn()} />);

    fireEvent.click(screen.getByText('Editar'));
    expect(onEdit).toHaveBeenCalledWith(mockProducts[0]);
  });

  it('debe llamar a onDelete cuando se hace clic en "Eliminar"', () => {
    const onDelete = jest.fn();
    render(<ProductTable products={mockProducts} onEdit={jest.fn()} onDelete={onDelete} />);

    fireEvent.click(screen.getByText('Eliminar'));
    expect(onDelete).toHaveBeenCalledWith(mockProducts[0]);
  });
});