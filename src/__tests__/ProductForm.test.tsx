import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import ProductForm from '@/components/form/ProductForm';
import '@testing-library/jest-dom';

const TODAY = '2025-07-30';
const NEXT_YEAR = '2026-07-30';

beforeAll(() => {
  jest.useFakeTimers().setSystemTime(new Date(TODAY));
});

afterAll(() => {
  jest.useRealTimers();
});

afterEach(() => {
  cleanup();
});

describe('ProductForm', () => {
  it('debe mostrar errores si los campos están vacíos', async () => {
    const mockSubmit = jest.fn();

    render(
      <ProductForm
        onSubmit={async (product, data, reset) => {
          mockSubmit(product);
          return true;
        }}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /enviar/i }));

    await waitFor(() => {
      expect(screen.getByText(/el id debe tener al menos 3 caracteres/i)).toBeInTheDocument();
      expect(screen.getByText(/el nombre debe tener al menos 5 caracteres/i)).toBeInTheDocument();
      expect(screen.getByText(/la descripción debe tener al menos 10 caracteres/i)).toBeInTheDocument();
      expect(screen.getByText(/la url del logo no es válida/i)).toBeInTheDocument();
      expect(screen.getByText(/la fecha de lanzamiento debe ser hoy o posterior/i)).toBeInTheDocument();
      expect(screen.getByText(/la fecha de revisión debe ser exactamente un año después/i)).toBeInTheDocument();
    });

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('debe mostrar errores si los campos son inválidos', async () => {
    const mockSubmit = jest.fn();

    render(
      <ProductForm
        onSubmit={async (product, data, reset) => {
          mockSubmit(product);
          return true;
        }}
      />
    );

    fireEvent.input(screen.getByLabelText(/id/i), { target: { value: '12' } });
    fireEvent.input(screen.getByLabelText(/logo/i), { target: { value: 'bad-url' } });

    fireEvent.click(screen.getByRole('button', { name: /enviar/i }));

    await waitFor(() => {
      expect(screen.getByText(/el id debe tener al menos 3 caracteres/i)).toBeInTheDocument();
      expect(screen.getByText(/el nombre debe tener al menos 5 caracteres/i)).toBeInTheDocument();
      expect(screen.getByText(/la descripción debe tener al menos 10 caracteres/i)).toBeInTheDocument();
      expect(screen.getByText(/la url del logo no es válida/i)).toBeInTheDocument();
    });

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('debe enviar el formulario si los datos son válidos (label)', async () => {
    const mockSubmit = jest.fn().mockResolvedValue(true);

    render(
      <ProductForm
        onSubmit={async (product, data, reset) => {
          mockSubmit(product);
          return true;
        }}
      />
    );

    fireEvent.input(screen.getByLabelText(/id/i), { target: { value: 'P12345' } });
    fireEvent.input(screen.getByLabelText(/nombre del producto/i), { target: { value: 'Cafetera automática' } });
    fireEvent.input(screen.getByLabelText(/descripción/i), { target: { value: 'Hace café en segundos' } });
    fireEvent.input(screen.getByLabelText(/logo/i), { target: { value: 'https://imagen.com/logo.png' } });
    fireEvent.input(screen.getByLabelText(/fecha de lanzamiento/i), { target: { value: TODAY } });
    fireEvent.input(screen.getByLabelText(/fecha de revisión/i), { target: { value: NEXT_YEAR } });

    fireEvent.click(screen.getByRole('button', { name: /enviar/i }));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled();
    });
  });

  it('debe enviar el formulario si los datos son válidos (placeholder)', async () => {
    const mockSubmit = jest.fn().mockResolvedValue(true);

    render(
      <ProductForm
        onSubmit={async (product, data, reset) => {
          mockSubmit(product);
          return true;
        }}
      />
    );

    fireEvent.input(screen.getByPlaceholderText(/ej\. p12345/i), { target: { value: 'P99999' } });
    fireEvent.input(screen.getByPlaceholderText(/ej\. cafetera automática/i), { target: { value: 'Tetera moderna' } });
    fireEvent.input(screen.getByPlaceholderText(/descripción del producto/i), {
      target: { value: 'Mantiene el té caliente por horas' },
    });
    fireEvent.input(screen.getByPlaceholderText(/https:\/\/imagen\.com\/logo\.png/i), {
      target: { value: 'https://imagen.com/te.png' },
    });
    fireEvent.input(screen.getByLabelText(/fecha de lanzamiento/i), { target: { value: TODAY } });
    fireEvent.input(screen.getByLabelText(/fecha de revisión/i), { target: { value: NEXT_YEAR } });

    fireEvent.click(screen.getByRole('button', { name: /enviar/i }));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled();
    });
  });

  interface CustomError extends Error {
  response?: {
    data?: {
      message?: string;
    };
  };
}

