import type { CardIcon } from "./types";

type Props = {
  icon: CardIcon;
  bg: string;
  color: string;
  size?: number;
};

export function IconBadge({ icon: Icon, bg, color, size = 32 }: Props) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full"
      style={{ width: size, height: size, backgroundColor: bg }}
    >
      <Icon size={size * 0.44} color={color} strokeWidth={2} />
    </div>
  );
}
