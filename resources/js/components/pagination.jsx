import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';

export default function Pagination({ links = [] }) {
    if (!links.length) return null;

    return (
        <div className="mt-8 flex justify-center">
            <nav className="flex items-center gap-2 text-sm">
                {links.map((link, index) => (
                    <Link
                        key={index}
                        href={link.url || '#'}
                        preserveScroll
                        className={cn(
                            'px-3 py-1.5 rounded-lg border transition-all duration-200',
                            'focus:outline-none focus:ring-2 focus:ring-sky-400/40',
                            link.active
                                ? 'bg-sky-600 border-sky-600 text-white shadow-sm'
                                : 'border-gray-300 bg-white text-gray-700 hover:bg-sky-50 hover:border-sky-400 hover:text-sky-700 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-sky-950/40 dark:hover:text-sky-300',
                            !link.url && 'cursor-not-allowed opacity-50'
                        )}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </nav>
        </div>
    );
}
