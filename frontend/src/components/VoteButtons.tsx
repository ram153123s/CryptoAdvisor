import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IconButton, Stack, Tooltip } from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import { fetchVotes, postVote, Vote, VoteSection } from "../api/votes";

interface VoteButtonsProps {
  section: VoteSection;
  itemRef: string;
}

export default function VoteButtons({ section, itemRef }: VoteButtonsProps) {
  const queryClient = useQueryClient();

  // All of the user's votes are loaded once and shared across every button.
  const { data: votes } = useQuery({
    queryKey: ["votes"],
    queryFn: fetchVotes,
  });

  const current =
    votes?.find((v) => v.section === section && v.itemRef === itemRef)?.value ??
    0;

  const mutation = useMutation({
    mutationFn: (value: 1 | -1) => postVote(section, itemRef, value),
    onSuccess: (updated: Vote) => {
      // Patch the shared cache so the highlight flips immediately.
      queryClient.setQueryData<Vote[]>(["votes"], (prev = []) => {
        const others = prev.filter(
          (v) => !(v.section === section && v.itemRef === itemRef),
        );
        return updated.value === 0 ? others : [...others, updated];
      });
    },
  });

  return (
    <Stack direction="row" spacing={0.5}>
      <Tooltip title="Like">
        <span>
          <IconButton
            size="small"
            color={current === 1 ? "primary" : "default"}
            disabled={mutation.isPending}
            onClick={() => mutation.mutate(1)}
          >
            <ThumbUpAltIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Dislike">
        <span>
          <IconButton
            size="small"
            color={current === -1 ? "error" : "default"}
            disabled={mutation.isPending}
            onClick={() => mutation.mutate(-1)}
          >
            <ThumbDownAltIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );
}
