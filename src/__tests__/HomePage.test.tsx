import React from 'react';
import { fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';
import HomePage from '@/app/page';
import { useRouter } from 'next/navigation';

// 🧪 Mocks controlables
const mockGetProducts = jest.fn();
 const mockDelete = jest.fn();

// 🔁 Mocks globales y UI
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/core/usecases/product/getProducts', () => ({
  getProducts: () => mockGetProducts,
}));



jest.mock('@/infrastructure/repositories/ProductApiRepository', () => ({
  ProductApiRepository: {
    delete: jest.fn(() => Promise.resolve({ message: 'Deleted successfully' })),
  },
}));



jest.mock('@/components/ui/SearchInput', () => {
  const SearchInput = () => <div>SearchInput</div>;
  SearchInput.displayName = 'SearchInput';
  return SearchInput;
});

jest.mock('@/components/ui/PaginationSelect', () => {
  const PaginationSelect = () => <div>PaginationSelect</div>;
  PaginationSelect.displayName = 'PaginationSelect';
  return PaginationSelect;
});

jest.mock('@/components/ui/ConfirmationModal', () => {
  interface ConfirmationModalProps {
    isOpen: boolean;
    onConfirm: () => void;
  }

  const ConfirmationModal = ({ isOpen, onConfirm }: ConfirmationModalProps) => {
    if (!isOpen) return null;

    return (
      <div>
        ¿Estás seguro de que deseas eliminar este producto?
        <button onClick={onConfirm}>Confirmar</button>
      </div>
    );
  };

  ConfirmationModal.displayName = 'ConfirmationModal';
  return ConfirmationModal;
});

jest.mock('@/components/ui/DropdownMenu', () => {
  interface DropdownMenuProps {
    onDelete: () => void;
  }

  const DropdownMenu = ({ onDelete }: DropdownMenuProps) => (
    <button onClick={onDelete}>Eliminar</button>
  );

  DropdownMenu.displayName = 'DropdownMenu';
  return DropdownMenu;
});

jest.mock('@/components/table/SkeletonRow', () => {
  const SkeletonRow = () => (
    <tr data-testid="skeleton-row">
      <td colSpan={6}>Loading skeleton...</td>
    </tr>
  );
  SkeletonRow.displayName = 'SkeletonRow';
  return SkeletonRow;
});

jest.mock('@/components/ui/PaginationButtons', () => {
  const PaginationButtons = () => <div>PaginationButtons</div>;
  PaginationButtons.displayName = 'PaginationButtons';
  return PaginationButtons;
});

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
  });
  // Test de UI y lógica de carga inicial
  it('shows skeleton at first render', () => {
    render(<HomePage />);
    expect(screen.getByTestId('skeleton-row')).toBeInTheDocument();
  });



 it('shows empty table message when no products are returned', async () => {
  mockGetProducts.mockReset();
  mockGetProducts.mockResolvedValueOnce({ data: [], total: 0 });

  render(<HomePage />);

  // ⏳ Espera a que el skeleton desaparezca
  await waitForElementToBeRemoved(() => screen.getByTestId('skeleton-row'), { timeout: 2000 });

  // 🔍 Luego espera el mensaje
  const emptyMessage = await screen.findByText('No se encontraron productos.');
  expect(emptyMessage).toBeInTheDocument();
});



  it('renders product rows when products are returned', async () => {
    mockGetProducts.mockResolvedValueOnce({
      data: [
        {
          id: '1',
          name: 'Producto A',
          description: 'Desc A',
          date_release: '2025-01-01',
          date_revision: '2025-06-01',
          logo: '/logo-a.png',
        },
        {
          id: '2',
          name: 'Producto B',
          description: 'Desc B',
          date_release: '2025-02-01',
          date_revision: '2025-07-01',
          logo: '/logo-b.png',
        },
      ],
      total: 2,
    });

    jest.useFakeTimers();
    render(<HomePage />);

    await act(async () => {
      await Promise.resolve();
      jest.runOnlyPendingTimers();
    });

    const row1 = await screen.findByText('Producto A');
    const row2 = await screen.findByText('Producto B');

    expect(row1).toBeInTheDocument();
    expect(row2).toBeInTheDocument();
  });

  it('navigates to /create when clicking "Agregar"', () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    render(<HomePage />);

    const button = screen.getByRole('button', { name: /agregar/i });
    button.click();

    expect(pushMock).toHaveBeenCalledWith('/create');
  });

  it('opens confirmation modal when clicking "Eliminar" in DropdownMenu', async () => {
    mockGetProducts.mockResolvedValueOnce({
      data: [
        {
          id: '123',
          name: 'Producto X',
          description: 'Desc X',
          date_release: '2025-01-01',
          date_revision: '2025-06-01',
          logo: '/logo-x.png',
        },
      ],
      total: 1,
    });

    jest.useFakeTimers();
    render(<HomePage />);

    await act(async () => {
      await Promise.resolve();
      jest.runOnlyPendingTimers();
    });

    const deleteButton = screen.getByRole('button', { name: /eliminar/i });
    deleteButton.click();

    const modal = await screen.findByText(/¿estás seguro de que deseas eliminar/i);
    expect(modal).toBeInTheDocument();
  });

it('deletes product when confirm is clicked in modal', async () => {
  mockGetProducts.mockReset(); // Asegura que no arrastre valores anteriores
  mockGetProducts.mockResolvedValueOnce({
    data: [
      {
        id: '123',
        name: 'Producto X',
        description: 'Desc X',
        date_release: '2025-01-01',
        date_revision: '2025-06-01',
        logo: '/logo-x.png',
      },
    ],
    total: 1,
  });

  mockDelete.mockReset();
  mockDelete.mockResolvedValueOnce({ message: 'Deleted successfully' });

  render(<HomePage />);

  await waitForElementToBeRemoved(() => screen.getByTestId('skeleton-row'), { timeout: 2000 });

  expect(screen.getByText(/producto x/i)).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /eliminar/i }));
  fireEvent.click(await screen.findByRole('button', { name: /confirmar/i }));

  await waitFor(() => {
    expect(screen.queryByText(/producto x/i)).not.toBeInTheDocument();
  });
});

});
