import { ArrowRight, Inbox } from "lucide-react";

import { Card, CardContent } from "./ui/card";

type StaticStateAction = {
  readonly label: string;
  readonly href: string;
};

type StaticStateProps = {
  readonly title: string;
  readonly message: string;
  readonly action?: StaticStateAction;
};

export function StaticState({ title, message, action }: StaticStateProps) {
  return (
    <Card>
      <CardContent className="flex items-start gap-3 pt-6 text-muted-foreground">
        <Inbox className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <div>
          <h2 className="font-semibold text-foreground">{title}</h2>
          <p className="mt-1 text-sm leading-6">{message}</p>
          {action ? (
            <a
              href={action.href}
              className="mt-3 inline-flex items-center text-sm font-semibold text-primary transition-colors hover:text-primary-hover"
            >
              {action.label}
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" aria-hidden="true" />
            </a>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
