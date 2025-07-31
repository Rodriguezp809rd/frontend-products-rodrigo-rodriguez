import { render, screen, fireEvent } from '@testing-library/react';
import ProductRow from '@/components/table/ProductRow';
import { Product } from '@/core/domain/Product';

const mockProduct: Product = {
  id: 'P001',
  name: 'Producto A',
  description: 'Descripción del producto A',
  logo: 'https://example.com/logo-a.png',
  date_release: '2025-08-01',
  date_revision: '2026-08-01',
};

describe('ProductRow', () => {
  it('debe renderizar los datos del producto', () => {
    render(
      <table>
        <tbody>
          <ProductRow product={mockProduct} onEdit={jest.fn()} onDelete={jest.fn()} />
        </tbody>
      </table>
    );

    expect(screen.getByText('Producto A')).toBeInTheDocument();
    expect(screen.getByText('Descripción del producto A')).toBeInTheDocument();
    expect(screen.getByText('2025-08-01')).toBeInTheDocument();
    expect(screen.getByText('2026-08-01')).toBeInTheDocument();

    const logo = screen.getByAltText('Producto A') as HTMLImageElement;
    expect(logo).toBeInTheDocument();
    expect(logo.src).toBe(mockProduct.logo);
  });

  it('debe llamar a onEdit cuando se hace clic en "Editar"', () => {
    const onEdit = jest.fn();

    render(
      <table>
        <tbody>
          <ProductRow product={mockProduct} onEdit={onEdit} onDelete={jest.fn()} />
        </tbody>
      </table>
    );

    fireEvent.click(screen.getByText('Editar'));
    expect(onEdit).toHaveBeenCalledWith(mockProduct);
  });

  it('debe llamar a onDelete cuando se hace clic en "Eliminar"', () => {
    const onDelete = jest.fn();

    render(
      <table>
        <tbody>
          <ProductRow product={mockProduct} onEdit={jest.fn()} onDelete={onDelete} />
        </tbody>
      </table>
    );

    fireEvent.click(screen.getByText('Eliminar'));
    expect(onDelete).toHaveBeenCalledWith(mockProduct);
  });
});
