import { Card } from "@/components/ui/card";

type WelcomeBannerProps = {
  teacher: {
    first_name: string;
    profile_img?: string;
  } | null;
};

export function WelcomeBanner({ teacher }: WelcomeBannerProps) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="relative overflow-hidden bg-gradient-to-r from-primary/20 via-primary/10 to-accent/10 border-primary/20">
      <div className="p-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{currentDate}</p>

            <h1 className="text-3xl font-bold text-balance">
              Welcome back{teacher?.first_name ? `, ${teacher.first_name}` : ""}
            </h1>

            <p className="text-muted-foreground text-pretty">
              Always stay updated in your teaching portal
            </p>
          </div>

          <div className="hidden md:block">
            <img
              src={teacher?.profile_img || ""}
              alt="Teacher illustration"
              className="w-48 h-28 object-contain"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}