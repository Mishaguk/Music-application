"use client";

import { useDebounce } from "@/hooks/useDebounce";
import { Search } from "@mui/icons-material";
import { TextField } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { memo, useEffect, useState } from "react";

const SearchInput = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const defaultQuery = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState(defaultQuery);

  const debouncedInput = useDebounce(searchInput, 500);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (debouncedInput) {
      params.set("search", debouncedInput);
    } else {
      params.delete("search");
    }

    router.replace(`?${params.toString()}`, { scroll: false });
  }, [debouncedInput, router]);

  return (
    <TextField
      placeholder="Search track..."
      slotProps={{ input: { endAdornment: <Search /> } }}
      value={searchInput}
      onChange={(e) => setSearchInput(e.target.value)}
      sx={{
        "& .MuiInputBase-root": {
          borderRadius: 4,
        },
        "& .MuiOutlinedInput-input": {
          padding: 1.5,
          width: 250,
        },
      }}
    />
  );
};

export default memo(SearchInput);
