import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export interface ReviewCardData {
  name: string;
  subtitle: string;
  avatarEmoji?: string | null;
  avatarUrl?: string | null;
  rating: number;
  quote: string;
}

export default function ReviewCard({ name, subtitle, avatarEmoji, avatarUrl, rating, quote }: ReviewCardData) {
  return (
    <Card className="flex h-full flex-col rounded-[var(--radius-bento)] border-border/80 shadow-[var(--shadow-card)] transition-shadow duration-200 hover:shadow-[var(--shadow-card-hover)]">
      <CardContent className="flex h-full flex-col p-7">
        <div className="mb-5 flex gap-1">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-accent text-accent" />
          ))}
        </div>

        <p className="flex-1 text-[17px] leading-7 text-foreground/90">"{quote}"</p>

        <div className="mt-6 flex items-center gap-3">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt=""
              aria-hidden="true"
              className="h-12 w-12 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-2xl">
              {avatarEmoji}
            </div>
          )}
          <div>
            <p className="text-base font-semibold">{name}</p>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
