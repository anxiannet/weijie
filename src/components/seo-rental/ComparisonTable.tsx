import type {ComparisonTableData} from '@/lib/seo-rental-pages';

type ComparisonTableProps = {
  table: ComparisonTableData;
};

export function ComparisonTable({table}: ComparisonTableProps) {
  return (
    <section className="rounded-3xl border bg-card p-4 shadow-sm md:p-6">
      <h2 className="px-2 pt-2 font-headline text-2xl font-bold text-foreground">{table.caption}</h2>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[720px] border-separate border-spacing-0 text-left text-sm">
          <thead>
            <tr>
              {table.headers.map((header) => (
                <th key={header} className="border-b bg-muted/50 px-4 py-3 font-semibold text-foreground first:rounded-l-xl last:rounded-r-xl">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => (
              <tr key={row.join('-')} className="align-top">
                {row.map((cell, index) => (
                  <td key={`${cell}-${index}`} className="border-b px-4 py-4 leading-7 text-muted-foreground">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
