import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminOrdersLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-32 mb-2" />
        <Skeleton className="h-5 w-64" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-32" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors">
                    <th className="h-12 px-4 text-left"><Skeleton className="h-4 w-8" /></th>
                    <th className="h-12 px-4 text-left"><Skeleton className="h-4 w-20" /></th>
                    <th className="h-12 px-4 text-left"><Skeleton className="h-4 w-32" /></th>
                    <th className="h-12 px-4 text-left"><Skeleton className="h-4 w-12" /></th>
                    <th className="h-12 px-4 text-left"><Skeleton className="h-4 w-24" /></th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                    <tr key={i} className="border-b transition-colors">
                      <td className="p-4"><Skeleton className="h-5 w-10" /></td>
                      <td className="p-4">
                        <Skeleton className="h-5 w-32 mb-1" />
                        <Skeleton className="h-3 w-40" />
                      </td>
                      <td className="p-4">
                        <Skeleton className="h-5 w-48 mb-1" />
                        <Skeleton className="h-3 w-24" />
                      </td>
                      <td className="p-4"><Skeleton className="h-5 w-16" /></td>
                      <td className="p-4 w-50">
                        <Skeleton className="h-10 w-full rounded-md" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="flex items-center justify-end space-x-2 py-4">
            <Skeleton className="h-9 w-20 rounded-md" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-9 w-16 rounded-md" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
