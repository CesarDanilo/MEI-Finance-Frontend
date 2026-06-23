import {
  AlertTriangle,
  Inbox,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type QueryStateProps = {
  isLoading?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
  skeleton?: React.ReactNode;
};

export function QueryState({
  isLoading,
  isError,
  isEmpty,
  onRetry,
  emptyTitle = "Nada por aqui ainda",
  emptyDescription = "Quando houver dados, eles aparecerão nesta área.",
  emptyAction,
  className,
  children,
  skeleton,
}: QueryStateProps) {
  if (isLoading) {
    return (
      <div className={cn("space-y-3", className)}>
        {skeleton ?? (
          <>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </>
        )}
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card px-6 py-10 text-center",
          className,
        )}
      >
        <AlertTriangle className="size-8 text-finance-warning" />
        <div>
          <p className="font-medium text-foreground">
            Não foi possível carregar os dados
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Verifique sua conexão e tente novamente.
          </p>
        </div>
        {onRetry && (
          <Button variant="outline" onClick={onRetry}>
            <RefreshCw className="size-4" />
            Tentar novamente
          </Button>
        )}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card px-6 py-10 text-center",
          className,
        )}
      >
        <Inbox className="size-8 text-muted-foreground" />
        <div>
          <p className="font-medium text-foreground">{emptyTitle}</p>
          <p className="mt-1 text-sm text-muted-foreground">{emptyDescription}</p>
        </div>
        {emptyAction}
      </div>
    );
  }

  return <>{children}</>;
}
