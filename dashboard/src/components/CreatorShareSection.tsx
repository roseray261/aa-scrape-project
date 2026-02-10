"use client";

import dynamic from "next/dynamic";
import type { CreatorShareRow } from "@/lib/chart-utils";

const CreatorShareChart = dynamic(() => import("./CreatorShareChart"), { ssr: false });
const ShareDataTable = dynamic(() => import("./ShareDataTable"), { ssr: false });

interface Props {
  rows: CreatorShareRow[];
  creators: string[];
  csvString: string;
}

export default function CreatorShareSection({ rows, creators, csvString }: Props) {
  return (
    <>
      <CreatorShareChart rows={rows} creators={creators} />
      <ShareDataTable rows={rows} creators={creators} csvString={csvString} />
    </>
  );
}
