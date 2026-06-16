import { AlertCircle, Inbox } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

type StaticStateProps =
  | {
      readonly state: "loading";
    }
  | {
      readonly state: "empty";
      readonly title: string;
      readonly message: string;
    }
  | {
      readonly state: "error";
      readonly title: string;
      readonly message: string;
    };

export function StaticState(props: StaticStateProps) {
  if (props.state === "loading") {
    return (
      <Card aria-label="Laddar innehall">
        <CardContent className="space-y-4 pt-6">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    );
  }

  if (props.state === "error") {
    return (
      <Alert>
        <div className="flex gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <div>
            <AlertTitle>{props.title}</AlertTitle>
            <AlertDescription>{props.message}</AlertDescription>
          </div>
        </div>
      </Alert>
    );
  }

  return (
    <Card>
      <CardContent className="flex items-start gap-3 pt-6 text-muted-foreground">
        <Inbox className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <div>
          <h2 className="font-semibold text-foreground">{props.title}</h2>
          <p className="mt-1 text-sm leading-6">{props.message}</p>
        </div>
      </CardContent>
    </Card>
  );
}
