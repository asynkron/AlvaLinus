import { Inbox } from "lucide-react";

import { Card, CardContent } from "./ui/card";

type StaticStateProps = {
  readonly title: string;
  readonly message: string;
};

export function StaticState({ title, message }: StaticStateProps) {
  return (
    <Card>
      <CardContent className="flex items-start gap-3 pt-6 text-muted-foreground">
        <Inbox className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <div>
          <h2 className="font-semibold text-foreground">{title}</h2>
          <p className="mt-1 text-sm leading-6">{message}</p>
        </div>
      </CardContent>
    </Card>
  );
}
