import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.jsx';

export function TransactionHistory({ transactions }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" /> Recent Transactions
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="py-3 text-left">Date</th>
                                <th className="py-3 text-left">Description</th>
                                <th className="py-3 text-left">Amount</th>
                                <th className="py-3 text-left">Status</th>
                                <th className="py-3 text-left">Method</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions?.length > 0 ? (
                                transactions.map((t) => (
                                    <tr key={t.id} className="border-b">
                                        <td className="py-3">
                                            {new Date(
                                                t.created_at,
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="py-3">
                                            {t.description}
                                        </td>
                                        <td className="py-3 font-medium">
                                            ₦{t.amount.toLocaleString()}
                                        </td>
                                        <td className="py-3">
                                            <Badge
                                                variant={
                                                    t.status === 'completed'
                                                        ? 'default'
                                                        : t.status === 'failed'
                                                          ? 'destructive'
                                                          : 'secondary'
                                                }
                                            >
                                                {t.status}
                                            </Badge>
                                        </td>
                                        <td className="py-3 capitalize">
                                            {t.payment_method.replace('_', ' ')}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="py-8 text-center text-gray-500"
                                    >
                                        No transactions yet
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
