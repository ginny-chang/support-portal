import type { ReactNode } from "react";
import type { TagTone } from "../data/labels";

type StatusTagProps = {
  tone: TagTone;
  children: ReactNode;
};

export function StatusTag({ tone, children }: StatusTagProps) {
  return <span className={`tag tag-${tone}`}>{children}</span>;
}
