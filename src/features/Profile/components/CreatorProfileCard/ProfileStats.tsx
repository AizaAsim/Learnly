import { Separator } from "@/components/ui/separator";
import { Fragment } from "react";

interface StatItemProps {
  name: string;
  value: number;
  icon: string;
}

const StatItem = ({ name, value, icon }: StatItemProps) => (
  <div className="min-w-[54px] flex flex-col md:flex-row items-center gap-x-1.5 gap-y-0.5">
    <div className="flex gap-x-0.5 md:gap-x-1 items-center">
      <img src={icon} className="w-6 md:w-[28px] h-6 md:h-[28px] text-primaryBlue" alt={name} />
      <span className="font-bold text-primaryBlue/80 text-base md:text-lg leading-[22px] md:leading-6 -tracking-[0.16px] md:-tracking-[0.18px]">
        {value}
      </span>
    </div>
    <span className="font-semibold text-primaryBlue/40 text-[13px] md:text-base leading-4 md:leading-[22px] -tracking-[0.195px] md:-tracking-[0.16px]">
      {name}
    </span>
  </div>
);

interface ProfileStatsProps {
  counts: {
    active?: number;
    views?: number;
    likes?: number;
  };
}

export const ProfileStats = ({ counts }: ProfileStatsProps) => {
  const stats = [
    {
      name: "EduClips",
      value: counts?.active || 0,
      icon: "/icon/video-small.svg",
    },
    {
      name: "Learner's Interaction",
      value: counts?.views || 0,
      icon: "/icon/play-small.svg",
    },
    {
      name: "Likes",
      value: counts?.likes || 0,
      icon: "/icon/heart-small.svg",
    },
  ];

  return (
    <div className="flex justify-center items-center gap-[18px] md:gap-5">
      {stats.map((stat, index) => (
        <Fragment key={stat.name}>
          {index !== 0 && (
            <Separator
              className="h-3 w-[1.5px] md:h-4 md:w-0.5 bg-primaryBlue rounded-[1px]"
              orientation="vertical"
            />
          )}
          <StatItem name={stat.name} value={stat.value} icon={stat.icon} />
        </Fragment>
      ))}
    </div>
  );
};
