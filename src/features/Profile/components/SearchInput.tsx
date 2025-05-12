import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import { AiFillCloseCircle } from "react-icons/ai";

interface SearchInputProps {
  searchValue: string;
  setSearchValue: (value: string) => void;
  className?: string;
}

export const SearchInput = ({
  searchValue,
  setSearchValue,
  className,
}: SearchInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 bg-grayscale-4 rounded-xl pl-[15px] py-[13px] relative",
        className
      )}
      onClick={() => inputRef.current?.focus()}
    >
      <img
        src="/icon/search-light.svg"
        alt="search"
        className="size-[18px] pointer-events-none select-none"
      />
      <Input
        placeholder="Search"
        className="border-none bg-transparent rounded-t-none rounded-b-none  placeholder:text-grayscale-40 placeholder:text-sm placeholder:font-semibold text-grayscale-80 p-0 h-auto"
        ref={inputRef}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      {searchValue && (
        <AiFillCloseCircle
          size={25}
          className="text-grayscale-30 absolute right-3 cursor-pointer"
          onClick={() => setSearchValue("")}
        />
      )}
    </div>
  );
};
