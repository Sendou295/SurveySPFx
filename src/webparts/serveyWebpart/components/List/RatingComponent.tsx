import { Label, Rating, RatingSize, StackItem } from "@fluentui/react";
import * as React from "react";

export const RatingComponent = ({
    handleRatingChange
}: {
    handleRatingChange: (_event: React.FormEvent<HTMLElement>, rating?: number) => void
}) => {
    return (
        <StackItem>
            <Label>Page 4: Rate Us</Label>
            <Label>Please rate us on a scale of 1 to 5 stars:</Label>
            <Rating
                min={1}
                max={5}
                onChange={handleRatingChange}
                size={RatingSize.Large}
            />
        </StackItem>
    );
};