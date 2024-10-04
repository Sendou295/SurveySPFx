import { Dropdown, IDropdownOption, Label, StackItem, TextField } from "@fluentui/react";
import * as React from "react";

export const SkillsComponent = ({
    skillsList, selectedSkills, handleSkillChange, customSkill, handleCustomSkillsChange
}: {
    skillsList: IDropdownOption[],
    selectedSkills: string[],
    handleSkillChange: (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => void,
    customSkill: string,
    handleCustomSkillsChange: (event: React.FormEvent<HTMLInputElement>, newValue?: string) => void
}) => {
    return (
        <StackItem>
            <Label>Page 2: Skills Question</Label>
            <Label>Question: What skills do you have?</Label>
            <Dropdown
                placeholder="Select skills"
                options={skillsList}
                multiSelect
                selectedKeys={selectedSkills}
                onChange={handleSkillChange}
            />
            <TextField
                label="Please specify custom skills (comma separated)"
                value={customSkill}
                onChange={handleCustomSkillsChange}
            />
        </StackItem>
    );
};