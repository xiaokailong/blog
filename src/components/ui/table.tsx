import { cn } from '@/lib/utils'

function Table({ className, ...props }: any) {
  return (
    <div className="relative w-full overflow-auto">
      <table className={cn('w-full caption-bottom text-sm', className)} {...props} />
    </div>
  )
}

function TableHeader({ className, ...props }: any) {
  return <thead className={cn('[&_tr]:border-b', className)} {...props} />
}

function TableBody({ className, ...props }: any) {
  return <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props} />
}

function TableFooter({ className, ...props }: any) {
  return <tfoot className={cn('border-t bg-gray-100/50 font-medium last:[&>tr]:border-b-0', className)} {...props} />
}

function TableRow({ className, ...props }: any) {
  return (
    <tr
      className={cn('border-b transition-colors hover:bg-gray-100/50 data-[state=selected]:bg-gray-100', className)}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: any) {
  return (
    <th
      className={cn(
        'h-10 px-2 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: any) {
  return (
    <td
      className={cn('p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]', className)}
      {...props}
    />
  )
}

function TableCaption({ className, ...props }: any) {
  return <caption className={cn('mt-4 text-sm text-gray-500', className)} {...props} />
}

export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow }
