import { Product } from '@/core/domain/Product';
import { updateProduct } from '@/core/usecases/product/updateProduct';
import { ProductApiRepository } from '@/infrastructure/repositories/ProductApiRepository';

jest.mock('@/infrastructure/repositories/ProductApiRepository', () => ({
  ProductApiRepository: {
    update: jest.fn(),
    // mockea otros métodos si los necesitas en otros tests
    getAll: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
    verifyId: jest.fn(),
  },
}));

describe('updateProduct', () => {
  it('should call repository update with correct product data', async () => {
    const mockData: Product = {
      id: '1',
      name: 'Cafetera',
      description: 'Hace café automáticamente',
      logo: 'https://example.com/logo.png',
      date_release: '2025-08-01',
      date_revision: '2026-08-01',
    };

    (ProductApiRepository.update as jest.Mock).mockResolvedValue({ message: 'ok' });

    await updateProduct(ProductApiRepository)(mockData.id, mockData);

    expect(ProductApiRepository.update).toHaveBeenCalledWith(mockData.id, mockData);
  });
});
