import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";

export default function MainCard() {
    return(
        <Card>
            <CardHeader>
                project
            </CardHeader>
            <CardContent>
                <p>
                    project description
                </p>
            </CardContent>
            <CardFooter>
                <Button variant="outline">
                    View
                </Button>
            </CardFooter>
        </Card>
    )
}