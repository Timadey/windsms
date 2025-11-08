import * as React from "react";

import { cn } from "@/lib/utils";

function Table({ className, ...props }) {
    return (
        <div className={cn("relative w-full overflow-auto", className)}>
            <table className="w-full caption-bottom text-sm" {...props} />
        </div>
    );
}

function TableHeader({ className, ...props }) {
    return <thead className={cn("[&_tr]:border-b", className)} {...props} />;
}

function TableBody({ className, ...props }) {
    return <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}

function TableFooter({ className, ...props }) {
    return (
        <tfoot
            className={cn(
                "bg-muted/50 text-foreground font-medium [&>tr]:last:border-b-0",
                className,
            )}
            {...props}
        />
    );
}

function TableRow({ className, ...props }) {
    return (
        <tr
            className={cn(
                "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
                className,
            )}
            {...props}
        />
    );
}

function TableHead({ className, ...props }) {
    return (
        <th
            className={cn(
                "text-muted-foreground h-12 px-4 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0",
                className,
            )}
            {...props}
        />
    );
}

function TableCell({ className, ...props }) {
    return (
        <td
            className={cn(
                "p-4 align-middle [&:has([role=checkbox])]:pr-0",
                className,
            )}
            {...props}
        />
    );
}

function TableCaption({ className, ...props }) {
    return (
        <caption
            className={cn("text-muted-foreground mt-4 text-sm", className)}
            {...props}
        />
    );
}

export {
    Table,
    TableHeader,
    TableBody,
    TableFooter,
    TableRow,
    TableHead,
    TableCell,
    TableCaption,
};


