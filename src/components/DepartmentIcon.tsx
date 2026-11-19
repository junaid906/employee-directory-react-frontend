import type { IconType } from "react-icons";
import {
  LuBriefcase,
  LuClipboardList,
  LuCode,
  LuCog,
  LuCpu,
  LuCrown,
  LuDatabase,
  LuFileText,
  LuFolderKanban,
  LuHandshake,
  LuHeadphones,
  LuLightbulb,
  LuMegaphone,
  LuPalette,
  LuPenLine,
  LuPenTool,
  LuRoute,
  LuTarget,
  LuUsers,
  LuWallet,
} from "react-icons/lu";

// Keys are lowercased, trimmed department names.
const DEPARTMENT_ICONS: Record<string, IconType> = {
  "accounts": LuWallet,
  "ceo": LuCrown,
  "cto": LuCrown,
  "management": LuBriefcase,
  "client service": LuHandshake,
  "customer relations": LuHeadphones,
  "content": LuFileText,
  "copy": LuPenLine,
  "creative": LuPalette,
  "design": LuPenTool,
  "crm & catalogue": LuDatabase,
  "dev": LuCode,
  "technology": LuCpu,
  "hr": LuUsers,
  "media": LuMegaphone,
  "operations": LuCog,
  "project": LuFolderKanban,
  "project management": LuClipboardList,
  "project/strategy": LuTarget,
  "strategy": LuLightbulb,
  "traffic manager": LuRoute,
};

interface DepartmentIconProps {
  departmentName: string;
}

export default function DepartmentIcon({ departmentName }: DepartmentIconProps) {
  const Icon = DEPARTMENT_ICONS[departmentName.trim().toLowerCase()];

  if (Icon) return <Icon aria-hidden />;

  return (
    <img src="/favicon.svg" alt="" aria-hidden className="h-[1em] w-[1em]" />
  );
}
