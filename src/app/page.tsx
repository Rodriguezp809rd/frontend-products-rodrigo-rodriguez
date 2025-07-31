'use client';

import React, { useState, useEffect } from 'react';
import { getProducts } from '@/core/usecases/product/getProducts';

import { Product } from '@/core/domain/Product';
import SearchInput from '@/components/ui/SearchInput';
import PaginationSelect from '@/components/ui/PaginationSelect';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import DropdownMenu from '@/components/ui/DropdownMenu';
import SkeletonRow from '@/components/table/SkeletonRow';
import PaginationButtons from '@/components/ui/PaginationButtons';
import { useRouter } from 'next/navigation';
import { ProductApiRepository } from '@/infrastructure/repositories/ProductApiRepository';

export default function HomePage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [perPage, setPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const response = await getProducts(ProductApiRepository)(currentPage, perPage);
        console.log('[TEST] Productos cargados:', response.data);
        setProducts(response.data);
        setTotal(response.total);
        setError('');
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Ocurrió un error al cargar los productos');
      } finally {
        setTimeout(() => setIsLoading(false), 1000);
      }
    }
    fetchData();
  }, [currentPage, perPage]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const productsToRender = search ? filteredProducts : products;

  const handleDelete = (product: Product) => {
    setProductToDelete(product);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await ProductApiRepository.delete(productToDelete.id);
      const updatedList = products.filter((p) => p.id !== productToDelete.id);
      setProducts(updatedList);
    } catch (error) {
      console.error('Failed to delete product:', error);
    } finally {
      setIsModalOpen(false);
      setProductToDelete(null);
    }
  };

  return (
    <main style={{ backgroundColor: '#f5f6fa', minHeight: '100vh', padding: '48px 24px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <SearchInput value={search} onChange={setSearch} />
          <button
            onClick={() => router.push('/create')}
            style={{
              backgroundColor: '#FADB14',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Agregar
          </button>
        </div>

        {error && <p style={{ color: 'red', marginBottom: '12px' }}>{error}</p>}

        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead style={{ backgroundColor: '#F9FAFC', color: '#696A6C' }}>
                <tr>
                  <th style={thStyle}>Logo</th>
                  <th style={thStyle}>Nombre del producto <HelpIcon /></th>
                  <th style={thStyle}>Descripción <HelpIcon /></th>
                  <th style={thStyle}>Fecha de liberación <HelpIcon /></th>
                  <th style={thStyle}>Fecha de reestructuración <HelpIcon /></th>
                  <th style={thStyle}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <SkeletonRow count={perPage} data-testid="skeleton-row" />
                ) : productsToRender.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '16px', color: '#999' }}>
                      No se encontraron productos.
                    </td>
                  </tr>
                ) : (
                  productsToRender.map((product) => (
                    <tr key={product.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={tdStyle}><img src={product.logo} alt="logo" width={24} height={24} /></td>
                      <td style={tdStyle}>{product.name}</td>
                      <td style={tdStyle}>{product.description}</td>
                      <td style={tdStyle}>{product.date_release}</td>
                      <td style={tdStyle}>{product.date_revision}</td>
                      <td style={tdStyle}>
                        <DropdownMenu
                          onEdit={() => {
                            localStorage.setItem('producto_a_editar', JSON.stringify(product));
                            router.push('/create');
                          }}
                          onDelete={() => handleDelete(product)}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
            <p style={{ fontSize: '12px' }}>{filteredProducts.length} Resultados</p>
            <PaginationSelect value={perPage} onChange={(value) => {
              setPerPage(value);
              setCurrentPage(1);
            }} />
          </div>

          <PaginationButtons
            currentPage={currentPage}
            totalPages={Math.ceil(total / perPage)}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        message={<span>¿Estás seguro de que deseas eliminar <strong>{productToDelete?.name}</strong>?</span>}
      />
    </main>
  );
}

function HelpIcon() {
  return <span title="Más información" style={{ marginLeft: '4px', cursor: 'help' }}>ⓘ</span>;
}

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '12px 8px',
  fontWeight: 'bold',
  whiteSpace: 'nowrap',
  color: '#696A6C',
};

const tdStyle: React.CSSProperties = {
  padding: '12px 8px',
  whiteSpace: 'nowrap',
  color: '#2c3e50',
};
