import WorkItemView from "@/containers/workItem/WorkItemView";

type WorkItemPageProps = {
  params: Promise<{ goalId: string; workItemId: string }>;
};

export default async function WorkItemPage({ params }: WorkItemPageProps) {
  const { goalId, workItemId } = await params;
  return <WorkItemView goalId={goalId} workItemId={workItemId} />;
}