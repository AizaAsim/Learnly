import { ReactNode } from "react";

export const ReelDisplayContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full md:max-w-[914px] grid grid-cols-3 md:grid-cols-4 gap-[1px] md:gap-[3.33px] mx-auto py-0 md:py-5">
      {children}
    </div>
  );
};
