import { cn } from "@/lib/utils";

export const LinearProgressBar = ({ progress }: { progress: number }) => {
  return (
    <div className={cn("bg-white/30 w-full rounded-full h-[3px]")}>
      <div
        className={`h-[3px] rounded-full bg-white/100`}
        style={{ width: progress + "%" }}
      ></div>
    </div>
  );
};
