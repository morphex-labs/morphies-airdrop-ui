import * as React from 'react';
import { ColumnDef, getCoreRowModel, useReactTable, getSortedRowModel, SortingState } from '@tanstack/react-table';
import { DisclosureState } from 'ariakit';
import Table from '~/components/Table';
import type { IVesting } from '~/types';
import ClaimButton from './CustomValues/ClaimButton';
import ExplorerLink from './CustomValues/ExplorerLink';
import Status, { statusAccessorFn } from './CustomValues/Status';
import Unclaimed from './CustomValues/Unclaimed';
import { useLocale } from '~/hooks';

export default function VestingTable({
  data,
  claimDialog,
  claimValues,
}: {
  data: IVesting[];
  claimDialog: DisclosureState;
  claimValues: React.MutableRefObject<IVesting | null>;
}) {
  const { locale } = useLocale();

  let columns = React.useMemo<ColumnDef<IVesting>[]>(
    () => [
      {
        accessorFn: (row) => Number(row.totalLocked) / 10 ** row.tokenDecimals,
        id: 'total_locked',
        header: 'Total Vesting',
        cell: (info) =>
          info.cell.row.original && (
            <span className="font-exo text-center slashed-zero tabular-nums dark:text-white">
              {info.getValue<number>()?.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
            </span>
          ),
      },
      {
        accessorFn: (row) => Number(row.totalClaimed) / 10 ** row.tokenDecimals,
        id: 'claimed',
        header: 'Claimed',
        cell: (info) => (
          <span className="font-exo text-center slashed-zero tabular-nums dark:text-white">
            {info.getValue<number>()?.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
          </span>
        ),
      },
      {
        accessorKey: 'unclaimed',
        header: 'Withdrawable',
        cell: ({ cell }) => cell.row.original && <Unclaimed data={cell.row.original} />,
      },
      {
        accessorFn: (row) => statusAccessorFn(row),
        id: 'status',
        header: 'Status',
        cell: ({ cell }) => cell.row.original && <Status data={cell.row.original} />,
      },
      {
        id: 'claim',
        header: '',
        cell: ({ cell }) =>
          cell.row.original && (
            <ClaimButton data={cell.row.original} claimDialog={claimDialog} claimValues={claimValues} />
          ),
      },
      {
        id: 'viewContract',
        header: '',
        cell: ({ cell }) =>
          cell.row.original && (
            <ExplorerLink
              query={cell.row.original.contract}
              value={<span className="row-action-links font-exo float-right dark:text-white">Contract</span>}
            />
          ),
      },
    ],
    [claimDialog, claimValues, locale]
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const hasReason = data.some((e) => e.reason !== null);
  if (!hasReason) {
    columns = columns.filter((e) => e.id !== 'reason');
  }
  const instance = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  return <Table instance={instance} hidePagination={true} maxWidthColumn={7} />;
}
