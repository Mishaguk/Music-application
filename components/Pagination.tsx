"use client";

import { pagination_offset } from "@/constants";
import { Pagination as MuiPagination } from "@mui/material";
import { useSearchParams, useRouter } from "next/navigation";

import { memo, useCallback } from "react";

type Props = {
  totalCount: number;
};

const Pagination = ({ totalCount }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = searchParams.get("page") || 0;
  const limit = searchParams.get("liimit") || pagination_offset;

  const createQueryString = useCallback(
    (params: Record<string, string>) => {
      const newParams = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([key, value]) => {
        newParams.set(key, value);
      });
      return newParams.toString();
    },
    [searchParams]
  );

  const count = Math.ceil(totalCount / Number(limit)) || 1;

  return (
    <MuiPagination
      count={count}
      page={Number(page) + 1}
      color="primary"
      onChange={(_event, newPage) => {
        router.push(
          `?${createQueryString({
            page: (newPage - 1).toString(),
            limit: limit.toString(),
          })}`
        );
      }}
    />
  );
};

export default memo(Pagination);
