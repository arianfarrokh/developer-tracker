import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation } from "@apollo/client/react";
import { deleteGoalMutation } from "../graphql/mutation";

type DeleteGoalDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goalId: string | null;
  onDeleted: () => void;
};

export function DeleteGoalDialog({
  open,
  goalId,
  onOpenChange,
  onDeleted,
}: DeleteGoalDialogProps) {
  const [deleteGoal, { loading: deleteGoalLoading }] =
    useMutation(deleteGoalMutation);

  const handleDeleteGoal =  () => {
    console.log("meo")
    if (!goalId) return;

    console.log("wufff")
    try {
       deleteGoal({
        variables: {
          input: {
            id: goalId,
          },
        },
      });

      onOpenChange(false);
      onDeleted()

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>حذف هدف</DialogTitle>
          <DialogDescription>
            آیا از حذف این هدف اطمینان دارید؟
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            لغو
          </Button>

          <Button
            variant="destructive"
            disabled={deleteGoalLoading || !goalId}
            onClick={handleDeleteGoal}
          >
            {deleteGoalLoading ? "در حال حذف..." : "حذف"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}