import { StackItem, Label, Stack } from "@fluentui/react";
import * as React from "react";
import { Badge } from "@fluentui/react-components";
import { ISurvey } from "../../../../interface";

export const LatestEntryComponent = ({ latestEntry }: { latestEntry: ISurvey | null }) => {
    return (
        latestEntry ? (
            <StackItem>
                <Label>Page 5: Latest Entry Details</Label>
                <Label>Index: {latestEntry.Index}</Label>
                <Label>Fullname: {latestEntry.Fullname}</Label>
                <Label>Email: {latestEntry.Email}</Label>
                DOB: { latestEntry.DOB.toLocaleDateString('en-GB')}
                <Label>Age: {latestEntry.Age}</Label>
                <Label>Rating Survey: {latestEntry.RatingSurvey}</Label>
                <Stack horizontal tokens={{ childrenGap: 10 }} >
                    {Array.isArray(latestEntry.Skills) && latestEntry.Skills.length > 0 ? (
                        latestEntry.Skills.map((skill, index) => (
                            <Badge key={index} appearance="filled">
                                {skill}
                            </Badge>
                        ))
                    ) : (
                        <Badge appearance="outline">No skills selected</Badge>
                    )}
                </Stack>
            </StackItem>
        ) : null
    );
};