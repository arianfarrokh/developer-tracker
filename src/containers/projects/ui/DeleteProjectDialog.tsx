import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation } from "@apollo/client/react";
import { deleteProjectMutation } from "../graphql/mutation";
import { AllProjectsQueryResult } from "../graphql/query";
import { useAlert } from "@/providers/alert-provider";

type Props = {
  id: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
};

export function DeleteProjectDialog({ id, open, onOpenChange, name }: Props) {

    const {show} = useAlert()
  const [deleteProject, { loading }] = useMutation(deleteProjectMutation, {
    refetchQueries: [{ query: AllProjectsQueryResult }],
  });

  const handleDeleteProject = (id: string, name: string) => {
    if (!id) return;

    deleteProject({
      variables: {
        input: {
          id: id,
        },
      },
    });

    onOpenChange(false);

    show({
        title: `پروژه ${name} با موفقیت حذف شد`,
        variant:'success',
        duration: 3000,
    });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle className={"text-center"}>حذف پروژه</DialogTitle>
        <DialogDescription className={"text-center"}>
          آیا می خواهید{" "}پروژه <span className={"font-bold text-red-500"}>{name}</span> را حذف
          کنید؟
        </DialogDescription>
        <div className="flex justify-center gap-2">
          <Button
            onClick={() => handleDeleteProject(id ?? "", name)}
            variant={"destructive"}
          >
            حذف
          </Button>
          <Button onClick={() => onOpenChange(false)} variant={"outline"}>
            انصراف
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
