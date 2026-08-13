import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { TiPinOutline } from "react-icons/ti";
import { Separator } from "../ui/separator";
import { colors } from "@/lib/color";
import { CustomProgress } from "../progress/CustomProgress";

type MainCardProps = {
    technologies?: string[];
    title?: string;
    active?: string;
    description?: string;
    progress?: number;
};

export default function MainCard({
    technologies , title, active, description
}: MainCardProps) {
    return (
        <Card className="max-w-[24rem] border-l-4 border-l-primary">
            <div className="flex items-center justify-end px-2">
                <TiPinOutline className="w-4 h-4" />
            </div>

            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm md:text-[1.8rem]">
                        {title}
                    </CardTitle>
                </div>
                <div className="flex justify-end">
                    <div className="rounded-2xl border p-2"
                        style={{
                            backgroundColor: colors.accent.green,
                        }}>
                        {active}
                    </div>
                </div>
                <div className="flex justify-center mt-0.5">
                    <CustomProgress value={30} />
                </div>
            </CardHeader>
            <div className="px-2">
                <Separator />
            </div>
            <CardContent>
                <p className="text[0.7rem] md:text-[0.8rem] py-0.5">
                    {description}
                </p>
                <div className="px-2">
                    <Separator />
                </div>
                <div className="mt-2 grid grid-cols-5 gap-1.5">
                    {technologies?.length && technologies.map((tech) => (
                        <Badge
                            key={tech}
                            variant="outline"
                            className="w-full justify-center px-1 text-[0.65rem]"
                        >
                            {tech}
                        </Badge>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}