it('muestra error si el ID ya existe en la base de datos (duplicate)', async () => {
  const mockSubmit = jest.fn(async (_product: unknown) => {
    const error: CustomError = new Error('Duplicate') as CustomError;
    error.response = { data: { message: 'Duplicate identifier found in the database' } };
    throw error;
  });

  render(
    <ProductForm
      onSubmit={mockSubmit}
    />
  );

  fireEvent.input(screen.getByLabelText(/id/i), { target: { value: 'P12345' } });
  fireEvent.input(screen.getByLabelText(/nombre del producto/i), { target: { value: 'Cafetera' } });
  fireEvent.input(screen.getByLabelText(/descripción/i), { target: { value: 'Hace café automático' } });
  fireEvent.input(screen.getByLabelText(/logo/i), { target: { value: 'https://img.com/logo.png' } });
  fireEvent.input(screen.getByLabelText(/fecha de lanzamiento/i), { target: { value: TODAY } });
  fireEvent.input(screen.getByLabelText(/fecha de revisión/i), { target: { value: NEXT_YEAR } });

  fireEvent.click(screen.getByRole('button', { name: /enviar/i }));

  await waitFor(() => {
    expect(screen.getByText(/ya existe en la base de datos/i)).toBeInTheDocument();
  });

  expect(mockSubmit).toHaveBeenCalled();
});

  it('debe resetear el formulario si resetOnSubmit es true', async () => {
    const mockSubmit = jest.fn().mockResolvedValue(true);

    render(
      <ProductForm
        onSubmit={mockSubmit}
        resetOnSubmit={true}
      />
    );

    fireEvent.input(screen.getByLabelText(/id/i), { target: { value: 'P00001' } });
    fireEvent.input(screen.getByLabelText(/nombre del producto/i), { target: { value: 'Mouse' } });
    fireEvent.input(screen.getByLabelText(/descripción/i), { target: { value: 'Mouse ergonómico' } });
    fireEvent.input(screen.getByLabelText(/logo/i), { target: { value: 'https://imagen.com/mouse.png' } });
    fireEvent.input(screen.getByLabelText(/fecha de lanzamiento/i), { target: { value: TODAY } });
    fireEvent.input(screen.getByLabelText(/fecha de revisión/i), { target: { value: NEXT_YEAR } });

    fireEvent.click(screen.getByRole('button', { name: /enviar/i }));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled();
      expect(screen.getByLabelText(/id/i)).toHaveValue('');
      expect(screen.getByLabelText(/nombre del producto/i)).toHaveValue('');
      expect(screen.getByLabelText(/descripción/i)).toHaveValue('');
      expect(screen.getByLabelText(/logo/i)).toHaveValue('');
    });
  });

  it('debe mostrar los productos registrados en la sesión', async () => {
    const mockSubmit = jest.fn().mockResolvedValue(true);

    render(
      <ProductForm
        onSubmit={mockSubmit}
        resetOnSubmit={true}
      />
    );

    fireEvent.input(screen.getByLabelText(/id/i), { target: { value: 'P11111' } });
    fireEvent.input(screen.getByLabelText(/nombre del producto/i), { target: { value: 'Monitor LED' } });
    fireEvent.input(screen.getByLabelText(/descripción/i), { target: { value: 'Full HD 24 pulgadas' } });
    fireEvent.input(screen.getByLabelText(/logo/i), { target: { value: 'https://imagen.com/monitor.png' } });
    fireEvent.input(screen.getByLabelText(/fecha de lanzamiento/i), { target: { value: TODAY } });
    fireEvent.input(screen.getByLabelText(/fecha de revisión/i), { target: { value: NEXT_YEAR } });

    fireEvent.click(screen.getByRole('button', { name: /enviar/i }));

    await waitFor(() => {
      expect(screen.getByText(/productos registrados/i)).toBeInTheDocument();
      expect(screen.getByText(/monitor led/i)).toBeInTheDocument();
      expect(screen.getByText(/p11111/i)).toBeInTheDocument();
    });
  });

  it('no debe resetear el formulario si resetOnSubmit es false', async () => {
  const mockSubmit = jest.fn().mockResolvedValue(true);

  render(
    <ProductForm
      onSubmit={mockSubmit}
      resetOnSubmit={false}
    />
  );

  fireEvent.input(screen.getByLabelText(/id/i), { target: { value: 'P22222' } });
  fireEvent.input(screen.getByLabelText(/nombre del producto/i), { target: { value: 'Teclado' } });
  fireEvent.input(screen.getByLabelText(/descripción/i), { target: { value: 'Teclado mecánico' } });
  fireEvent.input(screen.getByLabelText(/logo/i), { target: { value: 'https://imagen.com/teclado.png' } });
  fireEvent.input(screen.getByLabelText(/fecha de lanzamiento/i), { target: { value: TODAY } });
  fireEvent.input(screen.getByLabelText(/fecha de revisión/i), { target: { value: NEXT_YEAR } });

  fireEvent.click(screen.getByRole('button', { name: /enviar/i }));

  await waitFor(() => {
    expect(mockSubmit).toHaveBeenCalled();
    expect(screen.getByLabelText(/id/i)).toHaveValue('P22222');
  });
});
it('llama a onSubmit y falla si hay un error sin mensaje explícito', async () => {
  const mockSubmit = jest.fn(async () => {
    const error = new Error('Error inesperado');
    throw error;
  });

  render(
    <ProductForm
      onSubmit={mockSubmit}
      resetOnSubmit={true}
    />
  );

  fireEvent.input(screen.getByLabelText(/id/i), { target: { value: 'P33333' } });
  fireEvent.input(screen.getByLabelText(/nombre del producto/i), { target: { value: 'Webcam' } });
  fireEvent.input(screen.getByLabelText(/descripción/i), { target: { value: 'Alta definición' } });
  fireEvent.input(screen.getByLabelText(/logo/i), { target: { value: 'https://imagen.com/webcam.png' } });
  fireEvent.input(screen.getByLabelText(/fecha de lanzamiento/i), { target: { value: TODAY } });
  fireEvent.input(screen.getByLabelText(/fecha de revisión/i), { target: { value: NEXT_YEAR } });

  fireEvent.click(screen.getByRole('button', { name: /enviar/i }));

  await waitFor(() => {
    expect(mockSubmit).toHaveBeenCalled();
    expect(screen.getByLabelText(/id/i)).toHaveValue('P33333'); // formulario no fue reseteado
  });
});

it('muestra error si fecha de revisión no es un año después', async () => {
  const mockSubmit = jest.fn();

  render(
    <ProductForm
      onSubmit={mockSubmit}
    />
  );

  fireEvent.input(screen.getByLabelText(/fecha de lanzamiento/i), { target: { value: TODAY } });
  fireEvent.input(screen.getByLabelText(/fecha de revisión/i), { target: { value: '2025-08-30' } });

  fireEvent.click(screen.getByRole('button', { name: /enviar/i }));

  await waitFor(() => {
    expect(screen.getByText(/la fecha de revisión debe ser exactamente un año después/i)).toBeInTheDocument();
  });

  expect(mockSubmit).not.toHaveBeenCalled();
});


});
