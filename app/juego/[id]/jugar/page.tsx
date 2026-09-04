import { notFound } from "next/navigation";
import { GAMES } from "@/app/data/games";
import GamePlayer from "@/components/GamePlayer";

export default async function GamePlayerPage(props: PageProps<"/juego/[id]/jugar">) {
  const { id } = await props.params;
  const game = GAMES.find((g) => g.id === id);
  if (!game) notFound();

  return <GamePlayer game={game} />;
}
