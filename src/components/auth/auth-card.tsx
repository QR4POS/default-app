import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AuthCard({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{title}</CardTitle>
        {description ? (
          <CardDescription>{description}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer ? <div className="pb-6">{footer}</div> : null}
    </Card>
  );
}
