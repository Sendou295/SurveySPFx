import { DatePicker, Label, StackItem } from "@fluentui/react";
import * as React from "react";

export const DOBComponent = ({
    dateOfBirth, handleDateChange, age, today
}: {
    dateOfBirth: Date | undefined,
    handleDateChange: (newDate: Date | null | undefined) => void,
    age: number | undefined,
    today: Date
}) => {
    const formatDate = (date: Date | null | undefined): string => {
        if (!date) return '';
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
    };

    return (
        <StackItem>
            <Label>Page 3: First Question</Label>
            <Label>Question: What is your date of birth?</Label>
            <DatePicker
                onSelectDate={handleDateChange}
                maxDate={today}
                formatDate={formatDate}
                value={dateOfBirth}
                placeholder="Select a date"
            />
            {age !== undefined && (
                <Label>Your age: {age} {age === 1 ? 'year' : 'years'}</Label>
            )}
        </StackItem>
    );
};