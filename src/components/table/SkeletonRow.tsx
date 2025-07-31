// components/SkeletonRow.tsx
export default function SkeletonRow({ count = 5, 'data-testid': dataTestId }: { count?: number, 'data-testid'?: string }) {
  const rows = Array.from({ length: count });

  return (
    <>
      {rows.map((_, i) => (
        <tr key={i} data-testid={dataTestId} style={{ borderBottom: '1px solid #eee' }}>
          {[...Array(6)].map((_, j) => (
            <td key={j} style={{ padding: '12px 8px' }}>
              <div
                style={{
                  height: '16px',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '4px',
                  animation: 'pulse 1.5s infinite ease-in-out',
                }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
